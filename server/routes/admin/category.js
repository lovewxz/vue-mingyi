import api from '../../api'
import { controller, post, get, put } from '../../lib/decorator/router'
import xss from 'xss'
import R from 'ramda'

@controller('admin')
export class CategoryController {
  @get('category')
  async getCategory(ctx, next) {
    try {
      const cate = await api.category.getCategory()
      ctx.body = {
        success: true,
        data: cate
      }
    } catch (e) {
      ctx.body = {
        success: false,
        data: e
      }
    }
  }
  @post('category')
  async createCategory(ctx, next) {
    let body = ctx.request.body
    body = {
      name: xss(body.name),
      parentId: xss(body.parentId),
      topId: xss(body.topId)
    }
    try {
      const cate = await api.category.save(body)
      ctx.body = {
        success: true,
        data: cate
      }
    } catch (e) {
      ctx.body = {
        success: false,
        data: e
      }
    }
  }
  @post('category/del')
  async delCategory(ctx, next) {
    let body = ctx.request.body
    body = {
      ids: R.map(xss)(body.ids)
    }
    try {
      const cate = await api.category.del(body.ids)
      ctx.body = {
        success: true,
        data: cate
      }
    } catch (e) {
      ctx.body = {
        success: false,
        data: e
      }
    }
  }
  @put('category')
  async putCategory(ctx, next) {
    let body = ctx.request.body
    const { _id } = body
    if (!_id) {
      return (ctx.body = {
        success: false,
        err: 'id不存在'
      })
    }
    let cate = await api.category.getCategoryById(_id)
    if (!cate) {
      return (ctx.body = {
        success: false,
        err: '分类不存在'
      })
    }
    cate = {
      _id: Number(xss(body._id)),
      topId: Number(xss(body.topId)),
      parentId: Number(xss(body.parentId)),
      name: xss(body.name)
    }
    try {
      cate = await api.category.update(cate)
      ctx.body = {
        success: true,
        data: cate
      }
    } catch (e) {
      ctx.body = {
        success: false,
        data: e
      }
    }
  }
}
