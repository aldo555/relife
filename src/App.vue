<template>
  <div id="app" class="flex flex-col min-h-screen">
    <router-view class="flex-1"/>
    <navbar class="pin-b"></navbar>
  </div>
</template>

<script>
import Navbar from './components/Navbar'
import gql from 'graphql-tag'

export default {
  components: {
    Navbar
  },
  data () {
    return {
      user: 'haha'
    }
  },
  apollo: {
    // Simple query that will update the 'hello' vue property
    user: gql`query {
      user(id: 1) {
        name
      }
    }`
  }
}
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
