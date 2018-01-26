import { controller, get, post, checkToken } from '../../lib/decorator/router'
import QiniuSDK from '../../lib/qiniuSDK'
import xss from 'xss'
import api from '../../api'

const qiniu = new QiniuSDK()

@controller('/qiniu')
export class QiniuController {
  @get('/uptoken')
  @checkToken()
  async qiniuToken(ctx, next) {
    let key = ctx.query.key
    let type = ctx.query.type
    let token = await qiniu.uptoken(key, type)
    ctx.body = {
      success: true,
      data: token
    }
  }
  @get('/prefopStatus')
  @checkToken()
  async qiniuPrefop(ctx, next) {
    const persistentId = ctx.query.persistentId
    const res = await api.qiniu.getQiniuPrefop(persistentId)
    ctx.body = {
      success: true,
      data: res
    }
  }
  @post('/watermark')
  async qiniuWaterMark(ctx, next) {
    let body = ctx.request.body
    const key = xss(body.key)
    await qiniu
      .waterMarkImage(key)
      .then(ret => {
        ctx.body = {
          success: true,
          data: ret
        }
      })
      .catch(e => {
        ctx.body = {
          success: false,
          data: e
        }
      })
  }
  @post('/video')
  async qiniuVideoThumbnail(ctx, next) {
    let body = ctx.request.body
    const key = xss(body.key)
    await qiniu
      .videoThumbnail(key)
      .then(ret => {
        ctx.body = {
          success: true,
          data: ret
        }
      })
      .catch(e => {
        ctx.body = {
          success: false,
          err: e
        }
      })
  }
  @post('/refresh')
  async qiniuRefreshUrl(ctx, next) {
    let body = ctx.request.body
    const url = decodeURIComponent(body.url)
    await qiniu
      .refresh(url)
      .then(ret => {
        ctx.body = {
          success: true,
          data: ret
        }
      })
      .catch(e => {
        ctx.body = {
          success: false,
          err: e
        }
      })
  }
}
