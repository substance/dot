// import { module } from 'substance-test'
// import Parser from '../src/parser'
// import { user_a_log } from './fixtures/sample_logs.js'

// const test = module('Parser')

// test("Item type", (t) => {
//   let parser = new Parser()
//   let vItem = parser.parseLine(user_a_log[0])
//   let uItem = parser.parseLine(user_a_log[1])

//   t.equal(vItem.type, 'version', 'If it is line with version number type should be version')
//   t.equal(uItem.type, 'change', 'If it is line with user change type should be change')
//   t.isNotNil(uItem.change, 'User change line most have change')
//   t.isNil(vItem.change, 'Version line most not have change')

//   t.end()
// })
