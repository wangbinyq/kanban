<template>
  <div class="project">
    <task-list
      v-for="tasklist in taskLists"
      :key="tasklist.id"
      :task-list="tasklist"
      >
    </task-list>
  </div>
</template>

<script>
import TaskList from '@/components/TaskList'

export default {
  components: {
    TaskList
  },
  computed: {
    project () {
      const projectId = this.$route.params.projectId
      return this.$store.state.projects[projectId]
    },
    taskLists () {
      return this.$store.getters.taskLists(this.project.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.project {
  height: 100%;
  display: flex;
  align-items: flex-start;
}
</style>
