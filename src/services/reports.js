import axios from './index'
import constant from '../config/constant'
export default {
  async getProductsMovements(params) {
    const res = await axios.get(`/inventories?${params}`)
    return res.data
  },
  async getInventoryReport(params) {
    const res = await axios.get(`/report/inventories?${params}`)
    return res.data
  },
  getCharts() {
    return axios.get('/chartjs')
  },
  async getOrderReport(params) {
    const res = await axios.get(`/orders?${params}`)
    return res.data
  },
  async getBestSellers(params = '') {
    const res = await axios.get('products/best-sellers' + params)
    return res.data
  },
  async getMovementReport(params) {
    const res = await axios.get(`reports/movement?${params}`)
    return res.data
  },
  async getMovementReportExcel(params) {
    window.open(`${constant.webURL}/orders/export/excel?${params}`);
  },
  async getSalesJournalReport(params) {
    const res = await axios.get(`reports/sales-journal?${params}`)
    return res.data
  },
  async getAccountsReceivableReport(params) {
    const res = await axios.get(`reports/accounts-receivable?${params}`)
    return res.data
  },
  async getAccountsReceivableReportPdf(params) {
    axios({
      url: `reports/accounts-receivable-pdf?${params}`,
      method: 'GET',
      responseType: 'blob' // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'accounts-receivable.pdf')
      document.body.appendChild(link)
      link.click()
    })
  },
  async getSalesJournalReportPdf(params) {
    axios({
      url: `reports/sales-journal-pdf?${params}`,
      method: 'GET',
      responseType: 'blob' // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'sales-journal' + params + '.pdf')
      document.body.appendChild(link)
      link.click()
    })
  },
  async getMovementReportPdf(params) {
    axios({
      url: `reports/movement-pdf?${params}`,
      method: 'GET',
      responseType: 'blob' // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'movement.pdf')
      document.body.appendChild(link)
      link.click()
    })
  },
  async getInvengoryPdf(params) {
    axios({
      url: `reports/inventory-pdf${params}`,
      method: 'GET',
      responseType: 'blob' // important
    }).then((response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'inventory.pdf')
      document.body.appendChild(link)
      link.click()
    })
  }
}
