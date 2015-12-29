module.exports = {
  nav: function(context, options) {
    var wrap = '<nav>';

    for (var i = 0; i < context.length; i++) {

      var item = context[i];

      if (item.title.toLowerCase() == options.data.exphbs.view) {
        item.status = 'active';
      }

      if (item.url.indexOf('/admin/') == -1) {
        item.url = '/admin/' + item.url;
      }

      wrap += options.fn(item);
    }

    return wrap + '</nav>';
  }
}
