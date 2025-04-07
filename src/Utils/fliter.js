import Vue from 'vue'
import moment from 'moment'

Vue.filter('reverse', (value) => {
  // slice to make a copy of array, then reverse the copy
  return value.slice().reverse()
})

Vue.filter('fromNow', (value) => {
  if (value) {
    return moment(String(value)).fromNow()
  }
})

Vue.filter('formatDate', (value) => {
  if (value) {
    return moment(String(value)).format('DD-MM-YYYY')
  }
})

Vue.filter('formatWeekDate', (value) => {
  if (value) {
    moment.locale('es') // Establece el idioma en español
    return moment(String(value)).format('dddd LL [a las] hh:mm A') // Cambiado a formato 12h AM/PM
  }
})

Vue.filter('formatSinHHDate', (value) => {
  if (value) {
    moment.locale('es') // Establece el idioma en español
    return moment(String(value)).format('dddd LL') 
  }
})

Vue.filter('formatHora', (value) => {
  if (value) {
    moment.locale('es') // Establece el idioma en español
    // Parsea la hora indicando el formato de entrada y muestra en formato 12h AM/PM
    return moment(String(value), 'HH:mm:ss').format('hh:mm A')
  }
  return '' // Devuelve cadena vacía si no hay valor
})

Vue.filter('capitalize', (value) => {
  if (!value) return ''
  value = value.toString()
  value = value.toLowerCase()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('money', (value) => {
  if (value === 0) {
    return `$ 0.00`
  }
  value = parseFloat(value).toFixed(2)
  return `$ ${value}`
})