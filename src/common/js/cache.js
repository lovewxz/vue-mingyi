export const setStorage = (name, data) => {
  return data ? window.localStorage.setItem(name, JSON.stringify(data)) : null
}

export const getStorage = (name) => {
  return window.localStorage.getItem(name) ? JSON.parse(window.localStorage.getItem(name)) : null
}
