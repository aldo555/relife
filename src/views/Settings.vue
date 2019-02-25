<template>
  <div class="p-5">
      <h1 class="text-5xl mb-5">Settings</h1>

      <button @click="logout" class="bg-white hover:bg-grey-lightest mt-10 text-grey-darkest font-semibold py-2 px-4 border border-grey-light rounded shadow">
        Logout
      </button>
  </div>
</template>

<script>
import { onLogout } from '../vue-apollo.js'

export default {
  name: 'Settings',
  methods: {
    logout () {
      onLogout(this.$apollo.provider.defaultClient)
      this.$router.push({ name: 'Login' })
    }
  }
}
</script>
