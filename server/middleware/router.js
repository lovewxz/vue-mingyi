import { resolve } from 'path'
import Route from '../lib/decorator/router'

const r = path => resolve(__dirname, path)

export const router = app => {
  const apiPath = r('../routes')
  const routes = new Route(apiPath, app)
  routes.init()
}
