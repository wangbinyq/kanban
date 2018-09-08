<template>
  <div v-loading="true" v-if="init" class="app"></div>
  <router-view v-else class="app"></router-view>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data () {
    return {
      init: false
    }
  },
  methods: {
    ...mapActions(['initApp'])
  },
  created () {
    this.init = true
    return this.initApp()
      .finally(() => this.init = false)
  }
}
</script>

<style lang="scss">
html, body {
  height: 100%;
  padding: 0;
  margin: 0;
}

.app {
  height: 100%;
}
</style>
