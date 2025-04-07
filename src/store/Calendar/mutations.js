export default {
  ADD_EVENT: (state, event) => {
    state.events.push(event)
  },
  UPDATE_EVENT: (state, { id, title, start, end }) => {
    let index = state.events.findIndex(_event => _event.id === id)

    state.events[index].title = title
    state.events[index].start = start
    state.events[index].end = end
  }
}
