import axios from './index'

export default {
  async paymentMethods () {
    const res = await axios.get('/payment-methods')
    return res.data
  },

  async orderStatus () {
    const res = await axios.get('/order-statuses')
    return res.data
  },

  async reasons () {
    const res = await axios.get('/reasons')
    return res.data
  },

  async deliveryZones () {
    const res = await axios.get('/delivery-zones')
    return res.data
  },

  async turns () {
    const res = await axios.get('/turns')
    return res.data
  }
}
