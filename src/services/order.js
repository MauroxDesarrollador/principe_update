import axios from './index'

export default {
  async getAll (query, params) {
    const config = { params: params }
    const res = await axios.get(`/orders?${query}`, config)
    return res.data
  },
  async getById (id) {
    const res = await axios.get(`/orders/${id}`)
    return res.data
  },
  async create (params) {
    const res = await axios.post('/orders', params)
    return res.data
  },
  async update (id, params) {
    const res = await axios.put(`/orders/${id}`, params)
    return res.data
  },
  async delete (id) {
    const res = await axios.delete(`/orders/${id}`)
    return res.data
  },
  async emailForm (id) {
    const res = await axios.get(`/orders/email-additional-data/${id}`)
    return res.data
  },
  async orderStatuses () {
    const res = await axios.get(`/order-statuses`)
    return res.data
  },
  async updateSatus (id, status) {
    const res = await axios.put(`/orders/update-status/${id}?status=${status}`)
    return res.data
  }
}
