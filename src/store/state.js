import { getUserStorage } from '@/common/js/cache'
let user = getUserStorage()

const state = {
  tabDisplay: false,
  user: user
}

export default state
