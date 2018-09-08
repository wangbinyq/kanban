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

::-webkit-scrollbar {
    width: 14px;
    height: 14px
}

::-webkit-scrollbar-track {
    background-color: rgba(33,37,41,.05)
}

::-webkit-scrollbar-thumb,::-webkit-scrollbar-track {
    border: 4px solid transparent;
    background-clip: padding-box;
    border-radius: 8px
}

::-webkit-scrollbar-thumb {
    background-color: #adb5bd
}

::-webkit-scrollbar-button {
    display: none;
    width: 0;
    height: 0
}

::-webkit-scrollbar-corner {
    background-color: transparent
}
</style>
