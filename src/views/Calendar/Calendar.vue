<template>
  <b-container fluid>
    <b-row>
      <div class="text-center spinner" v-show="loading">
        <b-spinner
          variant="primary"
          type="grow"
          label="Spinning"
          style="width: 3rem; height: 3rem"
        ></b-spinner>
      </div>
    </b-row>
    <b-row>
      <b-col md="12">
        <iq-card>
          <b-col md="12">
            <template>
              <Fullcalendar
                ref="mycalendar"
                :custom-buttons="{
                  prev: {
                    text: 'PREV',
                    click: prevMonth,
                  },
                  next: {
                    text: 'NEXT',
                    click: nextMonth,
                  },
                }"
                locale="es"
                :plugins="calendarPlugins"
                :header="{
                  left: '',
                  center: 'title',
                  right: 'prev today next',
                }"
                :buttonText="{
                  today: 'Hoy',
                  month: 'Mes',
                  week: 'Semana',
                  day: 'Día',
                  list: 'Listado',
                }"
                @eventClick="handleEventClick"
                :weekends="true"
                :selectable="true"
                :editable="true"
                :events="formatCalendar"
              />
            </template>
          </b-col>
        </iq-card>
      </b-col>
    </b-row>
    <b-modal
      ref="modal-details"
      size="lg"
      id="modal-details"
      cancel-title="Cancelar"
      ok-only
      :title="details.modalTitle"
    >
      <OrderDetailComponent
        :dataId="orderId"
        :idList="ids"
        :enableButtons="false"
        :ocultar="hidden"
      >
      </OrderDetailComponent>
    </b-modal>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import Fullcalendar from '@fullcalendar/vue'
import DayGridPlugin from '@fullcalendar/daygrid'
import TimeGridPlugin from '@fullcalendar/timegrid'
import InteractionPlugin from '@fullcalendar/interaction'
import ListPlugin from '@fullcalendar/list'
import OrderDetailComponent from '@/components/Order/OrderDetailComponent'
import calendarService from '@/services/calendar'
import moment from 'moment'

require('@fullcalendar/core/main.min.css')
require('@fullcalendar/daygrid/main.min.css')
require('@fullcalendar/timegrid/main.min.css')

export default {
  name: 'Calendar',
  created () {
    const initDate = moment().format('YYYY-MM-01')
    const endDate = moment().endOf('month').format('YYYY-MM-DD')
    this.loadData(initDate, endDate)
  },
  mounted () {
    vito.index()
    this.role = localStorage.getItem('role')
    if (this.role === 'admin') {
      this.hidden = false
    } else {
      this.hidden = true
    }
  },
  data: () => ({
    loading: true,
    nextMes: 0,
    prevMes: 0,
    orderId: '',
    calendarApi: '',
    hidden: false,
    ids: [],
    role: '',
    title: '',
    details: {
      client: {
        name: '',
        email: '',
        phone: ''
      }
    },
    calendarPlugins: [
      DayGridPlugin,
      TimeGridPlugin,
      InteractionPlugin,
      ListPlugin
    ],
    calendar: []
  }),
  components: {
    Fullcalendar,
    OrderDetailComponent
  },
  methods: {
    prevMonth () {
      let calendarApi = this.$refs.mycalendar.getApi()
      calendarApi.prev()
      if (this.nextMes > 0) {
        this.nextMes -= 1
        const initDate = moment().add(this.nextMes, 'month').startOf('month').format('YYYY-MM-DD')
        const endDate = moment().add(this.nextMes, 'month').endOf('month').format('YYYY-MM-DD')
        this.loadData(initDate, endDate)
      } else {
        this.prevMes += 1
        const initDate = moment().subtract(this.prevMes, 'month').startOf('month').format('YYYY-MM-DD')
        const endDate = moment().subtract(this.prevMes, 'month').endOf('month').format('YYYY-MM-DD')
        this.loadData(initDate, endDate)
      }
    },
    nextMonth () {
      let calendarApi = this.$refs.mycalendar.getApi()
      calendarApi.next()
      if (this.prevMes > 0) {
        this.nextMes -= 1
        const initDate = moment().subtract(this.prevMes, 'month').startOf('month').format('YYYY-MM-DD')
        const endDate = moment().subtract(this.prevMes, 'month').endOf('month').format('YYYY-MM-DD')
        this.loadData(initDate, endDate)
      } else {
        this.nextMes += 1
        const initDate = moment().add(this.nextMes, 'month').startOf('month').format('YYYY-MM-DD')
        const endDate = moment().add(this.nextMes, 'month').endOf('month').format('YYYY-MM-DD')
        this.loadData(initDate, endDate)
      }
    },
    handleEventClick (clickInfo) {
      this.orderId = clickInfo.event.id
      this.$refs['modal-details'].show()
    },
    loadData (initDate, endDate) {
      this.loading = true
      calendarService.getAll(initDate, endDate)
        .then(response => {
          this.calendar = [...response.data]
        })
        .catch(() => { this.loading = false })
        .finally(() => {
          this.loading = false
          setTimeout(() => {
            this.isShow = false
          }, 2000)
        })
    }
  },
  computed: {
    formatCalendar () {
      if (this.role === 'design' || this.role === 'taller') {
        return this.calendar.map(item => ({
          id: item.id, title: item.products[0]?.name, date: item.delivery_date, color: '#111FF0', textColor: '#FFFFFF'
        }))
      }
      return this.calendar.map(item => ({
        id: item.id, title: item.client.name, date: item.delivery_date, color: '#111FF0', textColor: '#FFFFFF'
      }))
    }
  }
}
</script>
<style lang="stylus" scoped>
.spinner {
  width: 100%;
}
</style>
