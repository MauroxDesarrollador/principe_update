<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <b-alert
          id="alert"
          :show="isShow"
          variant="success"
          class="bg-white"
          mt-2>
          <div class="iq-alert-icon">
            <i class="ri-alert-line"></i>
          </div>
          <div class="iq-alert-text">
            El registro ha sido <b>eliminado</b> con éxito!
          </div>
        </b-alert>
        <iq-card>
          <template v-slot:body>
            <b-col md="12" class="text-center spinner" v-show="isRemoving">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-row  align-h="between">
              <b-col sm="5" md="4" class="my-1">
                <b-form-group
                  label="Filtro"
                  label-cols-sm="3"
                  label-align-sm="right"
                  label-size="sm"
                  label-for="filterInput"
                  class="mb-0">
                  <b-input-group size="sm">
                    <b-form-input
                      v-model="filter"
                      type="search"
                      id="filterInput"
                      placeholder="Escriba para buscar"
                    ></b-form-input>
                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col sm="7" md="2" class="my-1">
                <b-form-group>
                  <b-button variant="primary" @click="add" style="min-width:150px">Nuevo cliente</b-button>
                  </b-form-group>
                  <b-form-group>
                  <b-button variant="primary" @click="exportarClientes()" style="min-width:150px">Exportar Clientes</b-button>
                </b-form-group>
              </b-col>
              <template >
                <b-col md="12" class="table-responsive" :style="{visibility: StatusData ? 'visible' : 'hidden'}">
                  <b-table
                    striped
                    bordered
                    hover
                    :items="loadData"
                    :fields="titles"
                    :filter="filter"
                    :current-page="currentPage"
                    :per-page="perPage"
                    ref="table"
                    >
                    <template v-slot:cell(created_at)="clients">
                      {{ clients.item.created_at | formatDate }}
                    </template>
                    <template v-slot:cell(action)="clients">
                      <b-button
                        v-b-tooltip.top="'Editar'"
                        variant=" iq-bg-success mr-1 mb-1"
                        size="sm"
                        @click="edit(clients.item)">
                        <i class="ri-ball-pen-fill m-0"></i>
                      </b-button>
                      <b-button
                        v-b-tooltip.top="'Eliminar'"
                        variant=" iq-bg-danger"
                        size="sm"
                        @click="remove(clients.item)">
                        <i class="ri-delete-bin-line m-0"></i>
                      </b-button>
                    </template>
                  </b-table>
                </b-col>
                <!-- <b-col sm="5" md="4">
                  <b-form-group
                    label="Resultados por página"
                    label-cols-sm="6"
                    label-cols-md="6"
                    label-align-sm="right"
                    label-size="sm"
                    label-for="perPageSelect"
                    class="mb-0">
                    <b-form-select
                      v-model="perPage"
                      id="perPageSelect"
                      size="sm"
                      :options="pageOptions"
                    ></b-form-select>
                  </b-form-group>
                </b-col> -->
                <b-col sm="12" md="12" :style="{visibility: StatusData ? 'visible' : 'hidden'}">
                  <b-pagination
                    v-model="currentPage"
                    :total-rows="totalRows"
                    :per-page="perPage"
                    align="center"
                    aria-controls="my-table"
                  >
                  </b-pagination>
                </b-col>
              </template>
              <template >
                <b-col class="col-md-12" v-if="!StatusData">
                  <b-alert :show="true" variant="secondary">
                    <div class="iq-alert-text">
                      <b>No hay registro para mostrar.</b> Por favor agrege un cliente para comenzar!
                    </div>
                  </b-alert>
                </b-col>
              </template>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
     <b-row>
      <b-col lg="12">
        <iq-card>
          <template v-slot:body>
            <div class="new-user-info">
              <b-row>
                <b-form-group class="col-md-12" label="Fecha:" label-for="fecha">
                  <b-form-input
                    v-model="filterReport.fecha"
                    type="date"
                    name="fecha"
                    id="fecha"
                    @change="getClientByDayToMonth()"
                    placeholder="Fecha">
                  </b-form-input>
                </b-form-group>
              
              </b-row>
              <hr />

                <section v-if="clientByDayToMonth.data && clientByDayToMonth.data.length > 0">
                  <b-row>
                    <b-col lg="12">
                      <h4>Clientes por día del mes</h4>
                      <h5>Total: {{ clientByDayToMonth.total }}</h5>
                      <p style="text-align: center;">
                        <b>Nota:</b> 
                        Clientes nuevos por mes son los clientes nuevos menos los clientes nuevos del día.
                        <br>
                        Total general de clientes son los clientes viejos menos los clientes nuevos del mes.
                      </p>
                      <div class="table-responsive">
                        <table class="table table-bordered table-striped">
                          <thead>
                            <tr>
                              <th scope="col">Dia</th>
                              <th scope="col">Total clientes nuevos del dia</th>
                              <th scope="col">Total clientes nuevos del mes ( {{parseFloat(clientByDayToMonth.total_mes) }} )</th>
                              <th scope="col">Total General de clientes ({{parseFloat(clientByDayToMonth.total)}} )</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="(item, index) in clientByDayToMonth.data" :key="index">
                              <td>{{ item.day }}</td>
                              <td>{{ item.total_dia }}</td>
                              <td>{{ parseFloat(clientByDayToMonth.total_mes) - parseFloat(item.total_dia) }}</td>
                              <td>{{ parseFloat(clientByDayToMonth.total) - parseFloat(clientByDayToMonth.total_mes) - parseFloat(item.total_dia)  }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </b-col>
                  </b-row>
                </section>

            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { vito } from '../../config/pluginInit'
import clientService from '@/services/client'

export default {
  name: 'ClientList',
  created () { },
  mounted() {
    vito.index()
    this.filterReport.fecha = new Date().toISOString().slice(0, 10);
     this.getClientByDayToMonth();
  },
  data () {
    return {
      sortBy: '',
      loading: true,
      filter: null,
      isShow: false,
      isRemoving: false,
      perPage: 15,
      pageOptions: [5, 10, 15, 25, 50, 100, 200],
      totalRows: 1,
      currentPage: 1,
      StatusData: true,
      titles: [
        { label: 'Nombre', key: 'name', class: 'text-center', sortable: true },
        { label: 'Email', key: 'email', class: 'text-center', sortable: true },
        { label: 'Teléfono', key: 'phone', class: 'text-center', sortable: true },
        { label: 'Fecha creación', key: 'created_at', class: 'text-center', sortable: true },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ],
      clients: [],
      clientByDayToMonth: {
        status: false,
        data: [], // Inicializar como un array vacío
        total: 0,
        total_mes: 0,
      },
      filterReport:{
        fecha: '',
      }
    }
  },
  methods: {
    async getClientByDayToMonth () {
      this.clientByDayToMonth = { data: [], total: 0, total_mes: 0, status: false };
      try {
        const response = await clientService.getReportByDayToMonth("?fecha=" + this.filterReport.fecha);
        this.clientByDayToMonth.data = response.data || [];
        this.clientByDayToMonth.total = response.total_general || 0;
        this.clientByDayToMonth.total_mes = response.total_mes || 0;
        this.clientByDayToMonth.status = response.status || false;
      } catch (error) {
        console.error(error);
        this.clientByDayToMonth.data = []; // Asegurar que sea un array
      }
    },
    async loadData () {
      this.loading = true
      let config = {
        'scope': '1',
        'paginate': '1',
        'page': this.currentPage,
        'name': this.filter !== null ? this.filter : ''
      }
      const { data, pagination } = await clientService.getAll('', config)
      console.log(data)
      if (data.length > 0){
        this.StatusData = true
        if (this.perPage !== pagination.perPage){
          this.perPage = pagination.itemsPerPage
        }
        this.totalRows = pagination.totalItems
      } else {
        this.StatusData = false
      }

      this.loading = false
      this.isShow = false
      return data
    },
    add () {
      this.$router.push({ name: 'client.add' })
    },
    exportarClientes (){
      window.open("https://api.principeazul.phoenixtechsa.com/exportar-clientes")
    },
    edit (item) {
      this.$router.push({ name: 'client.edit', params: { id: item.id } })
    },
    submit (item) {
      // item.editable = false
    },
    remove (item) {
      this.$bvModal.msgBoxConfirm('Esta seguro que desea eliminar el registro?.', {
        title: 'Por favor confirme',
        okVariant: 'danger',
        okTitle: 'Si',
        cancelTitle: 'No',
        footerClass: 'p-2',
        hideHeaderClose: false,
        centered: true
      })
        .then(value => {
          if (value) {
            this.loading = true
            clientService.delete(item.id)
              .then(res => {
                this.isShow = true
                this.$refs.table.refresh()
              })
              .catch((error) => { console.error(error) })
              .finally(() => {
                this.loading = false
                // this.loadData()
              })
          }
        })
        .catch((error) => { console.error(error) })
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      // this.totalRows = filteredItems.length
      this.currentPage = 1
    }
  },
  computed: {
  }
}
</script>

<style scoped>
 #alert{
   position: inherit;
 }
</style>
