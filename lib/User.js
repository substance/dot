import { operationHelpers, DocumentChange } from 'substance'

/*
  The user's side of the protocol.
  Listening to changes to master (=merges)
  updating the PR accordingly, and emitting document changes.
*/
export default class User {

  constructor(pr, editorSession, changeLog) {
    this.pr = pr
    this.editorSession = editorSession
    this.editorSession.on('commit', this._onCommit, this)
    this.changeLog = changeLog
  }

  dispose() {
    this.editorSession.off(this)
    if (this.changeLog) {
      this.changeLog.off(this)
    }
  }

  watchChangeLog() {
    this.changeLog.on('update', this.onMerge, this)
  }

  // this gets called whenever master is updated
  // which happens only on merge
  onMerge() {
    let masterVersion = this.changeLog.getVersion()
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
    let remoteVersion = this.changeLog.getVersion()
    let localVersion = this.pr.getVersion()

    let remoteChanges = this.changeLog.getChangesSince(localVersion)
    let localChanges = this.pr.getChanges()

    // We need to rewrite the PR file
    // - removing changes that have been merged already
    // - rebasing changes onto upstream changes
    // these will be used to rewrite the PR
    let rebasedLocal = []
    // these will be used to update the local working copy
    let rebasedRemote = []

    while (remoteChanges.length > 0 || localChanges.length > 0) {
      // append all remaining pending changes (which we have rebased already)
      if (remoteChanges.length === 0) {
        rebasedLocal = rebasedLocal.concat(localChanges)
        break
      }
      // append all remaining upstream changes (which we have rebased already)
      if (localChanges.length === 0) {
        rebasedRemote = rebasedRemote.concat(remoteChanges)
        break
      }
      let theirs = remoteChanges[0]
      let mine = localChanges[0]
      // if remote == local just skip this one
      // TODO: we may want to call this 'id' instead of 'sha'?
      if (theirs.sha === mine.sha) {
        remoteChanges.shift()
        localChanges.shift()
        continue
      }
      // otherwise, take the remote change, rebase all remaining local ones
      // and push the rebased remote so that we can apply it later
      // TODO: we could also apply the rebase remote right away
      else {
        remoteChanges.shift()
        // change pending changes so they can be applied
        // on top of the upstream ones
        // at the same type rebase the upstream changes so that they
        // can be applied to the local document
        let a = theirs.clone()
        for (let i = 0; i < localChanges.length; i++) {
          let b = localChanges[i]
          // we use OT to get a version of the upstream change
          // that we can apply to our local document
          // Note: this is done inplace, so be aware of getting
          this._transform(a, b)
        }
        rebasedRemote.push(a)
      }
    }

    // now we update the editor session so that
    // we see the upstream changes
    // TODO: we still need to trigger a reflow
    // to update the view for all applied changes
    // -> instead of applying each change we should
    // just collect all ops and apply one big change
    // and us
    if (rebasedRemote.length > 0) {
      let ops = rebasedRemote.reduce((ops, change) => {
        return ops.concat(change.ops)
      }, [])
      let change = new DocumentChange(ops, {}, {})
      this.editorSession._applyRemoteChange(change)
    }
    this.pr.setChanges(remoteVersion, rebasedLocal)
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
  }

}
