<template>
  <div>
  <h1 class="text-5xl">Login</h1>
    <div class="flex justify-center">
        <div class="w-full max-w-xs py-5">
            <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4" method="POST" @submit.prevent="login">
                <div class="mb-4">
                <label class="block text-grey-darker text-sm font-bold mb-2" for="email">
                    Email
                </label>
                <input v-model="username" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker leading-tight focus:outline-none focus:shadow-outline" id="email" type="email" placeholder="Email">
                </div>
                <div class="mb-6">
                <label class="block text-grey-darker text-sm font-bold mb-2" for="password">
                    Password
                </label>
                <input v-model="password" class="shadow appearance-none border rounded w-full py-2 px-3 text-grey-darker mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************">
                </div>
                <div class="flex items-center justify-between">
                <button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">
                    Sign In
                </button>
                <a class="inline-block align-baseline font-bold text-sm text-blue hover:text-blue-darker" href="#">
                    Forgot Password?
                </a>
                </div>
            </form>
            <p class="text-center text-grey text-xs">
                ©2019 DJ BobyX
            </p>
        </div>
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { onLogin } from '../../vue-apollo.js'

export default {
  name: 'Login',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    login() {
      this.$apollo.mutate({
        // Query
        mutation: gql`mutation($data: LoginInput!) {
          login(data: $data) {
            access_token
          }
        }`,
        // Parameters
        variables: {
          data: {
            username: this.username,
            password: this.password
          }
        }
      }).then((data) => {
        // Result
        onLogin(this.$apollo.provider.defaultClient, data.data.login.access_token)
        this.$router.push({name: 'Profile'})
      }).catch((error) => {
        // Error
        console.error(error)
      })
    }
  }
}
</script>
