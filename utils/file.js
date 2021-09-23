const fs = require('fs')
const path = require('path')

const getBasename = (p) => {
  const absPath = path.resolve(p)
  return path.basename(absPath)
}

const isDirectory = (p) => {
  const absPath = path.resolve(p)
  return fs.lstatSync(absPath).isDirectory()
}

const getPathList = () => {
  const args = process.argv
  args.splice(0, 2)
  return args
}

module.exports = {
  getBasename,
  isDirectory,
  getPathList,
}