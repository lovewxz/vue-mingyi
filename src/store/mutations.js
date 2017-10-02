import * as types from './mutation-types'

const mutations = {
  [types.SET_TABDISPLAY](state, tabDisplay) {
    state.tabDisplay = tabDisplay
  }
}

export default mutations
