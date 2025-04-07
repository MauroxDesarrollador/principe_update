<template>
  <iq-card>
  <b-container fluid>
   <b-row>
     <b-col md="3"></b-col>
      <b-col md="6">
          <section class="custom-secction">
              <b-row>
                <b-col md="12"><span class="title-sales"><strong>Meta de ventas</strong></span></b-col>
                <b-col md="2" class="div-limit">{{ min }}</b-col>
                <b-col md="8">
              <range-slider v-if="testmax"
                class="slider"
                min="0"
                :max="testmax"
                step="10"
                v-bind:disabled="true"
                v-model="sliderValue">
              </range-slider>
              <div>{{ sliderValue }}$</div>
                </b-col>
                <b-col md="2" class="div-limit">{{ testmax }}$</b-col>
              </b-row>
          </section>
      </b-col>
      <b-col md="3"></b-col>
      <b-col md="6" >
        <Bar
          :chart-options="chartOptions"
          :chart-data="chartData"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
        />
      </b-col>
      <b-col md="6">
        <Bar
          :chart-options="chartOptions2"
          :chart-data="chartData2"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
        />
      </b-col>
   </b-row>
   <b-row>
      <b-col md="6">
        <LineChartGenerator
          :chart-options="chartOptions"
          :chart-data="chartData3"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
        />
      </b-col>
      <b-col md="6">
        <Pie
          :chart-options="chartOptions"
          :chart-data="chartData4"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
        />
      </b-col>
      <b-col md="3"></b-col>
      <b-col md="6">
        <LineChartGenerator
          :chart-options="chartOptions"
          :chart-data="chartData5"
          :chart-id="chartId"
          :dataset-id-key="datasetIdKey"
          :plugins="plugins"
          :css-classes="cssClasses"
          :styles="styles"
          :width="width"
          :height="height"
        />
      </b-col>
      <b-col md="3"></b-col>
   </b-row>
 </b-container>
</iq-card>
</template>
<script>
import { vito } from '../../config/pluginInit'
import reports from '@/services/reports'
import RangeSlider from "vue-range-slider"
import "vue-range-slider/dist/vue-range-slider.css"
import { Bar, Line as LineChartGenerator, Pie } from 'vue-chartjs/legacy'
import { Chart as ChartJS, Title, PointElement, LineElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement } from 'chart.js'
ChartJS.register(Title, PointElement, LineElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement)

export default {
  name: 'Dashboard1',
  components: { Bar, LineChartGenerator, Pie, RangeSlider },
  props: {
    msg: String,
    chartId: {
      type: String,
      default: 'bar-chart'
    },
    chartId3: {
      type: String,
      default: 'line-chart'
    },
    chartId4: {
      type: String,
      default: 'pie-chart'
    },
    datasetIdKey: {
      type: String,
      default: 'Text'
    },
    datasetIdKey3: {
      type: String,
      default: 'label'
    },
    datasetIdKey4: {
      type: String,
      default: 'label'
    },
    width: {
      type: Number,
      default: 400
    },
    width3: {
      type: Number,
      default: 400
    },
    height: {
      type: Number,
      default: 400
    },
    height3: {
      type: Number,
      default: 400
    },
    cssClasses: {
      default: '',
      type: String
    },
    cssClasses3: {
      default: '',
      type: String
    },
    styles: {
      type: Object,
      default: () => {}
    },
    plugins: {
      type: Object,
      default: () => {}
    }
  },
  mounted () {
    vito.index()
    if (localStorage.getItem('role') === 'ventas') {
      this.$router.push({ name: 'dashboard.home-taller' })
      return
    }
    this.testchart()
    // this.createGraph()
    // this.createGraph2()
    let jwt = require('jsonwebtoken')
    const METABASE_SITE_URL = 'https://intelligence.phoenixtechsa.com'
    const METABASE_SECRET_KEY = 'd59f4e341aeed3f6c955efdd75232ed0866808715896e94fcc71d14bc0c1767e'
    const payload = {
      resource: { dashboard: 1 },
      params: { },
      exp: Math.round(Date.now() / 1000) + (10 * 60) // 10 minute expiration
    }
    const token = jwt.sign(payload, METABASE_SECRET_KEY)
    this.iframeUrl = `${METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`
  },
  data () {
    return {
      salesToday: 0,
      sliderValue: 15000,
      min: 0,
      testmax: 0,
      iframeUrl: '',
      chartDataAll: null,
      chartData: {
        labels: [ 'Default', 'Default', 'Default' ],
        datasets: [ { data: [], label: 'Ventas por categoría', backgroundColor: '#f87979' } ]
      },
      chartOptions: {
        responsive: true
      },
      chartOptions2: {
        responsive: true
      },
      chartData2: {
        labels: [ 'Default', 'Default', 'Default' ],
        datasets: [ { data: [], label: 'Ventas por canal', backgroundColor: '#2ECC71' } ]
      },
      chartOptions3: {
        responsive: true,
        maintainAspectRatio: false
      },
      chartData3: {
        labels: [ 'Default', 'Default', 'Default' ],
        datasets: [ { data: [], label: 'Ranking de productos', backgroundColor: '#2ECC71' } ]
      },
      chartOptions4: {
        responsive: true,
        maintainAspectRatio: false
      },
      chartData4: {
        labels: [ 'Tulipanes', 'Jarrones', 'Lirios', 'Rosas', 'Globos', 'Chocolates' ],
        datasets: [ { data: [40, 20, 12, 100, 150, 200], label: 'Ventas por ocasión', backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'] } ]
      },
      chartOptions5: {
        responsive: true,
        maintainAspectRatio: false
      },
      chartData5: {
        labels: [ 'Tulipanes', 'Jarrones', 'Lirios', 'Rosas', 'Globos', 'Chocolates' ],
        datasets: [ { data: [40, 20, 12, 100, 150, 200], label: 'Ventas anuales', backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'] } ]
      }
    }
  },
  methods: {
    testchart () {
      reports.getCharts().then(response => {
        const resp = response.data
        if (response) {
          this.salesToday = resp.ventas_hoy.total_en_dolares
          this.sliderValue = resp.meta_de_ventas.progreso
          this.min = resp.meta_de_ventas.inicio
          this.testmax = resp.meta_de_ventas.objetivo
          this.chartDataAll = resp
          this.createGraph()
          this.createGraph2()
          this.createGraph3()
          this.createGraph4()
          this.createGraph5()
        } else if (response.data.errors.length > 0) {
          this.$refs.form.setErrors(response.data.errors)
        }
      })
        .catch(() => { this.isError = true })
        .finally(() => { this.loading = false })
    },
    createGraph () {
      let [object] = this.chartData.datasets
      this.chartData.labels = []
      object.data = []
      this.chartDataAll.productos_vendidos_por_categoría.forEach(data => {
        this.chartData.labels.push(data.name)
        object.data.push(data.sum)
      })
    },
    createGraph2 () {
      let [object] = this.chartData2.datasets
      this.chartData2.labels = []
      object.data = []
      this.chartDataAll.ventas_por_canal.forEach(data => {
        this.chartData2.labels.push(data.canal)
        object.data.push(data.total)
      })
    },
    createGraph3 () {
      let [object] = this.chartData3.datasets
      this.chartData3.labels = []
      object.data = []
      let count = 0
      this.chartDataAll.ranking_de_productos.forEach(data => {
        if (count < 10){
          this.chartData3.labels.push(data.Producto)
          object.data.push(14 + count)
        }
        count++
      })
    },
    createGraph4 () {
      let [object] = this.chartData4.datasets
      this.chartData4.labels = []
      object.data = []
      this.chartDataAll.ventas_por_ocasión.forEach(data => {
        this.chartData4.labels.push(data.reason)
        object.data.push(data.cantidad)
      })
    },
    createGraph5 () {
      let [object] = this.chartData5.datasets
      this.chartData5.labels = []
      object.data = []
      let count = 0
      this.chartDataAll.ventas_anuales.forEach(data => {
        if (count < 10){
          this.chartData5.labels.push(data.Meses)
          object.data.push(data.count)
        }
        count++
      })
    }
  }
}
</script>

<style>

.custom-div-grahp1 {
  background-color: blueviolet;
}
.div-sale-month {
  background-color: #8a2be28a;
  border-radius: 20px;
  color: white;
  margin-top: 5%;
  padding: 5%;
  border-width: 1px;
  border-style: solid;
  border-color: gray;
  font-size: 1.5rem;
}
.div-acum-month {
  background-color: #1e9e1394;
  border-radius: 20px;
  color: white;
  margin-top: 5%;
  padding: 5%;
  border-width: 1px;
  border-style: solid;
  border-color: gray;
  font-size: 1.5rem;
}
.div-acum-day {
  background-color: #409effad;
  border-radius: 20px;
  color: white;
  margin-top: 5%;
  padding: 5%;
  border-width: 1px;
  border-style: solid;
  border-color: gray;
  font-size: 1.5rem;
}
.span-mount {
  font-style: oblique;
  font-weight: bold;
}
.custom-secction {
  margin-top: 10% !important;
  margin: auto;
  text-align: center;
  border-width: 1px;
  border-style: solid;
  border-color: grey;
  border-radius: 20px;
  box-shadow: 5px 5px 40px;
  margin-bottom: 10% !important;
}
.range-slider-rail, .range-slider-fill {
    height: 2rem !important;
    border-radius: 10px;
}
.range-slider-knob {
    background-color: #827af3;
    height: 1.7rem;
    width: 1.7rem;
}
.range-slider {
    display: inline-block;
    padding: 0 10px;
    height: 20px;
    width: 100% !important;
}
.title-sales {
  font-size: 2rem;
}
.div-limit{
  padding: 0px;
}
</style>
