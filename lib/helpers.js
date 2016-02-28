module.exports = {
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
