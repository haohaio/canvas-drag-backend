const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const cors = require('koa2-cors')
const DB = require('./modules/db')
const app = new Koa()
const router = new Router()
const { responseHandler, errorHandler } = require('./middleware/response')
const { corsHandler } = require('./middleware/cors')

app.use(errorHandler)
app.use(bodyParser())
// Cors
app.use(cors(corsHandler))

router.get('/area', async (ctx, next) => {
  const response = await DB.find('area')
  ctx.result = response
  next()
})

router.post('/saveArea', async (ctx, next) => {
  const { userId, areas } = ctx.request.body

  await DB.deleteMany('area', { userId })
  await DB.insertMany('area', areas)

  ctx.result = '成功'
  next()
})

// 启动路由
app.use(router.routes())
// 当所有路由中间件执行完成之后,若 ctx.status 为空或者404的时候,丰富 response 对象的 header 头.
app.use(router.allowedMethods())

app.use(responseHandler)

app.listen(3000, () => {
  console.log('starting at port 3000')
})
