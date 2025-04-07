export default {
  aggCalendarAction (context, payload) {
    return new Promise((resolve, reject) => {
      context.commit('ADD_EVENT', payload)
      resolve()
    })
  },
  updateCalendarAction (context, payload) {
    return new Promise((resolve, reject) => {
      context.commit('UPDATE_EVENT', payload)
      resolve()
    })
  }
}
