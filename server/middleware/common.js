import bodyParser from 'koa-bodyparser'

export const addBody = app => {
  app.use(bodyParser())
}
