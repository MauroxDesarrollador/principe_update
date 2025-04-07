import axios from './index'

export default {
  async getAll () {
    const res = await axios.get('/users')
    return res.data
  },
  async getById (id) {
    const res = await axios.get(`/users/${id}`)
    return res.data
  },
  async create (params) {
    const res = await axios.post('/users', params)
    return res.data
  },
  async update (id, params) {
    const res = await axios.put(`/users/${id}`, params)
    return res.data
  },
  async delete (id) {
    const res = await axios.delete(`/users/${id}`)
    return res.data
  }
}
