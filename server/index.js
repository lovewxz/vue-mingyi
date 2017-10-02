import Koa from 'koa'
import R from 'ramda'
import { resolve } from 'path'

const host = process.env.HOST || '127.0.0.1'
const port = process.env.PORT || 3000

const r = path => resolve(__dirname, path)

const MIDDLEWARE = ['database', 'common', 'router']

class Server {
  constructor(host, port) {
    this.app = new Koa()
    this.host = host
    this.port = port
    this.useMiddleWare(this.app)(MIDDLEWARE)
  }
  useMiddleWare(app) {
    return R.map(
      R.compose(
        R.map(fn => fn(app)),
        require,
        i => `${r('./middleware')}/${i}`
      )
    )
  }
  start() {
    this.app.listen(this.port, this.host)
    console.log('Server listening on ' + host + ':' + port) // eslint-disable-line no-console
  }
}

const app = new Server(host, port)
app.start()
