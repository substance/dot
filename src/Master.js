export default class Master {

  constructor(changeLog) {
    this.changeLog = changeLog
    this.prs = []
  }

  dispose() {
    this.prs.forEach(pr => pr.off(this))
  }

  watchPullRequest(pr) {
    this.prs.push(pr)
    pr.on('update', this.onPullRequest, this)
  }

  onPullRequest(pr) {
    let masterVersion = this.changeLog.getVersion()
    let prVersion = pr.getVersion()
    if (prVersion === masterVersion) {
      this.merge(pr)
    } else {
      // This happens whenever two PRs come in simultanously
      // then the first is merged and the second gets outdated
    }
  }

  merge(pr) {
    const changeLog = this.changeLog
    let userId = pr.getUserId()
    let changes = pr.getChanges()
    let version = changeLog.getVersion()
    changeLog.appendChanges(userId, changes)
    changeLog.bumpVersion(version+1)
  }

}
