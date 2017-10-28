export default class Master {

  constructor(master, prs) {
    this.master = master
    this.prs = prs
    prs.forEach((pr) => {
      pr.on('update', () => {
        this.onPullRequest(pr)
      })
    })
  }

  onPullRequest(pr) {
    let masterVersion = this.master.getVersion()
    let prVersion = pr.getVersion()
    if (prVersion === masterVersion) {
      let userId = pr.getUserId()
      let changes = pr.getChanges()
      this.master.appendChanges(userId, changes)
      this.master.incrementVersion()
      this.master.emit('update')
    } else {
      console.error('FIXME: this should not happen')
    }
  }

}