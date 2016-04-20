import { log } from './utils'

// Fields that should be excluded from the response
const remove = [
  '_id',
  'id',
  'password',
  '__v',
  'aliases',
  'metadata',
  'chunkSize',
  'md5'
]

let models = ['page', 'user', 'file']

for (let model of models) {
  // Load models and add them to the "models" object
  models[model] = require('../models/' + model).default
}

export function *one (type, _id) {
  const query = models[type].where({ _id })
  let item = false

  try {
    // Try to retrieve item
    item = yield query.findOne()
  } catch (err) {
    return log('Couldn\'t load ' + type + 's', err)
  }

  let attributes = item.toObject()

  for (let property of remove) {
    delete attributes[property]
  }

  return {
    id: _id,
    type: type.toLowerCase(),
    attributes
  }
}

export function *all (type) {
  const plural = type + 's'
  let items = false

  try {
    items = yield models[type].find()
  } catch (err) {
    return log('Couldn\'t load ' + plural, err)
  }

  let list = []

  for (let item in items) {
    let attributes = items[item].toObject()
    let id = attributes.id || attributes._id

    for (let property of remove) {
      delete attributes[property]
    }

    list.push({
      id,
      type: plural,
      attributes
    })
  }

  return list
}
