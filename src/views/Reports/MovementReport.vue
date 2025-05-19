<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner
                variant="primary"
                type="grow"
                label="Spinning"
              ></b-spinner>
            </b-col>
            <b-row v-else align-h="between">
              <b-col md="12" class="my-1 mb-3">
                <b-row align-h="between">
                  <b-col md="4">
                    Fecha inicial
                    <b-form-input
                      v-model="startDate"
                      type="date"
                    ></b-form-input>
                  </b-col>
                  <b-col md="4">
                    Fecha final
                    <b-form-input v-model="endDate" type="date"></b-form-input>
                  </b-col>
                  <b-col md="4">
                     Tipo de fecha a filtrar
                    <b-form-select v-model="date_type" :options="['Fecha de entrega','Fecha de creación']"></b-form-select>
                  </b-col>
                  <b-col md="4">
                    Tipo de orden
                    <b-form-select v-model="tipofilter" :options="['Todos','WhatsApp', 'Tienda', 'Página Web', 'Instagram', 'Pedidos Ya']"></b-form-select>
                  </b-col>
                  <b-col md="4">
                    Motivo
                    <b-form-select v-model="motivo" :options="['Todos','Cumpleaños','Aniversario','Amor','Graduación','Get Well Soon','Condolencias','Agradecimiento','Corporativo','Nacimiento','Boda','Día de las madres','San Valentín','Sin Ocasión']"></b-form-select> 
                  </b-col>
                  <b-col md="4" align-self="end">
                    <b-button
                      variant="primary"
                      v-b-tooltip.top="'Buscar'"
                      class="mx-2"
                      @click="getData()"
                    >
                      <i class="ri-search-line"></i>
                    </b-button>
                    <b-button
                      class="mr-2"
                      variant="outline-success"
                      v-b-tooltip.top="'Descargar a PDF'"
                      @click="exportPDF"
                    >
                      <i class="ri-download-cloud-line"></i>
                    </b-button>
                    <download-excel
                      class="btn btn-outline-warning"
                      :data="results.quantityByCategory"
                      :fields="titulos"
                      worksheet="Reporte de movimientos"
                      name="Reporte de movimientos.xls"
                    >
                      <i class="ri-file-excel-2-line"></i>
                    </download-excel>
                  </b-col>
                </b-row>
              </b-col>
              <template v-if="results.length === 0">
                <b-col class="col-md-12">
                  <b-alert :show="true" variant="secondary">
                    <div class="iq-alert-text">
                      <b>No hay registros para mostrar.</b>
                    </div>
                  </b-alert>
                </b-col>
              </template>
              <template v-else>
                <b-col md="12">
                 

                  <b-container class="my-3">
                    <h5 style="text-align: center;font-weight: bold;color: rgb(11, 11, 11);margin-bottom: 20px;">
                      Total de pedidos por modo de entrega
                    </h5>
                    <b-row v-for="(mode, j) in results.countByMode" :key="j">
                      <b-col
                        sm="6"
                        align="center"
                        style="font-weight: bold; color: #0b0b0b;font-transform:uppercase !important"
                        >{{ mode.mode.toUpperCase() }}</b-col
                      >
                      <b-col sm="6"> {{ mode.quantity }} </b-col>
                    </b-row>
                  </b-container>

                  <b-container class="my-3">
                    <h5 style="text-align: center;font-weight: bold;color: rgb(11, 11, 11);margin-bottom: 20px;">
                      Total de productos por personalización	
                    </h5>
                    <b-row
                      v-for="(pers, i) in results.countPersonalizedByProduct"
                      :key="i"
                    >
                      <b-col
                        sm="6"
                        align="center"
                        style="font-weight: bold; color: #0b0b0b"
                        ><span v-if="pers.personalized">PRODUCTOS PERSONALIZADOS</span
                        ><span v-else>PRODUCTOS STANDARD</span></b-col
                      >
                      <b-col sm="6"> {{ pers.quantity }} </b-col>
                    </b-row>
                  </b-container>

                  <b-container class="my-3">
                    <pre></pre>
                    <b-row
                      style="
                        font-weight: bold;
                        color: #0b0b0b;
                        size: 12px !important;
                        text-decoration: underline;
                      "
                    >
                      <b-col sm="4" align="center"></b-col>
                      <b-col sm="4"> Unidades</b-col>
                      <b-col sm="4"> Venta</b-col>
                    </b-row>
                    <b-row style="font-weight: bold; color: #0b0b0b">
                      <b-col sm="4" align="center">Total productos vendidos</b-col>
                      <b-col sm="4">{{ category.qty }}</b-col>
                      <b-col sm="4">
                        {{ parseFloat(category.val).toFixed(2) }}</b-col
                      >
                    </b-row>
                    <b-row
                      v-for="(category, j) in results.quantityByCategory"
                      :key="j"
                    >
                      <b-col
                        sm="4"
                        align="center"
                        style="font-weight: bold; color: #0b0b0b"
                        >{{ category.name }}</b-col
                      >
                      <b-col sm="4"> {{ category.quantity }}</b-col>
                      <b-col sm="4">
                        $ {{ parseFloat(category.value).toFixed(2) }}</b-col
                      >
                    </b-row>
                  </b-container>

                  <b-container class="my-3">
                    <b-row
                      style="
                        font-weight: bold;
                        color: #0b0b0b;
                        size: 12px !important;
                        text-decoration: underline;
                      "
                    >
                      <b-col sm="4" align="center"></b-col>
                      <b-col sm="4"> Unidades</b-col>
                      <b-col sm="4"> Venta</b-col>
                    </b-row>
                    <b-row
                      v-for="(category, j) in gProducts"
                      :key="j"
                      class="my-3"
                    >
                      <b-col sm="12">
                        <b-row style="font-weight: bold; color: #0b0b0b">
                          <b-col sm="4" align="center">{{ j }}</b-col>
                          <b-col sm="4"> {{ category.qty }}</b-col>
                          <b-col sm="4">
                            $ {{ parseFloat(category.val).toFixed(2) }}</b-col
                          >
                        </b-row>
                        <b-row v-for="(item, k) in category.products" :key="k">
                          <b-col sm="4" style="color: #0b0b0b">{{
                            item.name
                          }}</b-col>
                          <b-col sm="4"> {{ item.quantity }}</b-col>
                          <b-col sm="4">
                            $ {{ parseFloat(item.value).toFixed(2) }}</b-col
                          >
                        </b-row>
                      </b-col>
                    </b-row>
                  </b-container>
                </b-col>
              </template>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <iq-card id="exportPDF2">
      <b-row style="padding:2em">
        <b-col md="12" style="text-align:left">
          <b-button
            variant="primary"
            v-b-tooltip.top="'Descargar a PDF'"
            class="mx-2"
            @click="exportImageGraph()"
          >
            <i class="ri-download-cloud-line"></i>
          </b-button>
        </b-col>
         <b-col md="12">
          <h5 class="text-center my-3">Gráficos del reporte</h5>
          <p class="text-muted text-center">
            Estos gráficos muestran la distribución de las cantidades por categoría, modo, globos y productos.
          </p>  
         </b-col>
        <b-col md="6" class="p-3">
          <h4 class="text-center">Total de productos por categoria</h4>
          <div style="width: 100%; height: 400px;">
            <Pie
              :chart-options="chartOptions"
              :chart-data="chartDataByCategory"
              :chart-id="'pie-chart-category'"
              :styles="styles"
            />
          </div>
        </b-col>
        <b-col md="6" class="p-3">
          <h4 class="text-center">Pedidos por modo</h4>
          <div style="width: 100%; height: 400px;">
            <Pie
              :chart-options="chartOptions"
              :chart-data="chartDataByMode"
              :chart-id="'pie-chart-mode'"
              :styles="styles"
            />
          </div>
        </b-col>
      
        <b-col md="12" class="p-3">
          <h4 class="text-center">Pedidos por globos Top 5</h4>
          <div style="width: 100%; height: 400px;">
            <Bar
              :chart-options="chartBarOptions"
              :chart-data="chartDataByProductos"
              :chart-id="'bar-chart-productos'"
              :styles="styles"
            />
          </div>
        </b-col>
      </b-row>
    </iq-card>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import reportsService from '@/services/reports'
import moment from 'moment'
import { Pie, Bar,Line } from 'vue-chartjs/legacy';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, ArcElement)
export default {
  name: 'Moment',
  components: {Pie, Bar,Line},
  created () {},
  mounted () {
    vito.index()
    const dateInit = new Date()
    dateInit.setDate(dateInit.getDate() - 3)
    const dateEnd = new Date()
    dateEnd.setDate(dateEnd.getDate() + 3)
    const formatDateInit = moment(String(dateInit)).format('YYYY-MM-DD')
    const formatDateEnd = moment(String(dateEnd)).format('YYYY-MM-DD')
    this.startDate = formatDateInit
    this.endDate = formatDateEnd
    this.getData()
  },
  data () {
    return {
      motivo:"Todos",
      status: "Todos", // Default status
      date_type: "Fecha de creación", // Default date type
      tipofilter: "Todos", // Default type of order
      startDate: '',
      endDate: '',
      results: [],
      category: {
        qty: null,
        val: null
      },
      gProducts: {},
      sortBy: '',
      loading: true,
      filter: null,
      isShow: false,
      isRemoving: false,
      titles: [
        { label: 'Producto', key: 'name', class: 'text-center' },
        { label: 'Total', key: 'total', class: 'text-center' }
      ],
      titulos: {
        'Categoría': 'name',
        'Cantidad vendida': 'quantity',
        'Ventas': 'value'
      },
       chartDataByCategory: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16']
          }
        ]
      },
       chartDataByMode: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0']
          }
        ]
      },
      chartDataByGlobos: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: ['#FF9F40', '#FF6384', '#36A2EB', '#4BC0C0']
          }
        ]
      },
      chartDataByProductos: {
        labels: [],
        datasets: [
          {
            label: 'Top 5 Productos', // Añadir etiqueta para claridad
            data: [],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#E7E9ED', '#41B883', '#E46651', '#00D8FF', '#DD1B16']
          }
        ]
      },
      chartOptions: {
         plugins: {
            legend: {
              position: 'right', // Mueve la leyenda a la derecha
            },
          },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
      chartBarOptions: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
          },
          y: {
            beginAtZero: true,
          },
        },
      },
      plugins: {},
      cssClasses: '',
      styles: {
        width: '100%',
        height: '400px',
      },
      width: 800,
      height: 800
    }
  },
  computed: {
    rows () {
      return this.results.length
    }
  },
  methods: {
    exportPDF () {
      let params = `start_date=${this.startDate}&end_date=${this.endDate}&status=${this.status}&type=${this.tipofilter}`
      reportsService.getMovementReportPdf(params)
    },
    getData () {
      // eslint-disable-next-line no-unused-vars
      let params = ''
      params = `start_date=${this.startDate}&end_date=${this.endDate}&status=${this.status}&type=${this.tipofilter}&date_type=${this.date_type}&motivo=${this.motivo}`

      reportsService.getMovementReport(params)
        .then(response => {
          this.results = response.data
          this.category.qty = this.results.quantityByCategory.reduce((a, b) => a + parseInt(b.quantity), 0)
          this.category.val = this.results.quantityByCategory.reduce((a, b) => a + parseFloat(b.value), 0)
          const produtGrup = {}
          const categories = this.results.quantityByProduct
          categories.forEach(product => {
            if (!produtGrup.hasOwnProperty(product.category)) {
              produtGrup[product.category] = {
                products: [],
                qty: 0,
                val: 0
              }
            }
            const { name, category, quantity, value } = product
            produtGrup[product.category].products.push({ name, category, quantity, value })
            produtGrup[product.category].qty += parseInt(quantity)
            produtGrup[product.category].val += parseFloat(value)
          })
          this.gProducts = produtGrup
          this.updatePieCharts()

        })
        .catch(() => { })
        .finally(() => { this.loading = false })
    },
    updatePieCharts() {
    // Update chart data for categories
    const categories = this.results.quantityByCategory;
    const totalCategories = categories.reduce((acc, cat) => parseFloat(acc) + parseFloat(cat.quantity), 0);
    console.log('Total Categories:', totalCategories);
    console.log(categories);
    this.chartDataByCategory.labels = categories.map(
      cat => `${cat.name} (${((parseFloat(cat.quantity) / totalCategories) * 100).toFixed(2)}%)`
    );
    this.chartDataByCategory.datasets[0].data = categories.map(cat => cat.quantity);

    // Update chart data for modes
    const modes = this.results.countByMode;
    const totalModes = modes.reduce((acc, mode) => parseFloat(acc) + parseFloat(mode.quantity), 0);
    this.chartDataByMode.labels = modes.map(
      mode => `${mode.mode} (${((parseFloat(mode.quantity) / parseFloat(totalModes)) * 100).toFixed(2)}%)`
    );
    this.chartDataByMode.datasets[0].data = modes.map(mode => mode.quantity);

    // Update chart data for globos
    const globos = this.results.countByGlobos || [];
    const totalGlobos = globos.reduce((acc, globo) => acc + globo.quantity, 0);
    this.chartDataByGlobos.labels = globos.map(
      globo => `${globo.name} (${((globo.quantity / totalGlobos) * 100).toFixed(2)}%)`
    );
    this.chartDataByGlobos.datasets[0].data = globos.map(globo => globo.quantity);

    // Update chart data for products (top 5 and others)
    const productos = this.results.quantityByProduct || [];
    const sortedProductos = productos.sort((a, b) => parseFloat(b.quantity) - parseFloat(a.quantity));
    const topProductos = sortedProductos.slice(0, 5);
    const totalProductos = topProductos.reduce((acc, prod) => parseFloat(acc) + parseFloat(prod.quantity), 0);
    this.chartDataByProductos.labels = topProductos.map(
      prod => `${prod.name} (${((parseFloat(prod.quantity) / parseFloat(totalProductos)) * 100).toFixed(2)}%)`
    );
    this.chartDataByProductos.datasets[0].data = topProductos.map(prod => parseFloat(prod.quantity));
  },
   exportImageGraph() {
      const element = document.getElementById('exportPDF2');
      if (!element) {
        console.error('Elemento no encontrado');
        return;
      }

      html2canvas(element).then(canvas => {
        const link = document.createElement('a');
        link.download = 'reporte.png'; // Nombre del archivo descargado
        link.href = canvas.toDataURL('image/png'); // Convierte el canvas a una URL de imagen
        link.click(); // Simula el clic para descargar la imagen
      }).catch(error => {
        console.error('Error al generar la imagen:', error);
      });
    },
  },
  
}
</script>
