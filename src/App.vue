<template>
  <div id="app">
    <button class="bg-blue hover:bg-blue-dark text-white font-bold py-2 px-4 rounded-full">
      Button
    </button>
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
