import koaRouter from 'koa-router'
import { all, one } from '../../lib/get'

const router = koaRouter()

function singular (type) {
  return type.substring(0, type.length - 1)
}

router.get('/:type', function *(next) {
  const type = this.params.type

  this.body = {
    data: yield all(singular(type))
  }

  yield next
})

router.get('/(.*)/:id', function *(next) {
  const type = this.req.url.split('/')[2]

  this.body = {
    data: yield one(singular(type), this.params.id)
  }

  yield next
})

module.exports = router
