import * as types from './mutation-types'

const mutations = {
  [types.SET_TABDISPLAY](state, tabDisplay) {
    state.tabDisplay = tabDisplay
  },
  [types.SET_USER](state, user) {
    state.user = user
  },
  [types.SET_FAVORITEPROJECT](state, favorProject) {
    state.favorProject = favorProject
  },
  [types.SET_FAVORITEDOCTOR](state, favorDoctor) {
    state.favorDoctor = favorDoctor
  }
}

export default mutations
