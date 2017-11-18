import api from '../../api'
import { controller, post, get, del, put, required } from '../../lib/decorator/router'
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
}
