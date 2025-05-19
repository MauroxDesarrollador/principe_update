<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <b-alert :show="isShow" variant="success" class="bg-white" id="alert">
          <div class="iq-alert-icon">
            <i class="ri-alert-line"></i>
          </div>
          <div class="iq-alert-text">
            El registro ha sido
            <b>eliminado</b> con éxito!
          </div>
        </b-alert>
        <iq-card>
          <template v-slot:body>
            <b-col
              md="12"
              class="text-center spinner"
              v-show="isRemoving"
              id="removing"
            >
              <b-spinner
                variant="primary"
                type="grow"
                label="Spinning"
              ></b-spinner>
            </b-col>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner
                variant="primary"
                type="grow"
                label="Spinning"
              ></b-spinner>
            </b-col>
            <div v-else>
              <b-row>
                <b-col md="4">
                  <b-form-group
                    label="Filtro"
                    label-cols-sm="3"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="filterInput"
                    class="mb-0 pt-3"
                  >
                    <b-input-group size="sm">
                      <b-form-input
                        v-model="filter"
                        type="search"
                        id="filterInput"
                        placeholder="Escriba para buscar"
                      ></b-form-input>
                      <b-input-group-append>
                        <b-button :disabled="!filter" @click="filter = ''"
                          >Limpiar</b-button
                        >
                      </b-input-group-append>
                    </b-input-group>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group class="mb-0 pt-3">
                    <b-form-select
                      v-model="selectedPersonalize"
                      id="types"
                      size="sm"
                      :options="perOptions"
                    ></b-form-select>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group class="mb-0 pt-3">
                    <b-form-select
                      v-model="selectedType"
                      id="types"
                      size="sm"
                      :options="typeOptions"
                    ></b-form-select>
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row align-v="center">
                <b-col md="1"></b-col>
                <b-col md="2">
                  <b-form-group label="Fecha inicial:" label-for="date">
                    <b-form-input v-model="initDate" type="date"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Fecha final:" label-for="date">
                    <b-form-input v-model="endDate" type="date"></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2" style="">
                    Estatus de ordenes
                    <b-form-select v-model="statusFilter" :options="['Todos','Creado', 'Confeccionado', 'Entregado']"></b-form-select>
                </b-col>
                <b-col md="2">
                  <b-button
                    size="md"
                    variant="outline-primary"
                    @click="filterData"
                  >
                    Buscar
                  </b-button>
                </b-col>
                <b-col md="12">
                  <b-form-group>
                    <b-button variant="primary" @click="createOrder">Crear orden</b-button>
                    <b-button variant="success" style="margin-left:10px" @click="getExcel">Excel</b-button>
                    
                  </b-form-group>
                </b-col>
                <template v-if="orders.length === 0">
                  <b-col class="col-md-12">
                    <b-alert :show="true" variant="secondary">
                      <div class="iq-alert-text">
                        <b>No hay registros para mostrar.</b> Por favor agrege
                        un cliente para comenzar!
                      </div>
                    </b-alert>
                  </b-col>
                </template>
                <template v-else>
                  <b-col md="12" class="table-responsive">
                    <b-table
                      striped
                      bordered
                      hover
                      :items="orders"
                      :filter="filter"
                      :fields="titles"
                      :per-page="perPage"
                      :sort-by.sync="sortBy"
                      :sort-desc.sync="sortDesc"
                      :current-page="currentPage"
                      @filtered="onFiltered"
                    >
                  
                      <template v-slot:cell(id)="orders">
                      {{ orders.item.id }}
                      <div v-html="BadgeProducts(orders.item.id)"></div>
                      </template>
                      <template v-slot:cell(products)="orders">
                        <div
                          v-for="item in orders.item.products"
                          :key="item.id"
                        >
                          {{ item.name }}
                        </div>
                      </template>
                      <template v-slot:cell(mode)="orders">{{
                        orders.item.mode | capitalize
                      }}</template>
                      <template v-slot:cell(created_at)="orders">{{
                        orders.item.created_at | formatDate
                      }}</template>
                      <template v-slot:cell(delivery_date)="orders">{{
                        orders.item.delivery_date | formatSinHHDate
                      }}</template>
                      <template v-slot:cell(personalizedRequired)="orders">{{
                        orders.item.personalizedRequired
                          ? " Personalizado"
                          : "Estándar"
                      }}</template>
                      <template v-slot:cell(editor)="orders">
                        <b-button
                          v-show="role === 'admin'"
                          v-b-tooltip.top="'Editar dedicatoria'"
                          variant=" iq-bg-success mr-1 mb-1"
                          size="sm"
                          @click="openEditor(orders.item)"
                        >
                          <i class="ri-align-left m-0"></i>
                        </b-button>
                      </template>
                      <template v-slot:cell(status)="orders">
                        <b-badge
                          variant="primary"
                          v-if="orders.item.status === 'Creado'"
                          >{{ orders.item.status }}</b-badge
                        >
                        <b-badge
                          variant="secondary"
                          v-if="orders.item.status === 'Pendiente'"
                          >{{ orders.item.status }}</b-badge
                        >
                        <b-badge
                          variant="warning"
                          v-if="orders.item.status === 'En confección'"
                          >{{ orders.item.status }}</b-badge
                        >
                        <b-badge
                          variant="warning"
                          v-if="orders.item.status === 'Confección urgente'"
                          >{{ orders.item.status }}</b-badge
                        >
                        <b-badge
                          variant="light"
                          v-if="orders.item.status === 'Confeccionado'"
                          >{{ orders.item.status }}</b-badge
                        >
                        <b-badge
                          variant="info"
                          v-if="orders.item.status === 'En camino a reparto'"
                          >{{ orders.item.status }}</b-badge
                        >
                        <b-badge
                          variant="success"
                          v-if="orders.item.status === 'Entregado'"
                          >{{ orders.item.status }}</b-badge
                        >
                        <b-badge
                          variant="danger"
                          v-if="orders.item.status === 'Cancelado'"
                          >{{ orders.item.status }}</b-badge
                        >
                      </template>
                      <template v-slot:cell(update)="orders">
                        <b-form-select
                          :disabled="orders.item.status === 'Cancelado'"
                          v-model="orders.item.status"
                          :options="statuses"
                          @change="onStatusUpdate(orders.item.id, $event)"
                        ></b-form-select>
                      </template>
                      <template v-slot:cell(action)="orders">
                        <b-dropdown
                          id="dropdownMenuButton5"
                          right
                          variant="none"
                          data-toggle="dropdown"
                        >
                          <template v-slot:button-content>
                            <span class="text-primary">
                              <i class="ri-more-fill"></i>
                            </span>
                          </template>
                          <b-dropdown-item
                            @click="showLink(orders.item)"
                            variant=" iq-bg-success mr-1 mb-1"
                          >
                            <i class="ri-link-m mr-2"></i>
                            {{ $t("dropdown.link") }}
                          </b-dropdown-item>
                          <b-dropdown-item
                            @click="details(orders.item)"
                            variant=" iq-bg-primary mr-1 mb-1"
                          >
                            <i class="ri-eye-fill mr-2"></i>
                            {{ $t("dropdown.view") }}
                          </b-dropdown-item>
                          <b-dropdown-item
                            @click="edit(orders.item)"
                            variant=" iq-bg-success mr-1 mb-1"
                          >
                            <i class="ri-pencil-fill mr-2"></i>
                            {{ $t("dropdown.edit") }}
                          </b-dropdown-item>
                          <b-dropdown-item style="display:none !important"
                            @click="remove(orders.item)"
                            variant=" iq-bg-danger mr-1 mb-1"
                          >
                            <i class="ri-delete-bin-6-fill mr-2"></i>
                            {{ $t("dropdown.delete") }}
                          </b-dropdown-item>
                        </b-dropdown>
                      </template>
                    </b-table>
                  </b-col>
                  <b-col sm="5" md="4">
                    <b-form-group
                      label="Resultados por página"
                      label-cols-sm="6"
                      label-cols-md="6"
                      label-align-sm="right"
                      label-size="sm"
                      label-for="perPageSelect"
                      class="mb-0"
                    >
                      <b-form-select
                        v-model="perPage"
                        id="perPageSelect"
                        size="sm"
                        :options="pageOptions"
                      ></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col sm="7" md="8">
                    <b-pagination
                      v-model="currentPage"
                      :total-rows="rows"
                      :per-page="perPage"
                      align="right"
                      aria-controls="my-table"
                    ></b-pagination>
                  </b-col>
                </template>
              </b-row>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <!-- Modal Detalles de Orden -->
    <b-modal
      ref="orderDetailModal"
      size="lg"
      id="modal-1"
      cancel-title="Cancelar"
      ok-only
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
    >
      <OrderDetailComponent
        :dataId="orderId"
        :idList="ids"
        :enableButtons="role === 'admin' ? false : true"
      ></OrderDetailComponent>
    </b-modal>

    <!-- Modal Editor de Dedicatoria -->
    <b-modal
      ref="modalEditor"
      size="lg"
      id="modal-editor"
      cancel-title="Cancelar"
      ok-only
      no-close-on-esc
      no-close-on-backdrop
      hide-header-close
      @ok="closeEditor"
    >
      <editor
        v-model="dedication"
        api-key="dtwycivggpsc9sq8d6ddmy3zr8xbydnjateyum1wpxjwn37c"
        :init="{
          height: 500,
          menubar: true,
          plugins: [
            'advlist autolink lists link image charmap print preview anchor',
            'searchreplace visualblocks code fullscreen',
            'insertdatetime media table paste code help wordcount',
          ],
          toolbar:
            'undo redo | formatselect | bold italic backcolor | \
           alignleft aligncenter alignright alignjustify | \
           bullist numlist outdent indent | removeformat | print',
        }"
      />
    </b-modal>
  </b-container>
</template>

<script>
import Editor from '@tinymce/tinymce-vue'
import { vito } from '../../config/pluginInit'
import orderService from '@/services/order'
import OrderDetailComponent from '@/components/Order/OrderDetailComponent'
import moment from 'moment'
import reportsService from '@/services/reports'


export default {
  name: 'OrderList',
  components: {
    OrderDetailComponent,
    editor: Editor
  },
  created () {
    orderService.orderStatuses()
      .then(response => {
        const object = response.data
        for (const iterator of object) {
          let status = {}
          status.disabled = false
          status.value = iterator
          status.text = iterator
          this.statuses.push(status)
        }
      })
      .catch(error => { console.error(error) })

    // const param = `init_date=${this.initDate}&end_date=${this.endDate}&orderBy=created_at&orderDirection=desc`
    // this.loadData(param)
  },
  mounted () {
    vito.index()
    const date = new Date()
    date.setDate(date.getDate())
    const formatDate = moment(String(date)).format('YYYY-MM-DD')
    const formatDate2 = moment(String(date)).add(7, 'days').format('YYYY-MM-DD')
    this.initDate = formatDate
    this.endDate = formatDate
    this.role = localStorage.getItem('role')
    let params = `init_date=${this.initDate}&end_date=${formatDate2}`
    this.loadData(params)
  },
  data () {
    return {
      statusFilter: 'Todos', // Filtro para el status de las ordenes
      dedication: '',
      selectedType: 2,
      selectedPersonalize: 2,
      initDate: '',
      endDate: '',
      typeOptions: [
        { value: 1, text: 'Fecha de entrega' },
        { value: 2, text: 'Fecha de creación' }
      ],
      perOptions: [
        { value: null, text: 'Tipo de orden' },
        { value: 'whatsapp', text: 'WhatsApp' },
        { value: 'tienda', text: 'Tienda' },
        { value: 'paginaweb', text: 'Página Web' },
        { value: 'instagram', text: 'Instagram' },
        { value: 'pedidosya', text: 'Pedidos Ya' }
      ],
      ids: [],
      role: '',
      orderId: '',
      orders: [],
      sortBy: '',
      statuses: [],
      loading: true,
      filter: null,
      isShow: false,
      isRemoving: false,
      perPage: 15,
      sortDesc: false,
      pageOptions: [5, 10, 15, 25, 50, 100, 200],
      totalRows: 1,
      currentPage: 1,
      params: '',
      titles: [
        { label: '#Orden', key: 'id', class: 'text-center', sortable: true },
        { label: 'Fecha Creación', key: 'created_at', class: 'text-center', sortable: true },
        { label: 'Cliente', key: 'client.name', class: 'text-center', sortable: true },
        { label: 'Productos', key: 'products', class: 'text-center', sortable: true },
        { label: 'Tipo de compra', key: 'type', class: 'text-center', sortable: true },
        { label: 'Entrega Est.', key: 'delivery_date', class: 'text-center', sortable: true },
        { label: 'Modo de entrega', key: 'mode', class: 'text-center', sortable: true },
        { label: 'Estatus', key: 'status', class: 'text-center', sortable: true },
        { label: 'Nuevo status', key: 'update', class: 'text-center', sortable: false },
        { label: 'Editor', key: 'editor', class: 'text-center', sortable: false },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ]
    }
  },
  computed: {
    rows () {
      return this.orders.length
    }
  },
  methods: {
    BadgeProducts(id){
      let ordenData=this.orders.find(p=>p.id==id);
      let productosArray=ordenData.products;
      let htmlValidate="";
      let personalizate = false;
      let noteValidate=false;
      let noteDesignValidate=false;
      for(let i=0;i<productosArray.length;i++){
          if(productosArray[i].personalized_text!=null){
            personalizate=true;
          }
          if(productosArray[i].note_design!=null){
            personalizate=true;
          }
          if(productosArray[i].note!=null){
            personalizate=true;
          }
      }
      if(personalizate==true){
        htmlValidate+="<span class='badge badge-primary'>Personalizado</span>";
      }
      if(noteValidate==true){
        htmlValidate+="<span class='badge badge-primary'>Nota de taller</span>";
      }
       if(noteDesignValidate==true){
        htmlValidate+="<span class='badge badge-primary'>Nota de diseño</span>";
      }
      return htmlValidate;
    },
    getExcel(){
      let params = ''
      if (this.selectedPersonalize !== 2) {
        if (this.selectedType === 1) {
          // Fecha de creación
          params = `delivery_init_date=${this.initDate}&delivery_end_date=${this.endDate}&required_personalized=${this.selectedPersonalize}&orderBy=created_at&orderDirection=desc&status=${this.statusFilter}`
        } else {
          // Fecha de entrega
          params = `init_date=${this.initDate}&end_date=${this.endDate}&required_personalized=${this.selectedPersonalize}&orderBy=created_at&orderDirection=desc&status=${this.statusFilter}`
        }
      } else {
        if (this.selectedType === 1) {
          // Fecha de creación
          params = `delivery_init_date=${this.initDate}&delivery_end_date=${this.endDate}&orderBy=created_at&orderDirection=desc&status=${this.statusFilter}`
        } else {
          // Fecha de entrega
          params = `init_date=${this.initDate}&end_date=${this.endDate}&orderBy=created_at&orderDirection=desc&status=${this.statusFilter}`
        }
      }
      reportsService.getMovementReportExcel(params)
    },
    showLink (item) {
      const route = this.$router.resolve({ path: `/form/public/${item.id}` })
      window.open(route.href, '_blank')
    },
    filterData () {
      let params = ''
      if (this.selectedPersonalize !== 2) {
        if (this.selectedType === 1) {
          // Fecha de creación
          params = `delivery_init_date=${this.initDate}&delivery_end_date=${this.endDate}&required_personalized=${this.selectedPersonalize}&orderBy=created_at&orderDirection=desc&status=${this.statusFilter}`
        } else {
          // Fecha de entrega
          params = `init_date=${this.initDate}&end_date=${this.endDate}&required_personalized=${this.selectedPersonalize}&orderBy=created_at&orderDirection=desc&status=${this.statusFilter}`
        }
      } else {
        if (this.selectedType === 1) {
          // Fecha de creación
          params = `delivery_init_date=${this.initDate}&delivery_end_date=${this.endDate}&orderBy=created_at&orderDirection=desc&status=${this.statusFilter}`
        } else {
          // Fecha de entrega
          params = `init_date=${this.initDate}&end_date=${this.endDate}&orderBy=created_at&orderDirection=desc&status=${this.statusFilter}`
        }
      }
      this.loadData(params)
    },
    async loadData (params) {
      this.loading = true
      let config = {
        'scope': '1',
        'orderBy': 'created_at',
        'orderDirection': 'desc'
      }
      orderService.getAll(params, config)
        .then(response => {
          this.orders = response.data
          this.orders.map(r => {
            this.ids.push(r.id)
          })
        })
        .catch(() => { })
        .finally(() => { this.loading = false })
    },
    onStatusUpdate (id, status) {
      this.isRemoving = true
      orderService.updateSatus(id, status)
        .then(response => {})
        .catch(error => { console.error(error) })
        .finally(() => { this.isRemoving = false })
    },
    createOrder () {
      this.$router.push({ name: 'orders.add' })
    },
    remove (order) {
      this.isRemoving = true
      orderService.delete(order.id)
        .then(response => {
          this.isRemoving = false
          if (response.status) { this.loadData() }
        })
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    edit (item) {
      this.$router.push({ name: 'orders.edit', params: { id: item.id } })
    },
    details (item) {
      if (this.role === 'admin' || this.role === 'ventas') {
        let routeData = this.$router.resolve({ name: 'orders.details', params: { id: item.id } })
        window.open(routeData.href, '_blank')
        // this.$router.push({ name: 'orders.details', params: { id: item.id } })
      }
      if (this.role === 'taller') {
        // Abrir el modal
        this.orderId = item.id
        this.$refs['orderDetailModal'].show()
      }
    },
    openEditor (item) {
      this.dedication = item.dedication
      this.$refs['modalEditor'].show()
    },
    closeEditor () {
      this.dedication = ''
    }
  }
}
</script>

<style>
input[type="date"] {
  height: 33px !important;
}
</style>
