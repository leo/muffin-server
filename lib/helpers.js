module.exports = {
  nav: function(context, options) {

    var wrap = '<nav>',
        details = options.data,
        handle;

    if (details.root.path) {
      handle = details.root.path.split('/')[2];
    } else {
      handle = details.exphbs.view;
    }

    for (var i = 0; i < context.length; i++) {

      var item = context[i];
      item.status = item.title.toLowerCase() == handle ? 'active' : '';

      if (item.url.indexOf('/admin/') == -1) {
        item.url = '/admin/' + item.url;
      }

      wrap += options.fn(item);
    }

    return wrap + '</nav>';
  }
}
