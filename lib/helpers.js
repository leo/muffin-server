exports.admin = {
  nav: function (context, options) {
    var wrap = '<nav>'
    var details = options.data
    var handle

    // Some weird stuff that should be made less weird soon
    if (details.root.path) {
      handle = details.root.path.split('/')[2]
    } else {
      handle = details.view
    }

    // Use menu items to generate a "nav" element and add the "active" class
    // to all links whose title matches the name of the view in which
    // the helper is being used
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
  },
  bodyClass: function (context) {
    const data = context.data
    var view = data.view

    if (view === 'reset-password') {
      view = 'login'
    }

    return data.root.path ? '' : view
  }
}

exports.front = {
  menu: function (context, options) {
    const pages = this.pages
    const details = context.data.koa
    const slug = details.originalUrl.split('/')[1]

    var wrap = '<nav>'

    for (page of pages) {
      var state = page.slug === slug ? 'active' : ''
      wrap += `<a href="/${page.slug}" class="${state}">${page.title}</a>`
    }

    return wrap += '</nav>'
  }
}
