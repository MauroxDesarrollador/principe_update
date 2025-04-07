import { is } from 'ramda'

export default class User {
  constructor (user = {}) {
    this.id = is(Number, user.id) ? user.id : 0
    this.name = is(String, user.name) ? user.name : ''
    this.phone = is(String, user.phone) ? user.phone : ''
    this.email = is(String, user.email) ? user.email : ''
    this.role = is(String, user.role) ? user.role : ''
  }
}
