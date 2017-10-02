export const sleep = (time) => {
  return new Promise((resolve, reject) => {
    if (time) {
      clearTimeout(time)
    }
    setTimeout(resolve, time)
  })
}
