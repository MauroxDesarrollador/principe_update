<template>
  <b-container fluid>
    <ValidationObserver v-slot="{ handleSubmit }">
      <form @submit.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col md="12">
            <iq-card>
              <template v-slot:body>
                <div class="new-user-info">
                  <b-col md="12" class="text-center spinner" v-if="loading">
                    <b-spinner variant="primary" type="grow" label="Spinning"></b-spinner>
                  </b-col>
                  <b-row>
                    <b-form-group class="col-md-6" label="Nombre:" label-for="name">
                      <ValidationProvider name="Nombre" rules="required" v-slot="{ errors }">
                        <b-form-input
                          v-model="user.name"
                          type="text"
                          placeholder="Nombre del usuario"
                          :class="(errors.length > 0 ? ' is-invalid' : '')"
                        ></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Teléfono:" label-for="phone">
                      <ValidationProvider name="Teléfono" rules="required" v-slot="{ errors }">
                        <b-form-input
                          v-model="user.phone"
                          type="tel"
                          name="phone"
                          id="phone"
                          placeholder="Teléfono"
                          v-mask="['###-####', '####-####']"
                          :class="(errors.length > 0 ? ' is-invalid' : '')">
                        </b-form-input>
                         <div class="invalid-feedback">
                            <span>{{ errors[0] }}</span>
                          </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Email" label-for="email">
                      <ValidationProvider name="Email" rules="required" v-slot="{ errors }">
                        <b-form-input
                          v-model="user.email"
                          type="text"
                          name="email"
                          id="email"
                          placeholder="Correo electrónico"
                          :class="(errors.length > 0 ? ' is-invalid' : '')">
                        </b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Role:" label-for="role">
                      <ValidationProvider name="Rol" rules="required" v-slot="{ errors }">
                        <b-form-select
                          v-model="user.role"
                          :state="errors[0] ? false : (user.role ? true : null)"
                          :options="roles"
                        ></b-form-select>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Contraseña:" label-for="role">
                      <ValidationProvider name="Contraseña" rules="required|min:8" v-slot="{ errors }">
                        <b-form-input
                          v-model="user.password"
                          type="text"
                          placeholder="Contraseña"
                          :class="(errors.length > 0 ? ' is-invalid' : '')"
                        ></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                  </b-row>
                  <hr />
                  <b-button variant="primary" type="submit">{{status === 'add' ? 'Crear usuario' : 'Actualizar usuario'}}</b-button>
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
import { mask } from 'vue-the-mask'
import userService from '@/services/user'

export default {
  name: 'User',
  directives: { mask },
  created () {
    const id = this.$route.params.id
    if (id) this.status = 'edit'
    if (this.status === 'edit') {
      this.loading = true
      userService.getById(id)
        .then(response => {
          this.user = response.data
        })
        .catch(error => { console.error(error) })
        .finally(() => { this.loading = false })
    }
  },
  mounted () {
    vito.index()
  },
  data () {
    return {
      loading: false,
      status: 'add',
      btnTitle: 'Agregar',
      selectedRole: null,
      user: {
        name: '',
        phone: '',
        email: '',
        role: null,
        password: ''
      },
      roles: [
        { value: null, text: 'Seleccione un rol' },
        { value: 'admin', text: 'Admin' },
        { value: 'ventas', text: 'Ventas' },
        { value: 'taller', text: 'Taller' },
        { value: 'design', text: 'Diseño' }
      ]
    }
  },
  methods: {
    onSubmit () {
      this.loading = true
      if (this.status === 'add') {
        userService.create(this.user)
          .then(response => {
            this.$router.push({ name: 'user.list' })
          })
          .catch(error => { console.error(error) })
          .finally(() => { this.loading = false })
      }

      if (this.status === 'edit') {
        userService.update(this.$route.params.id, this.user)
          .then(response => {
            if (response.status) { this.$router.push({ name: 'user.list' }) }
          })
          .catch(error => { console.error(error) })
          .finally(() => { this.loading = false })
      }
    }
  }
}
</script>

<style>
</style>
