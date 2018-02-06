import api from '../../api'
import {
  controller,
  get,
  checkToken,
  post,
  put
} from '../../lib/decorator/router'
import R from 'ramda'
import xss from 'xss'
import randomToken from 'random-token'

@controller('admin')
export class doctorController {
  @get('doctor')
  @checkToken()
  async getDoctorList(ctx, next) {
    let condition = ctx.query
    condition = R.filter(item => !!item && item !== 0)(condition)
    const args = R.compose(R.dissoc('limit'), R.dissoc('page'))(condition)
    if (condition.keyword) {
      condition.keyword = new RegExp(
        xss(decodeURIComponent(condition.keyword)),
        'i'
      )
    }
    const doctors = await api.doctor.getDoctorList(condition)
    const count = await api.doctor.getDoctorCount(args)
    ctx.body = {
      success: true,
      data: {
        list: doctors,
        total: count
      }
    }
  }
  @get('doctor/:_id')
  @checkToken()
  async getDoctorById(ctx, next) {
    const { params } = ctx
    const { _id } = params
    if (_id) {
      ctx.body = {
        success: false,
        err: 'id不存在'
      }
    }
    const doctor = await api.doctor.getDoctorById(_id)
    ctx.body = {
      success: true,
      data: doctor
    }
  }
  @post('doctor')
  @checkToken()
  async createDoctor(ctx, next) {
    let body = ctx.request.body
    body = {
      _id: randomToken(32),
      title: xss(body.title),
      realname: xss(body.realname),
      photos: R.map(xss)(body.photos),
      desc: xss(body.desc),
      isTop: body.isTop,
      avatar: xss(body.avatar),
      tags: R.map(xss)(body.tags)
    }
    console.log(body)
    try {
      const doctor = await api.doctor.save(body)
      return (ctx.body = {
        success: true,
        data: doctor
      })
    } catch (error) {
      return (ctx.body = {
        success: false,
        err: error
      })
    }
  }
  @put('doctor')
  @checkToken()
  async updateDoctor(ctx, next) {
    let body = ctx.request.body
    const { _id } = body
    if (!_id) {
      return (ctx.body = {
        success: false,
        err: 'id不存在'
      })
    }
    let doctor = await api.doctor.getDoctorById(_id)
    if (!doctor) {
      return (ctx.body = {
        success: false,
        err: '医生不存在'
      })
    }
    doctor.title = xss(body.title)
    doctor.realname = xss(body.realname)
    doctor.photos = R.map(xss)(body.photos)
    doctor.desc = xss(body.desc)
    doctor.isTop = body.isTop
    doctor.avatar = xss(body.avatar)
    doctor.tags = R.map(xss)(body.tags)
    try {
      doctor = await api.doctor.update(doctor)
      console.log(doctor)
      return (ctx.body = {
        success: true,
        data: doctor
      })
    } catch (error) {
      return (ctx.body = {
        success: false,
        err: error
      })
    }
  }
}
