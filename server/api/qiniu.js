import rp from 'request-promise'

export async function getQiniuPrefop(persistentId) {
  const url = `https://api.qiniu.com/status/get/prefop?id=${persistentId}`
  const res = await rp(url)
  return res
}
