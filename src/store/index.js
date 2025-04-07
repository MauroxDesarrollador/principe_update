import Vue from 'vue'
import Vuex from 'vuex'
import Setting from './Setting/index'
import Ecommerce from './Ecommerce/index'
import Chat from './Chat/index'
import Todo from './Todo/index'
import Calendar from './Calendar/index'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    Setting,
    Chat,
    Ecommerce,
    Todo,
    Calendar
  },
  state: {
  },
  mutations: {
  },
  actions: {
  },
  getters: {
  },
  strict: debug
})
