const log = require('./log')

const models = {
  page: require('../models/page'),
  user: require('../models/user')
}

const remove = [
  '_id',
  'id',
  'password',
  '__v'
]

exports.one = function *(type, _id) {
  const query = models[type].where({ _id })

  try {
    var item = yield query.findOne()
  } catch (err) {
    return log('Couldn\'t load ' + type + 's', err)
  }

  var attributes = item.toObject()

  for (var property of remove) {
    delete attributes[property]
  }

  return {
    id: _id,
    type: type.toLowerCase(),
    attributes
  }
}

exports.all = function *(type) {
  const plural = type + 's'

  try {
    var items = yield models[type].find()
  } catch (err) {
    return log('Couldn\'t load ' + plural, err)
  }

  var list = []

  for (var item in items) {
    var attributes = items[item].toObject()
    var id = attributes.id || attributes._id

    for (var property of remove) {
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
