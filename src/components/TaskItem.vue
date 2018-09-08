<template>
  <div class="task-item">
    {{ task.content }}
  </div>
</template>

<script>
export default {
  props: {
    task: Object
  }
}
</script>

<style lang="scss" scoped>

</style>
