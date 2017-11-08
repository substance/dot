import { test } from 'substance-test'
import {
  ProseEditorPackage, EditorSession,
  Configurator, DocumentChange
} from 'substance'
import { User, Master, ArrayLog, PullRequest, ChangeLog } from 'substance-dot'

import simple from './fixtures/simple'
import { example1 } from './fixtures/sample_logs'

// a narrative test that serves as a demo
test("Concurrent Editing: Inserting into the same paragraph", (t) => {
  // we have three 'files' which are used to
  // synchronize two editors
  let masterLog = new ChangeLog(new ArrayLog(example1.master))
  let prA = new PullRequest('A', new ArrayLog(example1.A))
  let prB = new PullRequest('B', new ArrayLog(example1.B))

  // each editor has an editing sessions
  let session1 = _setupEditorSession(simple, prA.getChanges())
  let session2 = _setupEditorSession(simple, prB.getChanges())

  // the actors for the decentralized OT protocol
  let master = new Master(masterLog)
  let userA = new User(prA, session1, masterLog)
  let userB = new User(prB, session2, masterLog)

  let doc1 = session1.getDocument()
  let doc2 = session2.getDocument()

  // The initial state: Both User A, and User B, have
  // done some local changes to 'Hello World!'
  t.equal(doc1.get(['paragraph-1', 'content']), 'ABCHello World!', 'User A has changed their document')
  t.equal(doc2.get(['paragraph-1', 'content']), 'Hello XYZWorld!', 'User B has changed their document')
  _renderLogs(t, masterLog, prA, prB)

  // Stop here if you want to see what happens
  // -> _renderLogs() shows the updated log/PR files
  debugger

  // Master notices an update in PR A
  // and merges it
  master.onPullRequest(prA)
  _renderLogs(t, masterLog, prA, prB)
  t.equal(masterLog.getVersion(), 1, 'Master should have merge PR A and bumped version 1')

  // Master notices an update in PR B
  // but doesn't merge because it got outdated
  // after merging PR A
  master.onPullRequest(prB)
  _renderLogs(t, masterLog, prA, prB)
  t.equal(masterLog.getVersion(), 1, 'Master should not have merged PR B')

  // User A notices a merge into master
  // which was actually their own PR
  // so it closes the PR (=clear PR and update version)
  userA.onMerge()
  _renderLogs(t, masterLog, prA, prB)
  t.equal(prA.getVersion(), 1, 'User A should have updated to version 1')
  t.deepEqual(prA.getChanges(), [], '... and should not have any pending changes')

  // User B notices the same merge,
  // but realizes that it was not their own PR.
  // So they do a 'pull-rebase', updating their PR.
  // > Note how the indexes in the operations change
  userB.onMerge()
  _renderLogs(t, masterLog, prA, prB)
  t.equal(prB.getVersion(), 1, 'User B should have updated to version 1')
  t.equal(doc2.get(['paragraph-1', 'content']), 'ABCHello XYZWorld!', '... and should see the merged result')

  // Master notices the update of PR B
  // and merges it.
  master.onPullRequest(prB)
  _renderLogs(t, masterLog, prA, prB)
  t.equal(masterLog.getVersion(), 2, 'Master should have merged PR B and bumped version 2')

  // User A notices the merge and updates their
  // document accordingly.
  userA.onMerge()
  _renderLogs(t, masterLog, prA, prB)
  t.equal(prA.getVersion(), 2, 'User A should have updated their version')
  t.equal(doc1.get(['paragraph-1', 'content']), 'ABCHello XYZWorld!', '... and should see the merged result')

  // User B now sees their PR being merged
  // and closes the PR.
  userB.onMerge()
  _renderLogs(t, masterLog, prA, prB)
  t.equal(prB.getVersion(), 2, 'User B should have updated to version 2')
  t.deepEqual(prB.getChanges(), [], '... and should not have any pending changes')

  t.end()
})


function _setupEditorSession(sample, initialChanges) {
  let configurator = new Configurator()
  configurator.import(ProseEditorPackage)
  let importer = configurator.createImporter('html')
  let doc = importer.importDocument(sample)
  let editorSession = new EditorSession(doc, { configurator })
  if (initialChanges) {
    let ops = initialChanges.reduce((ops, change) => {
      return ops.concat(change.ops)
    }, [])
    let change = new DocumentChange(ops, {}, {})
    editorSession._applyRemoteChange(change)
  }
  return editorSession
}

function _renderLogs(t, masterLog, prA, prB) {
  let sandbox = t.sandbox
  if (!sandbox) return
  sandbox.empty()
  let doc = sandbox.getOwnerDocument()
  sandbox.append(doc.createElement('div').html(`
    <h4>master</h4>
    <pre>${masterLog.log.dump()}</pre>
  `))
  sandbox.append(doc.createElement('div').html(`
    <h4>PR A</h4>
    <pre>${prA.log.dump()}</pre>
  `))
  sandbox.append(doc.createElement('div').html(`
    <h4>PR B</h4>
    <pre>${prB.log.dump()}</pre>
  `))
}