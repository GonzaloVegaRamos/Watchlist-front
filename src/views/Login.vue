<template>
  <div class="align" id="body">
    <div class="grid">
      <form
        @submit.prevent="handleLogin"
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
          <input type="submit" value="Sign In" />
        </div>
      </form>

      <p class="text--center">
        Not a member?
        <a href="/register">Sign up now</a>
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
import { emitter } from '@/eventBus'

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

    getUsernameFromToken(token) {
      try {
        const payloadBase64Url = token.split('.')[1]
        const payloadBase64 = payloadBase64Url.replace(/-/g, '+').replace(/_/g, '/')
        const payloadJson = atob(payloadBase64)
        const payload = JSON.parse(payloadJson)
        return payload.unique_name || payload.username || null
      } catch (e) {
        console.error('Error decoding token', e)
        return null
      }
    },

    async handleLogin() {
      try {
        const response = await api.post('/auth/login', {
          username: this.username,
          password: this.password,
        })
        const token = response.data.token

        localStorage.setItem('token', token)

        const username = this.getUsernameFromToken(token)
        emitter.emit('login', username)

        this.$router.push('/home')
      } catch (error) {
        alert('Error en login: ' + (error.response?.data || error.message))
      }
    },
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
.align {
  display: grid;
  place-items: center;
}

.grid {
  inline-size: 90%;
  margin-inline: auto;
  max-inline-size: 20rem;
}

.hidden {
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
}

.icons {
  display: none;
}

.icon {
  block-size: 1em;
  display: inline-block;
  fill: #606468;
  inline-size: 1em;
  vertical-align: middle;
}

* {
  box-sizing: inherit;
}

#body {
  background: linear-gradient(to right, #04619f, #000000);
  color: #979797;
  font-family: 'Open Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  min-block-size: 100vh;
}

a {
  color: #eee;
  outline: 0;
  text-decoration: none;
}

a:focus,
a:hover {
  text-decoration: underline;
}

input {
  background-image: none;
  border: 0;
  color: inherit;
  font: inherit;
  margin: 0;
  outline: 0;
  padding: 0;
  transition: 0.3s;
}

input[type='submit'] {
  cursor: pointer;
}

.form {
  display: grid;
  gap: 0.875rem;
}

.form input[type='password'],
.form input[type='text'],
.form input[type='submit'] {
  inline-size: 100%;
}

.form__field {
  display: flex;
}

.form__input {
  flex: 1;
}

.login {
  color: #eee;
}

.login label,
.login input[type='text'],
.login input[type='password'],
.login input[type='submit'] {
  border-radius: 0.25rem;
  padding: 1rem;
}

.login label {
  background-color: #a5a5a5;
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  padding-inline: 1.25rem;
}

.login input[type='password'],
.login input[type='text'] {
  background-color: #b4b4b4;
  color: black;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
}

.login input[type='password']:focus,
.login input[type='password']:hover,
.login input[type='text']:focus,
.login input[type='text']:hover {
  background-color: #ffffff;
}

.login input[type='submit'] {
  background-color: #48578a;
  color: rgb(255, 255, 255);
  font-weight: 700;
  text-transform: uppercase;
}

.login input[type='submit']:focus,
.login input[type='submit']:hover {
  background-color: #40458f;
}

p {
  margin-block: 1.5rem;
}

.text--center {
  text-align: center;
}

::placeholder {
  color: rgb(114, 114, 114);
}

.valid-feedback {
  color: rgb(0, 255, 0);
}

.invalid-feedback {
  color: red;
}
</style>
