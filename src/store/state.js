import { getStorage } from '@/common/js/cache'
let user = getStorage('user')

const state = {
  tabDisplay: false,
  user: user
}

export default state
