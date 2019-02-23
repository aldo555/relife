<template>
  <div class="flex text-grey shadow-lg">
    <div @click="$router.push({name: 'Profile'})" :class="{'text-white': profileIcon === 'person'}" class="w-1/3 bg-indigo-darkest hover:text-white py-3 text-xl subpixel-antialiased">
      <eva-icon :name="profileIcon" class="fill-current"></eva-icon>
      <br />
      Profile
    </div> 
    <div @click="$router.push({name: 'Start'})" :class="{'text-white': startIcon === 'play-circle'}" class="w-1/3 bg-indigo-darkest hover:text-white py-3 text-xl subpixel-antialiased">
      <eva-icon :name="startIcon" class="fill-current"></eva-icon>
      <br />
      Start
    </div>
    <div @click="$router.push({name: 'Settings'})" :class="{'text-white': settingsIcon === 'settings'}" class="w-1/3 bg-indigo-darkest hover:text-white py-3 text-xl subpixel-antialiased">
      <eva-icon :name="settingsIcon" class="fill-current"></eva-icon>
      <br />
      Settings
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  data() {
    return {
      profileIcon: 'person-outline',
      startIcon: 'play-circle-outline',
      settingsIcon: 'settings-outline',
    }
  },
  watch: {
    $route(to, from) {
      this.currentTab(this.$route.name)
    }
  },
  methods: {
    currentTab(tab) {
      switch (tab) {
        case 'Profile':
          this.profileIcon = 'person'
          this.startIcon = 'play-circle-outline'
          this.settingsIcon = 'settings-outline'
          break
        case 'Start':
          this.profileIcon = 'person-outline'
          this.startIcon = 'play-circle'
          this.settingsIcon = 'settings-outline'
          break
        case 'Settings':
          this.profileIcon = 'person-outline'
          this.startIcon = 'play-circle-outline'
          this.settingsIcon = 'settings'
          break
      }
    }
  },
}
</script>
