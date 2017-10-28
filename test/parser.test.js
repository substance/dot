import { module } from 'substance-test'
import { parser } from '../src/parser'
import sample from './fixtures/sample_user.json'

const test = module('Parser')

test("Item type", (t) => {
  let vItem = parser.parseLine(sample[0])
  let uItem = parser.parseLine(sample[1])

  t.equal(vItem.isVersion(), true, 'If it is line with version number isVersion should return true')
  t.equal(vItem.isUserChange(), false, 'If it is line with version number isUserChange should return false')
  t.equal(uItem.isVersion(), false, 'If it is line with user change isVersion should return false')
  t.equal(uItem.isUserChange(), true, 'If it is line with user change isUserChange should return true')
  t.end()
})
