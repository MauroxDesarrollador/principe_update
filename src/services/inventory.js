import axios from './index'

export default {
  async getAll (param, configs) {
    const config = { params: configs }
    const res = await axios.get(`/inventories?${param}`, config)
    return res.data
  },
  async create (params) {
    const res = await axios.post('/inventories', params)
    return res.data
  }
}
