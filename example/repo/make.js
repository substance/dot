const b = require('substance-bundler')
const path = require('path')

const indexFixture = require('./index.fixture')

const REPO = 'tmp/repo'

b.rm(REPO)

/*
  repo/
    index/
     0 -> block 0
     1 -> block 1
     2 -> block 2
*/
b.custom('Creating repo', {
  src: path.join(__dirname, 'index.fixture.js'),
  dst: REPO+'/index',
  execute() {
    indexFixture.forEach((change) => {
      b.writeFileSync(path.join(REPO, 'index', String(change.version)), JSON.stringify(change, 0, 2))
    })
  }
})

b.copy(REPO, 'tmp/userA/.dot/repo')

b.copy(REPO, 'tmp/userB/.dot/repo')
