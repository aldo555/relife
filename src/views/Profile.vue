<template>
  <div>
    <h1 class="text-2xl py-5">Hello, {{ me.name }}!</h1>
    <button @click="logout" class="bg-white hover:bg-grey-lightest text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
      Logout
    </button>
  </div>
</template>

<script>
import { onLogout } from '../vue-apollo.js'
import gql from 'graphql-tag'

export default {
  name: 'Profile',
  data() {
    return {
      me: null
    }
  },
  methods: {
    logout() {
      onLogout(this.$apollo.provider.defaultClient)
      this.$router.push({name: 'Login'})
    }
  },
  apollo: {
    me: gql`query {
      me {
        id 
        name
        email
      }
    }
    `
  }
}
</script>
