import { EventEmitter } from 'substance'
import Parser from './Parser'

class PR extends EventEmitter {
  constructor(log, userId) {
    this.userId = userId
    this.log = log
    this.parser = new Parser()
  }

  getUserId() {
    return this.userId
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

  getChanges() {
    let changes = []
    for (let i = this.log.length; i > 0; i--) {
      const line = this.log[i-1]
      const data = this.parser.parseLine(line)
      if(data.type === 'version') {
        break
      } else {
        changes.push(data.change)
      }
    }

    return changes
  }

  appendChange(docChange) {
    this._appendChange(docChange)
    this.emit('update')
  }

  setChanges(version, changes) {
    this.log = []
    this.log.append('V ' + version)
    changes.forEach(change => {
      this._appendChange(change)
    })
    this.emit('update')
  }

  _appendChange(change) {
    const userId = this.getUserId()
    const changeId = change.sha
    const serializedChange = JSON.stringify(change.toJSON())
    const lineEls = [userId, changeId, serializedChange]
    this.log.append(lineEls.join(' '))
  }
}

export default PR
