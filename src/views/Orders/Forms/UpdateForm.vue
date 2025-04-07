<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
      <div class="text-center" id="spinner" v-show="loading">
        <b-spinner
          variant="primary"
          type="grow"
          label="Spinning"
          style="width: 5rem; height: 5rem;"
        ></b-spinner>
      </div>
      <b-alert :show="isUpdated" variant=" " dismissible fade class="text-white bg-info">
        <div class="iq-alert-text">
          Datos actualizados con
          <b>éxito</b>!
        </div>
      </b-alert>
      <!-- Fecha de entrega -->
      <ValidationProvider vid="Fecha" name="Fecha de entrega" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="dateInput">Fecha de entrega</label>
          <b-form-datepicker
            id="example-datepicker"
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            v-model="order.delivery_date"
            class="mb-2"
          ></b-form-datepicker>
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <!-- Persona que recibe -->
      <ValidationProvider
        vid="Persona que recibe"
        name="Persona que recibe"
        rules="required"
        v-slot="{ errors }"
      >
        <div class="form-group">
          <label for="destinatarioInput">Persona que recibe</label>
          <input
            type="text"
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            id="destinatarioInput"
            v-model="order.addressee"
            placeholder="Persona que recibe"
            required
          />
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <!-- Phone number -->
      <div class="form-group">
        <label for="destinatarioInput">Teléfono</label>
        <input
          type="tel"
          class="form-control"
          id="destinatarioInput"
          v-model="order.phone"
          v-mask="['###-####', '####-####']"
          placeholder="000-000"
          required
        />
      </div>
      <!-- Dirección -->
      <ValidationProvider vid="address" name="Dirección" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="emailInput">Dirección exacta</label>
          <textarea
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            id="direccion"
            aria-describedby="direccion"
            v-model="order.delivery_address"
            placeholder="Dirección"
            rows="6"
            max-rows="10"
            required
          ></textarea>
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <!-- Dedicatoria -->
      <ValidationProvider vid="Dedicatoria" name="Dedicatoria" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="dedicationInput">Mensaje para la tarjeta dedicatoria XXX</label>
          <textarea
            :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
            id="dedicationInput"
            v-model="order.dedication"
            placeholder="Mensaje para la tarjeta dedicatoria"
            rows="6"
            max-rows="100"
            required
          ></textarea>
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <!-- <div class="form-group" v-show="order.personalizedRequired"> -->
      <div class="form-group">
        <div v-for="product in order.products" :key="product.id">
          <div v-if="product.product.personalized">
            <label for="dedicationInput">Texto Personalizado</label>
            <label v-if="order.products.length > 1">- {{product.name}}</label>
            <input
              type="text"
              class="form-control mb-0"
              id="dedicationInput"
              v-model="product.personalized_text"
              placeholder="Texto personalizado"
              maxlength="60"
            />
          </div>
        </div>
      </div>
      <div class="d-inline-block w-100">
        <button type="submit" class="btn btn-primary float-right" :disabled="disabled">Enviar</button>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import { mapGetters } from 'vuex'
import { mask } from 'vue-the-mask'
import orderService from '@/services/order'
import moment from 'moment'

export default {
  props: {
    order: { type: Object }
  },
  name: 'UpdateForm',
  directives: { mask },
  mounted () {
  },
  computed: {
    ...mapGetters({
      orders: 'Setting/ordersState'
    })
  },
  data () {
    return {
      loading: false,
      isUpdated: false,
      disabled: false
    }
  },
  methods: {
    onSubmit () {
      this.loading = true
      this.disabled = true
      this.order.delivery_date = `${this.order.delivery_date}`
      orderService.update(this.order.id, this.order)
        .then(response => {
          this.orderResponse = response.data
          this.isUpdated = true
        })
        .catch(error => { console.error(error) })
        .finally(() => {
          this.loading = false
          this.disabled = false
          window.scrollTo(0, 0)
          setTimeout(() => {
            this.isUpdated = false
          }, 3000)
        })
    }
  }
}
</script>

<style scoped>
#spinner {
  z-index: 1000;
  position: absolute;
  left: 40%;
}
textarea {
  height: 150px !important;
}
</style>
