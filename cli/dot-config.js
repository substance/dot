const fs = require('fs')
const path = require('path')
const os = require('os')

function getDotConfigFile() {
  return path.join(os.homedir(), '.dot.json')
}

function getDefaultDotConfig() {
  return {}
}

function readDotConfig() {
  let dotConfigFile = getDotConfigFile()
  if (fs.existsSync(dotConfigFile)) {
    return JSON.parse(fs.readFileSync(dotConfigFile, 'utf8'))
  }
}

function writeDotConfig(config) {
  let dotConfigFile = getDotConfigFile()
  fs.writeFileSync(dotConfigFile, JSON.stringify(config, null, 2))
}

function getCurrentUser() {
  let config = readDotConfig()
  if (config) {
    return config.user
  }
}

function setCurrentUser(user) {
  let config = readDotConfig() || getDefaultDotConfig()
  config.user = user
  writeDotConfig(config)
}

module.exports = {
  getCurrentUser,
  setCurrentUser
}
