export const setStorage = (name, data) => {
  return data ? window.localStorage.setItem(name, JSON.stringify(data)) : window.localStorage.setItem(name, null)
}

export const getStorage = (name) => {
  return window.localStorage.getItem(name) ? JSON.parse(window.localStorage.getItem(name)) : null
}
