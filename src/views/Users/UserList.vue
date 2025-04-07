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
            <b-col md="12" class="text-center spinner" v-show="isRemoving" id="removing">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-col md="12" class="text-center spinner" v-if="loading">
              <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
            </b-col>
            <b-row v-else align-h="between">
              <b-col md="4" class="my-1">
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
                      placeholder="Escriba para buscar">
                    </b-form-input>
                    <b-input-group-append>
                      <b-button :disabled="!filter" @click="filter = ''">Limpiar</b-button>
                    </b-input-group-append>
                  </b-input-group>
                </b-form-group>
              </b-col>
              <b-col md="2" class="my-1">
                <b-form-group>
                  <b-button variant="primary" @click="add">Nuevo usuario</b-button>
                </b-form-group>
              </b-col>
              <template v-if="users.length === 0">
                <b-col class="col-md-12">
                  <b-alert :show="true" variant="secondary">
                    <div class="iq-alert-text"><b>No hay registros para mostrar.</b> Por favor agrege un usuario para comenzar!</div>
                  </b-alert>
                </b-col>
              </template>
              <template v-else>
                <b-col md="12" class="table-responsive">
                  <b-table
                    striped
                    bordered
                    hover
                    :items="users"
                    :filter="filter"
                    :fields="titles"
                    :per-page="perPage"
                    :sort-by.sync="sortBy"
                    :sort-desc.sync="sortDesc"
                    :current-page="currentPage"
                    @filtered="onFiltered">
                    <template v-slot:cell(role)="users">
                      {{users.item.role | capitalize}}
                    </template>
                    <template v-slot:cell(action)="users">
                      <b-button
                        v-b-tooltip.top="'Editar'"
                        variant=" iq-bg-success mr-1 mb-1"
                        size="sm"
                        @click="edit(users.item)">
                        <i class="ri-ball-pen-fill m-0"></i>
                      </b-button>
                      <b-button
                        v-b-tooltip.top="'Eliminar'"
                        variant=" iq-bg-danger mr-1 mb-1"
                        size="sm"
                        @click="remove(users.item)">
                        <i class="ri-delete-bin-line m-0"></i>
                      </b-button>
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
                    class="mb-0">
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
                    aria-controls="my-table">
                  </b-pagination>
                </b-col>
              </template>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { vito } from '../../config/pluginInit'
import userService from '@/services/user'

export default {
  name: 'OrderList',
  created () {
    this.loadData()
  },
  mounted () {
    vito.index()
  },
  data () {
    return {
      users: [],
      sortBy: '',
      loading: true,
      filter: null,
      isShow: false,
      isRemoving: false,
      perPage: 15,
      selectedType: null,
      sortDesc: false,
      pageOptions: [5, 10, 15, 25, 50, 100, 200],
      totalRows: 1,
      currentPage: 1,
      titles: [
        { label: 'Id', key: 'id', class: 'text-center', sortable: true },
        { label: 'Nombre', key: 'name', class: 'text-center', sortable: true },
        { label: 'Email', key: 'email', class: 'text-center', sortable: true },
        { label: 'Teléfono', key: 'phone', class: 'text-center', sortable: true },
        { label: 'Rol', key: 'role', class: 'text-center', sortable: true },
        { label: 'Acción', key: 'action', class: 'text-center' }
      ]
    }
  },
  computed: {
    rows () {
      return this.users.length
    }
  },
  methods: {
    loadData () {
      userService.getAll()
        .then(response => {
          this.users = response.data
        })
        .catch(() => { })
        .finally(() => { this.loading = false })
    },
    onFiltered (filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length
      this.currentPage = 1
    },
    add () {
      this.$router.push({ name: 'user.add' })
    },
    edit (item) {
      this.$router.push({ name: 'user.edit', params: { id: item.id } })
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
            this.isRemoving = true
            userService.delete(item.id)
              .then(res => {
                this.isShow = true
              })
              .catch((error) => { console.error(error) })
              .finally(() => {
                this.isRemoving = false
                this.loadData()
              })
          }
        })
        .catch((error) => { console.error(error) })
    }
  }
}
</script>

<style>

</style>
