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
    } else {
      console.error('FIXME: this should not happen')
    }
  }

  merge(pr) {
    const master = this.master
    let userId = pr.getUserId()
    let changes = pr.getChanges()
    master.appendChanges(userId, changes)
    master.incrementVersion()
    master.emit('update')
  }

}