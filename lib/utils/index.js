import chalk from 'chalk'
import fs from 'fs-extra'
import path from 'path'

export function log (message, err) {
  // Regular errors
  if (message instanceof Error) {
    console.error(err && err.stack)
    return
  }

  // Ability to add custom message to error
  if (err instanceof Error) {
    console.error(chalk.bold(message) + '\n', err.stack)
    return
  }

  // The usual loggings
  console.log(message)
}

export function exists (path) {
  try {
    fs.statSync(path)
    return true
  } catch (err) {
    return false
  }
}

export function walkSync (dir) {
  const files = fs.readdirSync(dir)
  let list = []

  files.forEach(file => {
    if (fs.statSync(path.normalize(dir + '/' + file)).isDirectory()) {
      list = exports.walkSync(dir + file + '/', list)
    } else {
      list.push(file)
    }
  })

  return list
}
