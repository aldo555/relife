<template>
  <div id="app" class="flex flex-col min-h-screen">
    <router-view class="flex-1"/>
    <navbar class="pin-b"></navbar>
  </div>
</template>

<script>
  import Navbar from './components/Navbar'

  export default {
    components: {
      Navbar
    },
    mounted() {
      this.eva.replace()
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
