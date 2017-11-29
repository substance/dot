const b = require('substance-bundler')
const path = require('path')

const indexFixture = require('./index.fixture')

const REPO = 'tmp/repo'

b.task('clean', () => {
  b.rm(REPO)
  b.rm('tmp/userA')
  b.rm('tmp/userB')
})

b.task('init', ['clean'], () => {
  b.custom('Init...', {
    src: '',
    dest: '',
    execute() {
      b.writeFileSync('tmp/userA/.dot/repo/pr/userA', '')
      b.writeFileSync('tmp/userB/.dot/repo/pr/userB', '')
    }
  })
})

b.task('repo', ['init'], () => {
  b.custom('Creating repo', {
    src: path.join(__dirname, 'index.fixture.js'),
    dst: REPO+'/index',
    execute() {
      indexFixture.forEach((change) => {
        b.writeFileSync(path.join(REPO, 'index', String(change.version)), JSON.stringify(change, 0, 2))
      })
      b.writeFileSync(path.join(REPO, 'pr', 'userA'), '')
      b.writeFileSync(path.join(REPO, 'pr', 'userB'), '')
    }
  })
})

b.task('clone', ['repo'], () => {
  b.copy(path.join(REPO, 'index'), 'tmp/userA/.dot/repo/index')
  b.copy(path.join('tmp/userA/.dot/repo/pr/userA'), path.join(REPO, 'pr', 'userA'))
  b.copy(path.join(REPO, 'index'), 'tmp/userB/.dot/repo/index')
  b.copy(path.join('tmp/userB/.dot/repo/pr/userB'), path.join(REPO, 'pr', 'userB'))
})

b.task('default', ['repo', 'clone'])