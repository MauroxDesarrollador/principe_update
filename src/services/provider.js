import axios from './index'

export default {
  async getAll () {
    const res = await axios.get('/providers')
    return res.data
  },
  async getById (id) {
    const res = await axios.get(`/providers/${id}`)
    return res.data
  },
  async create (params) {
    const res = await axios.post('/providers', params)
    return res.data
  },
  async update (id, params) {
    const res = await axios.put(`/providers/${id}`, params)
    return res.data
  },
  async delete (id) {
    const res = await axios.delete(`/providers/${id}`)
    return res.data
  }
}
