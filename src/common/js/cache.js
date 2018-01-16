import storage from 'good-storage'

const FAVOURITE_PROJECT_KEY = '__favorite_project__'
const FAVOURITE_DOCTOR_KEY = '__favorite_doctor__'
const MAX_FAVOURITE_KEY_LEN = 200


/**
 * 使用storage库处理历史记录
 * @param  {Array} arr     [存储数组]
 * @param  {String} val     [存储的值]
 * @param  {Function} compare [获取索引函数]
 * @param  {Number} maxlen  [最大长度]
 * @return
 */
function _insert(arr, val, compare, maxlen) {
  let index = arr.findIndex(compare)
  // 如果索引为0
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxlen && arr.length > maxlen) {
    arr.pop()
  }
}

function _delete(arr, compare) {
  let index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}


export const setStorage = (name, data) => {
  return data ? window.localStorage.setItem(name, JSON.stringify(data)) : window.localStorage.setItem(name, null)
}

export const getStorage = (name) => {
  return window.localStorage.getItem(name) ? JSON.parse(window.localStorage.getItem(name)) : null
}

export const setFavorProject = (project) => {
  let list = storage.get(FAVOURITE_PROJECT_KEY, [])
  _insert(list, project, (item) => {
    return item === project
  }, MAX_FAVOURITE_KEY_LEN)
  storage.set(FAVOURITE_PROJECT_KEY, list)
  return list
}

export const cancelFavorProject = (project) => {
  let list = storage.get(FAVOURITE_PROJECT_KEY, [])
  _delete(list, (item) => {
    return item === project
  })
  storage.set(FAVOURITE_PROJECT_KEY, list)
  return list
}

export const setFavorDoctor = (doctor) => {
  let list = storage.get(FAVOURITE_DOCTOR_KEY, [])
  _insert(list, doctor, (item) => {
    return item === doctor
  }, MAX_FAVOURITE_KEY_LEN)
  storage.set(FAVOURITE_DOCTOR_KEY, list)
  return list
}

export const cancelFavorDoctor = (doctor) => {
  let list = storage.get(FAVOURITE_DOCTOR_KEY, [])
  _delete(list, (item) => {
    return item === doctor
  })
  storage.set(FAVOURITE_DOCTOR_KEY, list)
  return list
}
