import { EventEmitter } from 'substance'

export default class PullRequest extends EventEmitter {

  constructor(userId, log) {
    super()

    this.userId = userId
    this.log = log
  }

  getUserId() {
    return this.userId
  }

  getVersion() {
    // in a PR file the version is always in the first
    // line
    let record = this.log.get(0)
    if(record.type !== 'version') {
      throw new Error('Illegal PR file.')
    }
    return record.version
  }

  getChanges() {
    let changes = []
    for (let i = 1; i < this.log.length; i++) {
      let record = this.log.get(i)
      if (record.type !== 'change') {
        throw new Error('Illegal PR file.')
      }
      changes.push(record.change)
    }
    return changes
  }

  appendChange(docChange) {
    this._appendChange(docChange)
    this.emit('update')
  }

  setChanges(version, changes) {
    this.log.clear()
    this.log.append({
      type: 'version',
      version: version
    })
    changes.forEach(change => {
      this._appendChange(change)
    })
    this.emit('update')
  }

  _appendChange(change) {
    this.log.append({
      type: 'change',
      userId: this.getUserId(),
      change
    })
  }
}
