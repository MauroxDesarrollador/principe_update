<template>
  <b-container fluid>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col lg="12">
            <iq-card>
              <template v-slot:body>
                <div class="new-user-info">
                  <b-row>
                    <div class="text-center spinner" v-show="loading">
                      <b-spinner variant="primary" type="grow" label="Spinning" style="width: 3rem; height: 3rem;"></b-spinner>
                    </div>
                  </b-row>
                  <b-row>
                    <b-form-group class="col-md-6" label="Nombre:" label-for="name">
                      <ValidationProvider name="Nombre" rules="required" v-slot="{ errors }">
                        <b-form-input
                          v-model="client.name"
                          type="text"
                          placeholder="Nombre"
                          :class="(errors.length > 0 ? ' is-invalid' : '')">
                        </b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <!-- <b-form-group class="col-md-6" label="Cédula / RUC:" label-for="cedula">
                        <b-form-input
                          v-model="client.dni"
                          type="text"
                          placeholder="Cédula">
                        </b-form-input>
                    </b-form-group> -->
                    <b-form-group class="col-md-6" label="Teléfono:" label-for="phone">
                        <b-form-input
                          v-model="client.phone"
                          type="tel"
                          name="phone"
                          id="phone"
                          placeholder="Teléfono"
                          v-mask="['###-####', '####-####']">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Email" label-for="email">
                        <b-form-input
                          v-model="client.email"
                          type="text"
                          name="email"
                          id="email"
                          placeholder="Email">
                        </b-form-input>
                    </b-form-group>
                    <!-- <b-form-group class="col-md-12" label="Dirección" label-for="address">
                        <b-form-textarea
                          rows="3"
                          max-rows="6"
                          v-model="client.address"
                          type="text"
                          name="address"
                          id="address"
                          placeholder="Dirección">
                        </b-form-textarea>
                    </b-form-group> -->
                  </b-row>
                  <hr />
                  <b-button variant="primary" type="submit">{{btnTitle}}</b-button>
                </div>
              </template>
            </iq-card>
          </b-col>
        </b-row>
      </form>
    </ValidationObserver>
   
  </b-container>
</template>
<script>

import { vito } from '../../config/pluginInit'
import clientService from '@/services/client'
import { mask } from 'vue-the-mask'

export default {
  name: 'Client',
  directives: { mask },
  title: '',
  btnTitle: '',
  props: {
    isModal: { type: Boolean, default: false }
  },
  mounted () {
    vito.index()
  },
  created () {
    if (this.getStatus() === 'add') {
      this.btnTitle = 'Nuevo cliente'
    }
    if (this.getStatus() === 'edit') {
      this.loading = true
      this.btnTitle = 'Guardar cambios'
      clientService.getById(this.$route.params.id)
        .then(response => {
          this.client = response.data
        })
        .catch((error) => {
          console.error(error)
        })
        .finally(() => { this.loading = false })
    }
  },
  data () {
    return {
      client: {
        name: '',
        last_name: 'Default',
        dni: '',
        phone: '',
        email: '',
        address: ''
      },
      loading: false,
      clients: []
    }
  },
  computed: {
    fullName: function () {
      return this.user.name
    }
  },
  methods: {
    getStatus () {
      const id = this.$route.params.id
      if (id) return 'edit'
      if (!id) return 'add'
    },
    onSubmit () {
      this.loading = true
      if (this.getStatus() === 'add') {
        clientService.create(this.client)
          .then(response => {
            if (response.status) {
              if (this.isModal) {
                this.$emit('new-client', response.data)
              } else {
                this.$router.push({ name: 'client.list' })
              }
            }
          })
          .catch((error) => { console.error(error) })
          .finally(() => { this.loading = false })
      }
      if (this.getStatus() === 'edit') {
        clientService.update(this.$route.params.id, this.client)
          .then(response => {
            if (response.status) {
              this.$router.push({ name: 'client.list' })
            }
          })
          .catch((error) => { console.error(error) })
          .finally(() => { this.loading = false })
      }
    },
    previewImage: function (event) {
      const input = event.target

      if (input.files && input.files[0]) {
        const reader = new FileReader()

        reader.onload = (e) => {
          this.user.profile_image = e.target.result
        }

        reader.readAsDataURL(input.files[0])
      }
    }
  }
}
</script>
