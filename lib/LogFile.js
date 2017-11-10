const fs = require('fs')

import { deserializeLogEntry, serializeLogEntry } from '../src/logHelpers'

export default class LogFile {

  constructor(path, mode, opts = {}) {
    if (mode !== 'r' && mode !== 'rw') {
      throw new Error("'mode' must be either 'r' or 'rw'")
    }
    this.mode = mode
    this.path = path
    this.data = []
    if (opts.watch) {
      // for now do a full reload on every change
      // later we should be smarter and incrementally
      // update the in-memory representation
      fs.watch(this.path, (type) => {
        this._load()
      })
    }
    this._load()
  }

  clear() {
    if (this._isReadOnly()) throw new Error('read-only')
    fs.writeFileSync(this.path, '')
    this.data = []
  }

  append(record) {
    if (this._isReadOnly()) throw new Error('read-only')
    let line = serializeLogEntry(record)
    fs.appendFileSync(this.path, line);
    this.data.push(record)
  }

  get(lineIdx) {
    return this.data[lineIdx]
  }

  get length() {
    return this.data.length
  }

  dump() {
    return fs.readFileSync(this.path, 'utf8')
  }

  _load() {
    let str = fs.readFileSync(this.path, 'utf8')
    let lines = str.split(/[\r\n]+/)
    let data = lines.map(line => deserializeLogEntry(line))
    this.data = data
  }

  _isReadOnly() {
    return this.mode === 'r'
  }

}