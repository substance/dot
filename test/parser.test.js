import { module } from 'substance-test'
import Parser from '../src/parser'
import { user_a_log } from './fixtures/sample_logs.js'

const test = module('Parser')

test("Item type", (t) => {
  let Parser = new Parser()
  let vItem = parser.parseLine(user_a_log[0])
  let uItem = parser.parseLine(user_a_log[1])

  t.equal(parser.isVersion(vItem), true, 'If it is line with version number isVersion should return true')
  t.equal(parser.isUserChange(vItem), false, 'If it is line with version number isUserChange should return false')
  t.equal(parser.isVersion(uItem), false, 'If it is line with user change isVersion should return false')
  t.equal(parser.isUserChange(uItem), true, 'If it is line with user change isUserChange should return true')
  t.end()
})
