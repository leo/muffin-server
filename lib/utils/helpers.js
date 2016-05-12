export default {
  menu (context) {
    let wrap = '<nav>'

    for (let page of this.pages) {
      let state = page.slug === this.slug ? 'active' : ''
      wrap += `<a href="/${page.slug}" class="${state}">${page.title}</a>`
    }

    return wrap += '</nav>'
  }
}
