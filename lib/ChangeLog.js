import { EventEmitter } from 'substance'

export default class ChangeLog extends EventEmitter {

  constructor(log) {
    super()

    this.log = log
  }

  getVersion() {
    const L = this.log.length
    // Note: usually the version is in the last line
    // only while updating the
    const record = this.log.get(L-1)
    if(record.type !== 'version') {
      throw new Error('Illegal change-log.')
    }
    return record.version
  }

  getChangesSince(version) {
    let changes = []
    for (let i = this.log.length-1; i >= 0; i--) {
      const record = this.log.get(i)
      if (record.version === version) {
        break
      } else if (record.change) {
        changes.unshift(record.change)
      }
    }
    return changes
  }

  appendChanges(userId, changes) {
    changes.forEach(change => {
      this._appendChange(userId, change)
    })
  }

  bumpVersion(version) {
    this.log.append({ type: 'version', version })
    this.emit('update')
  }

  _appendChange(userId, change) {
    this.log.append({
      type: 'change',
      userId,
      change
    })
  }
}
