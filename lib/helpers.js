export default {
  menu (context) {

    console.log(this.slug)
    return 'test'

    /*
    const pages = this.pages
    const details = context.data.koa
    const slug = details.originalUrl.split('/')[1]

    let wrap = '<nav>'

    for (let page of pages) {
      let state = page.slug === slug ? 'active' : ''
      wrap += `<a href="/${page.slug}" class="${state}">${page.title}</a>`
    }

    return wrap += '</nav>'*/
  }
}
