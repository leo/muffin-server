const models = {
  page: require('../models/page'),
  user: require('../models/user')
}

exports.one = function *(type, _id) {
  const query = models[type].where({ _id })

  try {
    var item = yield query.findOne()
  } catch (err) {
    return log('Couldn\'t load item', err)
  }

  const remove = [
    '_id',
    'id',
    'password',
    '__v'
  ]

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
