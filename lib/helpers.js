module.exports = {
  nav: function (context, options) {
    var wrap = '<nav>'
    var details = options.data
    var handle

    // Some weird stuff that should me made less weird soon
    if (details.root.path) {
      handle = details.root.path.split('/')[2]
    } else {
      handle = details.view
    }

    // Use menu items to generate a "nav" element and add the "active" class
    // to all links whose title matches the name of the view in which
    // the helpers is being used
    for (var i = 0; i < context.length; i++) {
      var item = context[i]
      item.status = item.title.toLowerCase() === handle ? 'active' : ''

      if (item.url.indexOf('/admin/') === -1) {
        item.url = '/admin/' + item.url
      }

      wrap += options.fn(item)
    }

    // Hand back the "nav" element including the menu items
    return wrap + '</nav>'
  },
  ifRow: function (context, options) {
    const items = options.data.root.items

    // Check if one of the list's items has a field that matches the
    // name of the row that is being asked for
    if (!items) {
      return false
    } else if (context in options.data.root.items[0]) {
      return options.fn()
    }
  }
}
