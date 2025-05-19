import axios from './index'

export default {
  async getAll (params, configs) {
    const config = { params: configs }
    const res = await axios.get('/clients?' + params, config)
    return res.data
  },
  async getReportByDayToMonth (params) {
    const res = await axios.get('/clients/reportes-diarios-por-mes' + params)
    return res.data
  },
  async getById (id) {
    const res = await axios.get(`/clients/${id}`)
    return res.data
  },
  async create (params) {
    const res = await axios.post('/clients', params)
    return res.data
  },
  async update (id, params) {
    const res = await axios.put(`/clients/${id}`, params)
    return res.data
  },
  async delete (id) {
    const res = await axios.delete(`/clients/${id}`)
    return res.data
  }
}
