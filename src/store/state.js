import { getUserStorage, loadFavorDoctor, loadFavorProject } from '@/common/js/cache'

const state = {
  tabDisplay: false,
  user: getUserStorage(),
  favorProject: loadFavorProject(),
  favorDoctor: loadFavorDoctor()
}

export default state
