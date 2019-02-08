<template>
  <div class="flex text-white">
    <div class="w-1/3 bg-green-darker hover:bg-green-darkest py-3 text-xl subpixel-antialiased">
      <eva-icon name="person-outline" fill="white"></eva-icon>
      <br />
      Profile
    </div>
    <div class="w-1/3 bg-green-darker hover:bg-green-darkest py-3 text-xl subpixel-antialiased">
      <eva-icon name="refresh-outline" fill="white"></eva-icon>
      <br />
      Start
    </div>
    <div class="w-1/3 bg-green-darker hover:bg-green-darkest py-3 text-xl subpixel-antialiased">
      <eva-icon name="settings-outline" fill="white"></eva-icon>
      <br />
      Settings
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Navbar',
  }
</script>
