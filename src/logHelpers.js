import { isNumber, DocumentChange, OperationSerializer } from 'substance'

const V = 'V'.charAt(0)
const C = 'C'.charAt(0)

// V <version>
// C <user-id> <serialized change>
export function deserializeLogEntry(line) {
  let res
  if (line.charAt(0) === V) {
    res = {
      type: 'version',
      version: parseInt(line.substring(1), 10)
    }
    if (!isNumber(res.version)) {
      throw new Error('Illegal format')
    }
  } else if (line.charAt(0) === C) {
    res = {
      type: 'change',
      userId: null,
      change: null
    }
    let m = /\s+([^\s]+)/.exec(line)
    let data = line.substring(m.index+m[0].length)
    res.userId = m[1]
    res.change = deserializeChange(data)
  } else {
    throw new Error('Illegal format')
  }
  return res
}

export function serializeLogEntry(entry) {
  switch (entry.type) {
    case 'version': {
      return `V ${entry.version}`
    }
    case 'change': {
      return `C ${entry.userId} ${serializeChange(entry.change)}`
    }
    default:
      throw new Error('Illegal state.')
  }
}

export function serializeChange(change) {
  let ser = new OperationSerializer()
  let ops = change.ops.map((op) => {
    return ser.serialize(op)
  })
  // we don't need strong ids
  let id = change.sha.substring(0,8)
  return JSON.stringify({ id, ops })
}

export function deserializeChange(str) {
  let ser = new OperationSerializer()
  let data = JSON.parse(str)
  let ops = data.ops.map((opStr) => {
    return ser.deserialize(opStr)
  })
  return new DocumentChange({ sha: data.id, ops })
}