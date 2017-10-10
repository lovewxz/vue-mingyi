import {get, controller, put, del, post} from '../../lib/decorator/router'
import api from '../../api'
import xss from 'xss'
import R from 'ramda'
import randomToken from 'random-token'

@controller('admin')
export class projectController {
  @get('projects')
  async getProjectList(ctx, next) {
    const {limit} = ctx.query || 10
    const {page} = ctx.query || 1
    const projects = await api.project.getProjectList(limit, page)
    const count = await api.project.getProjectCount()
    ctx.body = {
      success: true,
      data: {
        list: projects,
        total: count
      }
    }
  }
  @get('projects/:_id')
  async getProjectById(ctx, next) {
    const {params} = ctx
    const {_id} = params
    if (_id) {
      ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    const project = await api.project.getProjectById(_id)
    ctx.body = {
      success: true,
      data: project
    }
  }
  @put('projects')
  async putProject(ctx, next) {
    let body = ctx.request.body
    const {_id} = body
    if (!_id) {
      return ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    let project = await api.project.getProjectById(_id)
    if (!project) {
      return ctx.body = {
        success: false,
        err: '项目不存在'
      }
    }
    project.title = xss(body.title)
    project.price = xss(body.price)
    project.original_price = xss(body.original_price)
    project.doctor = xss(body.doctor)
    project.description = xss(body.description)
    project.category = xss(body.category)
    project.params = R.map(item => ({
      key: xss(item.key),
      value: xss(item.value)
    }))(body.params)
    project.detail_images = R.map(xss)(body.detail_images)
    project.cover_image = R.map(xss)(body.cover_image)
    project.isTop = xss(body.isTop)
    try {
      project = await api.project.update(project)
      ctx.body = {
        success: true,
        data: project
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }
  @put('project/del')
  async delProject(ctx, next) {
    let body = ctx.request.body
    const {_id} = body
    const {status} = body
    if (!_id) {
      return ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    let project = await api.project.getProjectById(_id)
    if (!project) {
      return ctx.body = {
        success: false,
        err: '项目不存在'
      }
    }
    try {
      project = await api.project.updateStatus(_id, xss(status))
      ctx.body = {
        success: true,
        data: project
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }
  @post('projects')
  async createProject(ctx, next) {
    let body = ctx.request.body
    body = {
      _id: randomToken(32),
      title: xss(body.title),
      price: xss(body.price),
      original_price: xss(body.original_price),
      doctor: xss(body.doctor),
      description: xss(body.description),
      category: xss(body.category),
      params: R.map(item => ({
        key: xss(item.key),
        value: xss(item.value)
      }))(body.params),
      detail_images: R.map(xss)(body.detail_images),
      cover_image: R.map(xss)(body.cover_image)
    }
    try {
      const project = await api.project.save(body)
      return ctx.body = {
        success: true,
        data: project
      }
    } catch (e) {
      ctx.body = {
        success: false,
        err: e
      }
    }
  }

}
