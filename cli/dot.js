#!/usr/bin/env node

const path = require('path')
const cp = require('child_process')
const fs = require('fs')
const readline = require('readline')
const fsReverse = require('fs-reverse')

const { getCurrentUser, setCurrentUser } = require('./dot-config')
const { ProsePlugin, deserializeLogEntry } = require('../dist/substance-dot.cjs.js')

/*
  DOT Command Line Interface: (WIP)

  dot init <path-to-folder>

    creates a .dot folder for `dot` internal data

  dot config [--global] key value

    sets a config value

  dot edit

    starts a local service which exposes an editor for the document

  dot log

    shows the master log

  dot status

    shows pending changes
*/
const argv = require('yargs')
  .usage('$0 <cmd> [args]')
  .command('init [folder]', 'Initialize a folder for dot', init)
  .command('login', 'Login as a specific user.', login)
  .command('log', 'Display the shared history', log)
  .command('status', 'Display pending changes (PR)', status)
  .command('checkout', 'Get the latest version of the document', checkout)
  .command('edit', 'Open an editor for the local folder', edit)
  .help()
  .argv

/*
  Initialize a new dot repo.
*/
function init(yargs) {
  const argv = yargs.argv

  const userName = getCurrentUser()
  if (!userName) {
    console.error('You must be logged in before. Run "dot login" first.')
    return
  }

  let cwd = process.cwd()
  let folder = '.'
  if (argv._.length > 1) {
    folder = argv._[1]
  }
  folder = path.join(cwd, folder)

  // TODO: we need to specify how .dot should look like
  // This is just a preliminary first shot
  const dotFolder = path.join(folder, '.dot')
  if (fs.existsSync(dotFolder)) {
    console.error(`Folder ${folder} has already been initialized`)
    return
  }
  fs.mkdirSync(dotFolder)

  let initialConfig = {
    user: userName,
    origin: { type: 'local' }
  }
  fs.writeFileSync(path.join(dotFolder, 'config.json'), JSON.stringify(initialConfig, null, 2))

  const metaFolder = path.join(dotFolder, 'meta')
  fs.mkdirSync(metaFolder)

  const usersFile = path.join(metaFolder, 'users.json')
  const initialUsers = {}
  initialUsers[userName] = {
    owner: true
  }
  fs.writeFileSync(usersFile, JSON.stringify(initialUsers, null, 2))

  const masterLog = path.join(metaFolder, 'master.log')
  fs.writeFileSync(masterLog, 'V 0')
}

function login() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })
  rl.question('User: ', (userName) => {
    setCurrentUser(userName)
    rl.close()
  })
}

function edit() {
  const electron = require('electron')
  let editorPackage = require.resolve('../dist/editor/package.json')
  let editorDir = path.dirname(editorPackage)

  let cwd = process.cwd()
  let documentFolder = '.'
  if (argv._.length > 1) {
    documentFolder = argv._[1]
  }
  documentFolder = path.join(cwd, documentFolder)

  let child = cp.spawn(electron, [editorDir, documentFolder], {stdio: 'inherit'})
  child.on('close', function (code) {
    process.exit(code)
  })
}

function log() {
  let logFile = _logFile(process.cwd())
  let n = 50
  let stream = fsReverse(logFile, {})
    .on('data', (line) => {
      if (line) {
        console.info(line)
      }
      if(!--n) {
        stream.destroy()
      }
    })
    .on('end', function () {
      stream.destroy()
      process.exit(0)
    })
}

function status() {
  let user = getCurrentUser()
  if (!user) {
    console.error('You must be logged in before. Run "dot login" first.')
    return
  }
  let prFile = _prFile(process.cwd(), user)
  if (!fs.existsSync(prFile)) {
    console.info('No pull-request for user %s.', user)
    return
  }
  let str = fs.readFileSync(prFile, 'utf8')
  console.info(str)
}

// brings the working-copy into the state of the user's PR
// or master if no PR is present
function checkout() {
  let cwd = process.cwd()
  let user = getCurrentUser()
  if (!user) {
    console.error('You must be logged in before. Run "dot login" first.')
    return
  }
  let prVersion = null
  let prFile = _prFile(cwd, user)
  let prChanges = []
  if (fs.existsSync(prFile)) {
    let stream = fsReverse(prFile, {})
      .on('data', (line) => {
        if (!line) return
        let entry = deserializeLogEntry(line)
        if (entry.type === 'version') {
          prVersion = entry.version
          stream.destroy()
        } else if (entry.type === 'change') {
          prChanges.unshift(entry.change)
        }
      })
      .on('close', () => {
        _createDoc(prVersion, prChanges)
      })
  } else {
    _createDoc()
  }
}

function _createDoc(prVersion, prChanges) {
  let cwd = process.cwd()
  // TODO: need to rethink how 'plugins' should work
  // e.g. I don't want to manage on a file-by-file basis,
  // more the whole repo, according to the specific type.
  // But there it is difficult to find a generalization.
  let plugin = ProsePlugin
  let doc = plugin.import(plugin.seed)
  let logFile = _logFile(cwd)
  let input = fs.createReadStream(logFile)
  let reader = readline.createInterface({ input })
  reader.on('line', (line) => {
    let entry = deserializeLogEntry(line)
    if (entry.type === 'version') {
      if (prVersion === entry.version) {
        prChanges.forEach(c => doc._apply(c))
        reader.close()
        return
      }
    } else if (entry.type === 'change') {
      doc._apply(entry.change)
    }
  }).on('close', () => {
    let documentFile = path.join(cwd, 'index.html')
    fs.writeFileSync(documentFile, plugin.export(doc))
  })
}

function _logFile(cwd) {
  return path.join(cwd, '.dot', 'meta', 'master.log')
}

function _prFile(cwd, user) {
  return path.join(cwd, '.dot', 'meta', user+'.pr')
}

// function _configFile(cwd) {
//   return path.join(cwd, '.dot', 'config')
// }

// function _readConfig(cwd) {
//   let str = fs.readFileSync(_configFile(cwd), 'utf8')
//   return JSON.parse(str)
// }

// function _writeConfig(cwd, config) {
//   // TODO: do some sanity checking
//   fs.writeFileSync(_configFile(cwd), JSON.stringify(config, null, 2))
// }
