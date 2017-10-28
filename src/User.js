import { operationHelpers } from 'substance'
/*
  The user's side of the protocol.
  Listening to changes to master (=merges)
  updating the PR accordingly, and emitting document changes.
*/
export default class User {

  constructor(pr, master, editorSession) {
    this.pr = pr
    this.master = master
    this.editorSession = editorSession

    master.on('update', () => {
      this.onMerge()
    })
    editorSession.on('commit', this._onCommit, this)
  }

  dispose() {
    this.master.off(this)
    this.editorSession.off(this)
  }

  // this gets called whenever master is updated
  // which happens only on merge
  onMerge() {
    let masterVersion = this.master.getVersion()
    let version = this.pr.getVersion()
    if (masterVersion === version) {
      // nothing to do
    } else if (version < masterVersion) {
      this.pullRebase()
    } else {
      console.error('FIXME: this should not happen')
    }
  }

  appendChange(docChange) {
    this.pr.appendChange(docChange)
  }

  pullRebase() {
    let version = this.pr.getVersion()
    let changes = this.master.getChangesSince(version)
    let pendingChanges = this.pr.getChanges()
    // change pending changes so they can be applied
    // on top of the upstream ones
    // at the same type rebase the upstream changes so that they
    // can be applied to the local document
    for (let i = 0; i < changes.length; i++) {
      let a = changes[i].clone()
      for (let j = 0; j < pendingChanges.length; j++) {
        let b = pendingChanges[j]
        // Removing a change from the PR if we find
        // it within the upstream changes
        if (a.id === b.id) {
          pendingChanges.splice(j, 1)
          j--
          continue
        }
        // we use OT to get a version of the upstream change
        // that we can apply to our local document
        // Note: this is done inplace, so be aware of getting
        this._transform(a, b)
      }
    }
    // now we update the editor session so that
    // we see the upstream changes
    changes.forEach((change) => {
      this.editorSession._applyChange(change)
    })
    this.pr.setChanges(this.master.getVersion(), changes)
    this.pr.emit('update')
  }

  _transform(A, B) {
    // this way we hope to get the same result everywhere
    let swap = false
    if (A.timestamp > B.timestamp) {
      swap = true
    } else if (A.timestamp === B.timestamp) {
      swap = (A.sha > B.sha)
    }
    if (swap) {
      operationHelpers.transformDocumentChange(B, A)
    } else {
      operationHelpers.transformDocumentChange(A, B)
    }
  }

  _onCommit(change) {
    this.pr.appendChange(change)
    this.pr.emit('update')
  }
}
