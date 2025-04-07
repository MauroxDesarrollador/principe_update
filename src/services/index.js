import axios from 'axios'
import constant from '../config/constant'
import { setupCache } from 'axios-cache-adapter'

let token = document.head.querySelector('meta[name="csrf-token"]') || ''

// Configurar el adaptador de caché
const cache = setupCache({
  maxAge: 3 * 60 * 1000 // Tiempo de almacenamiento en caché en milisegundos (en este caso, 5 minutos)
})

// Obtener el adaptador de la instancia de caché
const cacheAdapter = cache.adapter

export default axios.create({
  baseURL: constant.webBaseURL,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'X-CSRF-TOKEN': token
  },
  adapter: cacheAdapter
})
