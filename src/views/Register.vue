<template>
  <div class="align" id="body">
    <div class="grid">
      <form
        @submit.prevent="handleRegister"
        class="form login"
        novalidate="true"
        autocomplete="off"
        id="Form"
      >
        <div class="form__field">
          <label for="username">
            <svg class="icon">
              <use xlink:href="#icon-user"></use>
            </svg>
            <span class="hidden">Username</span>
          </label>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            class="form-control"
            :class="{
              'is-valid': validation.valid.username,
              'is-invalid': validation.invalid.username,
            }"
            @focus="clearValidation('username')"
            v-model="username"
            required
          />
        </div>
        <span class="valid-feedback" v-if="validation.valid.username">
          {{ validation.valid.username }}
        </span>
        <span class="invalid-feedback" v-if="validation.invalid.username">
          {{ validation.invalid.username }}
        </span>

        <div class="form__field">
          <label for="password">
            <svg class="icon">
              <use xlink:href="#icon-lock"></use>
            </svg>
            <span class="hidden">Password</span>
          </label>
          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            class="form__input"
            :class="{
              'is-valid': validation.valid.password,
              'is-invalid': validation.invalid.password,
            }"
            @focus="clearValidation('password')"
            v-model="password"
            required
          />
        </div>
        <span class="valid-feedback" v-if="validation.valid.password">
          {{ validation.valid.password }}
        </span>
        <span class="invalid-feedback" v-if="validation.invalid.password">
          {{ validation.invalid.password }}
        </span>

        <div class="form__field">
          <input type="submit" value="Register" />
        </div>
      </form>

      <p class="text--center">
        Already a member?
        <a href="/login">Sign in now</a>
        <svg class="icon">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </p>
    </div>

    <svg xmlns="http://www.w3.org/2000/svg" class="icons">
      <symbol id="icon-arrow-right" viewBox="0 0 1792 1792">
        <path
          d="M1600 960q0 54-37 91l-651 651q-39 37-91 37-51 0-90-37l-75-75q-38-38-38-91t38-91l293-293H245q-52 0-84.5-37.5T128 1024V896q0-53 32.5-90.5T245 768h704L656 474q-38-36-38-90t38-90l75-75q38-38 90-38 53 0 91 38l651 651q37 35 37 90z"
        />
      </symbol>
      <symbol id="icon-lock" viewBox="0 0 1792 1792">
        <path
          d="M640 768h512V576q0-106-75-181t-181-75-181 75-75 181v192zm832 96v576q0 40-28 68t-68 28H416q-40 0-68-28t-28-68V864q0-40 28-68t68-28h32V576q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z"
        />
      </symbol>
      <symbol id="icon-user" viewBox="0 0 1792 1792">
        <path
          d="M1600 1405q0 120-73 189.5t-194 69.5H459q-121 0-194-69.5T192 1405q0-53 3.5-103.5t14-109T236 1084t43-97.5 62-81 85.5-53.5T538 832q9 0 42 21.5t74.5 48 108 48T896 971t133.5-21.5 108-48 74.5-48 42-21.5q61 0 111.5 20t85.5 53.5 62 81 43 97.5 26.5 108.5 14 109 3.5 103.5zm-320-893q0 159-112.5 271.5T896 896 624.5 783.5 512 512t112.5-271.5T896 128t271.5 112.5T1280 512z"
        />
      </symbol>
    </svg>
  </div>
</template>

<script>
import api from '../api'

export default {
  data() {
    return {
      username: '',
      password: '',
      validation: {
        invalid: {},
        valid: {},
      },
    }
  },
  methods: {
    clearValidation(field) {
      this.validation.valid[field] = ''
      this.validation.invalid[field] = ''
    },

    validate() {
      this.validation.invalid = {}
      this.validation.valid = {}

      if (!this.username) {
        this.validation.invalid.username = 'Please enter your username.'
      } else if (this.username.length < 2) {
        this.validation.invalid.username = 'Username should have min. 2 characters.'
      } else if (this.username.match(/[^a-z0-9-]/i)) {
        this.validation.invalid.username = 'Username should contain only latin letters (a-z).'
      } else {
        this.validation.valid.username = 'Username is ready.'
      }

      if (!this.password) {
        this.validation.invalid.password = 'Please enter password.'
      } else if (this.password.length < 8) {
        this.validation.invalid.password = 'Password should have min. 8 characters.'
      } else if (this.password.match(/[^a-z]/i)) {
        this.validation.invalid.password = 'Password should contain only latin letters (a-z).'
      } else {
        this.validation.valid.password = 'Password is strong.'
      }

      return Object.keys(this.validation.invalid).length === 0
    },

    async handleRegister() {
      if (!this.validate()) {
        return
      }

      try {
        const response = await api.post('/auth/register', {
          username: this.username,
          password: this.password,
        })

        console.log('Respuesta register:', response.data)

        const token = response.data.token
        if (!token) {
          alert('No se recibió token en la respuesta.')
          return
        }

        localStorage.setItem('token', token)
        window.dispatchEvent(new Event('storage'))
        alert('Usuario registrado y logueado correctamente! Token guardado.')

        this.username = ''
        this.password = ''
        this.validation = { invalid: {}, valid: {} }
      } catch (error) {
        console.error('Error en registro:', error)
        alert('Error en registro: ' + (error.response?.data || error.message))
      }
    },
  },
}
</script>
