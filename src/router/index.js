import Vue from 'vue'
import VueRouter from 'vue-router'
/* Layouts */
import Layout1 from '../layouts/Layout1'
import PublicLayout from '../layouts/PublicLayout'
import AuthLayout1 from '../layouts/AuthLayouts/AuthLayout1'
import Default from '../layouts/BlankLayout'

/* Dashboards View */
import Dashboard1 from '@/views/Dashboards/Dashboard1.vue'
import DashboardTaller from '@/views/Dashboards/DashboardTaller.vue'
import Deliveries from '@/views/Dashboards/Deliveries.vue'
import Client from '@/views/Clients/Client.vue'
import ClientList from '@/views/Clients/ClientList.vue'
import Product from '@/views/Product/Product.vue'
import ProductList from '@/views/Product/ProductList.vue'
import Order from '@/views/Orders/Order.vue'
import OrderList from '@/views/Orders/OrderList.vue'
import OderDetail from '@/views/Orders/OrderDetail.vue'
import OrderUpdate from '@/views/Orders/OrderUpdate.vue'
import User from '@/views/Users/User.vue'
import UserList from '@/views/Users/UserList.vue'
import Callback from '@/views/AuthPages/Default/Callback'

/* Reports */
/* Products movements */
import ProductsMovements from '@/views/Reports/ProductsMovements.vue'
import BestSeller from '@/views/Reports/BestSeller.vue'
import OrdersReport from '@/views/Reports/OrdersReport.vue'
import MovementReport from '@/views/Reports/MovementReport.vue'
import SalesJournalReport from '@/views/Reports/SalesJournalReport.vue'
import AccountsReceivableReport from '@/views/Reports/AccountsReceivableReport.vue'
import InventoryReport from '@/views/Reports/InventoryReport.vue'

/* Calendar */
/* -------------------- */
import Calendar from '@/views/Calendar/Calendar.vue'
/* End Calendar */

/* Authentic View */
import SignIn1 from '../views/AuthPages/Default/SignIn1'
import SignUp1 from '../views/AuthPages/Default/SignUp1'
import RecoverPassword1 from '../views/AuthPages/Default/RecoverPassword1'
import LockScreen1 from '../views/AuthPages/Default/LockScreen1'
import ConfirmMail1 from '../views/AuthPages/Default/ConfirmMail1'

import ErrorPage from '@/views/Pages/ErrorPage'
import ComingSoon from '@/views/Pages/ComingSoon'
import Maintenance from '@/views/Pages/Maintenance'

Vue.use(VueRouter)

// Set View in this function
const paRoutes = (prop, mode = false) => [
  {
    path: 'home',
    name: prop + '.home',
    meta: { dark: mode, auth: true, name: 'Dashborad' },
    component: Dashboard1
  },
  {
    path: 'home-taller',
    name: prop + '.taller',
    meta: { dark: mode, auth: true, name: 'Home taller' },
    component: DashboardTaller
  }
]

const orderRoutes = (prop, mode = false) => [
  {
    path: 'add',
    name: prop + '.add',
    meta: { dark: mode, auth: true, name: 'Crear orden' },
    component: Order
  },
  {
    path: 'list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'Lista de órdenes' },
    component: OrderList
  },
  {
    path: 'edit/:id',
    name: prop + '.edit',
    meta: { dark: mode, auth: true, name: 'Editar orden' },
    component: Order
  },
  {
    path: 'details/:id',
    name: prop + '.details',
    meta: { dark: mode, auth: true, name: 'Detalles de la orden' },
    component: OderDetail
  }
]

const userRoutes = (prop, mode = false) => [
  {
    path: 'add',
    name: prop + '.add',
    meta: { dark: mode, auth: true, name: 'Crear usuario' },
    component: User
  },
  {
    path: 'list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'Lista de usuarios' },
    component: UserList
  },
  {
    path: 'edit/:id',
    name: prop + '.edit',
    meta: { dark: mode, auth: true, name: 'Editar usuario' },
    component: User
  }
]

const reportRoutes = (prop, mode = false) => [
  {
    path: 'products-movements',
    name: prop + '.productsMovements',
    meta: { dark: mode, auth: true, name: 'Movimientos de productos' },
    component: ProductsMovements
  },
  {
    path: 'mas-vendidos',
    name: prop + '.bestSellers',
    meta: { dark: mode, auth: true, name: 'Productos más vendidos' },
    component: BestSeller
  },
  {
    path: 'order-report',
    name: prop + '.orderReport',
    meta: { dark: mode, auth: true, name: 'Reporte de ganancias' },
    component: OrdersReport
  },
  {
    path: 'inventory-report',
    name: prop + '.inventoryReport',
    meta: { dark: mode, auth: true, name: 'Reporte de rotación de inventarios' },
    component: InventoryReport
  },
  {
    path: 'movement-report',
    name: prop + '.movementReport',
    meta: { dark: mode, auth: true, name: 'Reporte de movimientos' },
    component: MovementReport
  },
  {
    path: 'sales-journal',
    name: prop + '.salesJournalReport',
    meta: { dark: mode, auth: true, name: 'Reporte Diario de Ventas' },
    component: SalesJournalReport
  },
  {
    path: 'accounts-receivable',
    name: prop + '.accountsReceivableReport',
    meta: { dark: mode, auth: true, name: 'Reporte de Cuentas X Cobrar' },
    component: AccountsReceivableReport
  }
]

const calendarRoutes = (prop, mode = false) => [
  {
    path: 'calendar-registry',
    name: prop + '.calendar',
    meta: { dark: mode, auth: true, name: 'Calendario de entregas' },
    component: Calendar
  }

]

const clientRoutes = (prop, mode = false) => [
  {
    path: 'list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'Clientes' },
    component: ClientList
  },
  {
    path: 'add',
    name: prop + '.add',
    meta: { dark: mode, auth: true, name: 'Agregar cliente' },
    component: Client
  },
  {
    path: 'edit/:id',
    name: prop + '.edit',
    meta: { dark: mode, auth: true, name: 'Editar cliente' },
    component: Client
  }
]

const productRoutes = (prop, mode = false) => [
  {
    path: 'list',
    name: prop + '.list',
    meta: { dark: mode, auth: true, name: 'Inventario' },
    component: ProductList
  },
  {
    path: 'add',
    name: prop + '.add',
    meta: { dark: mode, auth: true, name: 'Agregar producto' },
    component: Product
  },
  {
    path: 'edit/:id',
    name: prop + '.edit',
    meta: { dark: mode, auth: true, name: 'Editar producto' },
    component: Product
  }
]

const authChildRoutes = (prop, mode = false) => [
  {
    path: 'sign-in',
    name: prop + '.sign-in',
    meta: { dark: mode, auth: true },
    component: SignIn1
  },
  {
    path: 'sign-up',
    name: prop + '.sign-up',
    meta: { dark: mode, auth: true },
    component: SignUp1
  },
  {
    path: 'password-reset',
    name: prop + '.password-reset',
    meta: { dark: mode, auth: false },
    component: RecoverPassword1
  },
  {
    path: 'lock-screen',
    name: prop + '.lock-screen',
    meta: { dark: mode, auth: true },
    component: LockScreen1
  },
  {
    path: 'confirm-mail',
    name: prop + '.confirm-mail',
    meta: { dark: mode, auth: true },
    component: ConfirmMail1
  },
  {
    path: 'public/:id',
    name: prop + '.update',
    meta: { dark: mode, auth: false },
    component: OrderUpdate
  }
]

const pagesChildRoutes = (prop, mode = false) => [
  {
    path: 'error/:code',
    name: prop + '.error',
    meta: { dark: mode, auth: true },
    component: ErrorPage
  },
  {
    path: 'coming-soon',
    name: prop + '.coming-soon',
    meta: { dark: mode, auth: true },
    component: ComingSoon
  },
  {
    path: 'maintenance',
    name: prop + '.maintenance',
    meta: { dark: mode, auth: true },
    component: Maintenance
  }
]

const publicRoutes = (prop, mode = false) => [
  {
    path: 'delivery',
    name: prop + '.delivery',
    meta: { dark: mode, auth: false },
    component: Deliveries,
    props: { mode: 'delivery' }
  },
  {
    path: 'local',
    name: prop + '.local',
    meta: { dark: mode, auth: false },
    component: Deliveries,
    props: { mode: 'local' }
  }
]

// Set Layout in this route
const routes = [
  {
    path: '*',
    redirect: 'default/error/404',
    // name: 'default',
    component: ErrorPage,
    meta: { auth: true },
    children: pagesChildRoutes('default')
  },
  {
    path: '/auth',
    name: 'auth1',
    component: AuthLayout1,
    meta: { auth: true },
    children: authChildRoutes('auth1')
  },
  {
    path: '/form',
    name: 'public',
    component: AuthLayout1,
    meta: { auth: true },
    children: authChildRoutes('public')
  },
  {
    path: '/',
    name: 'dashboard',
    component: Layout1,
    meta: { auth: true },
    children: paRoutes('dashboard')
  },
  {
    path: '/public',
    name: 'deliveries',
    component: PublicLayout,
    meta: { auth: true },
    children: publicRoutes('public')
  },
  {
    path: '/orders',
    name: 'orders',
    component: Layout1,
    meta: { auth: true },
    children: orderRoutes('orders')
  },
  {
    path: '/user',
    name: 'user',
    component: Layout1,
    meta: { auth: true },
    children: userRoutes('user')
  },
  {
    path: '/reports',
    name: 'reports',
    component: Layout1,
    meta: { auth: true },
    children: reportRoutes('reports')
  },
  {
    path: '',
    name: 'calendar',
    component: Layout1,
    meta: { auth: true },
    children: calendarRoutes('calendar')
  },
  {
    path: '/clients',
    name: 'clients',
    component: Layout1,
    meta: { auth: true },
    children: clientRoutes('client')
  },
  {
    path: '/products',
    name: 'product',
    component: Layout1,
    meta: { auth: true },
    children: productRoutes('product')
  },
  {
    path: '/pages',
    name: 'pages',
    component: Default,
    meta: { auth: true },
    children: pagesChildRoutes('default')
  },
  {
    path: '/callback',
    name: 'callback',
    meta: { auth: false },
    component: Callback
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  const publicPages = ['/auth/sign-in', '/auth/sign-up']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('user')
  const user = JSON.parse(loggedIn)
  if (to.meta.auth) {
    if (authRequired && loggedIn === null) {
      return next('/auth/sign-in')
    } else if (to.name === 'dashboard') {
      if (user.role === 'admin') {
        return next('/home')
      } else {
        return next('/home-taller')
      }
    }
  }
  next()
})

export default router
