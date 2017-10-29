import { EventEmitter } from 'substance'
import Parser from './Parser'

class ChangeLog extends EventEmitter {
  constructor(log) {
    super(log)
    this.log = log
    this.parser = new Parser()
  }

  getVersion() {
    let version = 0
    for (let i = this.log.length; i > 0; i--) {
      const line = this.log[i-1]
      const data = this.parser.parseLine(line)
      if(data.type === 'version') {
        version = data.id
        break
      }
    }

    return version
  }

  getChangesSince(version) {
    let changes = []
    for (let i = this.log.length; i > 0; i--) {
      const line = this.log[i-1]
      const data = this.parser.parseLine(line)
      if(data.type === 'version') {
        if(data.id === version) break
      } else {
        changes.push(data.change)
      }
    }

    return changes
  }

  appendChanges(changes) {
    changes.forEach(change => {
      this._appendChange(change)
    })
  }

  incrementVersion() {
    this.emit('update')
  }

  _appendChange(change) {
    const serializedChange = JSON.stringify(change.toJSON())
    const lineEls = [change.userId, change.sha, serializedChange]
    this.log.append(lineEls.join(' '))
  }
}

export default ChangeLog
