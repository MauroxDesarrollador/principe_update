import axios from './index'

export default {
  async getAll (firstDay, lastDay) {
    const res = await axios.get(`/orders?delivery_init_date=${firstDay}&delivery_end_date=${lastDay}`)
    return res.data
  }
}
