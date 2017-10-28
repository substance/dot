export default class Parser {
  parseLine(line) {
    const data = line.split(' ')
    const type = data.length === 2 ? 'version' : 'change'
    let res = {
      type: type,
      id: data[1]
    }
    if(type === 'change') {
      res.user = data[0]
      res.change = JSON.parse(data[2])
    }
    return res
  }
}
