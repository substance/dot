import { isString } from 'substance'
import { deserializeLogEntry, serializeLogEntry } from './logHelpers'

export default class ArrayLog {

  constructor(seed) {
    this.data = []

    seed.forEach(line => this.append(line))
  }

  clear() {
    this.data = []
  }

  append(record) {
    if (isString(record)) {
      record = deserializeLogEntry(record)
    }
    this.data.push(record)
  }

  get(lineIdx) {
    return this.data[lineIdx]
  }

  get length() {
    return this.data.length
  }

  dump() {
    return this.data.map(entry => serializeLogEntry(entry)).join('\n')
  }

}