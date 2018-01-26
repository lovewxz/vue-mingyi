import Router from 'koa-router'
import glob from 'glob'
import { resolve } from 'path'
import R from 'ramda'
import jwt from 'jsonwebtoken'

let routeMap = new Map()
const symbolPrefix = Symbol('prefix')

const normalisePath = path => (path.startsWith('/') ? path : `/${path}`)
const isArray = arr => (Array.isArray(arr) ? arr : [arr])

export default class Route {
  constructor(apiPath, app) {
    this.app = app
    this.apiPath = apiPath
    this.router = new Router()
  }
  init() {
    glob.sync(resolve(this.apiPath, './**/*.js')).forEach(require)
    for (let [conf, controller] of routeMap) {
      const controllers = isArray(controller)
      const prefixPath = conf.target[symbolPrefix]
      if (prefixPath) prefixPath = normalisePath(prefixPath)
      const routerPath = prefixPath + conf.path
      this.router[conf.method](routerPath, ...controllers)
    }
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}

const router = conf => (target, key, descriptor) => {
  conf.path = normalisePath(conf.path)
  routeMap.set(
    {
      target,
      ...conf
    },
    target[key]
  )
}

export const controller = path => target =>
  (target.prototype[symbolPrefix] = path)

export const get = path =>
  router({
    method: 'get',
    path
  })

export const put = path =>
  router({
    method: 'put',
    path
  })

export const del = path =>
  router({
    method: 'delete',
    path
  })

export const post = path =>
  router({
    method: 'post',
    path
  })

const decorate = (args, middleware) => {
  let [target, key, descriptor] = args
  target[key] = isArray(target[key])
  target[key].unshift(middleware)
  return descriptor
}
const convert = middleware => (...args) => decorate(args, middleware)

// require
export const required = rules =>
  convert(async (ctx, next) => {
    let errors = []
    const passRules = R.forEachObjIndexed((val, key) => {
      errors = R.filter(i => {
        return !R.has(i, ctx.request[key])
      })(val)
    }) // 判断请求中参数是否为空
    passRules(rules)
    if (errors.length) ctx.throw(412, `${errors.join(', ')}参数缺失`)
    await next()
  })

export const checkToken = () =>
  convert(async (ctx, next) => {
    const authorization = ctx.get('X-Token')
    if (!authorization) {
      ctx.throw(401, '没有验证信息')
    }
    let tokenContent = await jwt.verify(
      authorization,
      'yaojun',
      (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            ctx.throw(402, '验证信息过期')
          } else {
            ctx.throw(401, '验证不通过')
          }
        }
      }
    )
    await next()
  })
