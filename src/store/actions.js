import Services from './service'
import * as type from './mutation-types.js'
import { setFavorProject, cancelFavorProject, setUserStorage, setFavorDoctor, cancelFavorDoctor } from '@/common/js/cache'

function _insert(arr, val, compare) {
  let index = arr.findIndex(compare)
  // 如果索引为0
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
}

function _delete(arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

export const getFavorList = async function ({ state }, id) {
  let res = await Services.getFavorListById({ _id: id })
  res = res.data
  if (!res.success) {
    return
  }
  return res.data
}

export const getWXSignature = function ({ commit }, url) {
  return Services.getWXSignature(url)
}

export const saveProjectOrder = async function ({ commit }, params) {
  return await Services.saveProjectOrder(params)
}

export const wechatPay = async function ({ commit }, params) {
  return await Services.wechatPay(params)
}

export const saveUser = async function ({ commit, dispatch }, user) {
  commit(type.SET_USER, setUserStorage(user))
  if (!user) return
  const list = await dispatch('getFavorList', user._id)
  if (!list) return
  commit(type.SET_FAVORITEPROJECT, setFavorProject(list.favorProject))
  commit(type.SET_FAVORITEDOCTOR, setFavorDoctor(list.favorDoctor))
}

export const getPayment = async function ({ commit }, payment) {
  return await Services.getPayment(payment)
}

export const getPaymentList = async function ({ state }, params) {
  params = Object.assign({
    limit: 10,
    page: 1,
    openid: state.user.openid
  }, params)
  return await Services.getPaymentList(params)
}

export const updatePayment = async function ({ commit }, params) {
  return await Services.updatePayment(params)
}

export const getDoctorList = async function ({ commit }, params) {
  return await Services.getDoctorList(params)
}

export const getDoctorDetail = async function ({ commit }, id) {
  return await Services.getDoctorDetail(id)
}

export const getProjectByDoctorId = async function ({ commit }, params) {
  return await Services.getProjectByDoctorId(params)
}

export const getPcaseByDoctorId = async function ({ commit }, params) {
  return await Services.getPcaseByDoctorId(params)
}

export const getPcaseList = async function ({ commit }, params) {
  return await Services.getPcaseList(params)
}

export const getPcaseListById = async function ({ commit }, id) {
  return await Services.getPcaseListById(id)
}

export const getDiaryById = async function ({ commit }, id) {
  return await Services.getDiaryById(id)
}

export const getDiaryListByCaseId = async function ({ commit }, caseId) {
  return await Services.getDiaryListByCaseId(caseId)
}

export const getProjectList = async function ({ commit }, params) {
  return await Services.getProjectList(params)
}

export const getProjectById = async function ({ commit }, id) {
  return await Services.getProjectById(id)
}

export const setFavorProjectAction = async function ({ dispatch, commit, state }, projectId) {
  const id = state.user._id
  const list = await dispatch('getFavorList', id)
  let favorProject = list.favorProject || []
  _insert(favorProject, projectId, (item) => {
    return item === projectId
  })
  const params = {
    _id: id,
    project: favorProject
  }
  let res = await Services.setFavorProjectById(params)
  res = res.data
  if (res.success) {
    commit(type.SET_FAVORITEPROJECT, setFavorProject(projectId))
  }
  return
}

export const cancelFavorProjectAction = async function ({ dispatch, commit, state }, projectId) {
  const id = state.user._id
  const list = dispatch('getFavorList', id)
  let favorProject = list.favorProject || []
  _delete(favorProject, (item) => {
    return item === projectId
  })
  const params = {
    _id: id,
    project: favorProject
  }
  let res = await Services.setFavorProjectById(params)
  res = res.data
  if (res.success) {
    commit(type.SET_FAVORITEPROJECT, cancelFavorProject(projectId))
  }
  return
}

export const setFavorDoctorAction = async function ({ dispatch, commit, state }, doctorId) {
  const id = state.user._id
  const list = await dispatch('getFavorList', id)
  let favorDoctor = list.favorDoctor || []
  _insert(favorDoctor, doctorId, (item) => {
    return item === doctorId
  })
  const params = {
    _id: id,
    doctor: favorDoctor
  }
  let res = await Services.setFavorDoctorById(params)
  res = res.data
  if (res.success) {
    commit(type.SET_FAVORITEDOCTOR, setFavorDoctor(doctorId))
  }
  return
}

export const cancelFavorDoctorAction = async function ({ dispatch, commit, state }, doctorId) {
  const id = state.user._id
  const list = dispatch('getFavorList', id)
  let favorDoctor = list.favorDoctor || []
  _delete(favorDoctor, (item) => {
    return item === doctorId
  })
  const params = {
    _id: id,
    doctor: favorDoctor
  }
  let res = await Services.setFavorDoctorById(params)
  res = res.data
  if (res.success) {
    commit(type.SET_FAVORITEDOCTOR, cancelFavorDoctor(doctorId))
  }
  return
}
