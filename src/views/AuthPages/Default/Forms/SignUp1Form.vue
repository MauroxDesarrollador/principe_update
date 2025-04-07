<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
      <ValidationProvider vid="name" name="Nombre completo" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="name">Nombre completo</label>
          <input type="text" v-model="user.name" :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
                 id="name" aria-describedby="emailHelp" placeholder="Su nombre completo">
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider vid="phone" name="Teléfono" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="phone">Nombre completo</label>
          <input v-mask="['###-####', '####-####']" type="tel" v-model="user.phone" :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
                 id="name" aria-describedby="emailHelp" placeholder="Teléfono">
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider vid="name" name="Email" rules="required|email" v-slot="{ errors }">
        <div class="form-group">
          <label for="email">Correo electrónico</label>
          <input type="email" v-model="user.email" :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
                 id="email" aria-describedby="emailHelp" placeholder="Correo electrónico">
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider vid="password" name="Password" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" v-model="user.password" :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
                 id="password" placeholder="Contraseña">
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <div class="d-inline-block w-100">
        <div class="custom-control custom-checkbox d-inline-block mt-2 pt-1">
          <input type="checkbox" class="custom-control-input" :id="formType">
          <label class="custom-control-label" :for="formType">I accept <a href="#">Términos y Condiciones</a></label>
        </div>
        <button type="submit" class="btn btn-primary float-right">Registrarse</button>
      </div>
      <div class="sign-info">
          <span class="dark-color d-inline-block line-height-2">
            Ya posee una cuenta?
              <router-link to="/dark/auth/sign-in1" class="iq-waves-effect pr-4" v-if="$route.meta.dark">
                Inicie sesión
              </router-link>
            <router-link to="/auth/sign-in1" class="iq-waves-effect pr-4" v-else>
                Inicie sesión
              </router-link>
          </span>
          <social-login-form></social-login-form>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import { mask } from 'vue-the-mask'

export default {
  name: 'SignUp1Form',
  directives: { mask },
  props: ['formType'],
  computed: {
    ...mapGetters({
      users: 'Setting/usersState'
    })
  },
  data: () => ({
    user: {
      email: '',
      password: ''
    }
  }),
  methods: {
    onSubmit () {
      this.jwtRegister()
    },
    jwtRegister () {
      this.$store.dispatch('Setting/addUserAction', this.user)
      this.$router.replace('/auth/sign-in1')
    }
  }
}
</script>
