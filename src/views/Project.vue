<template>
  <div class="project">
    <task-list
      v-for="tasklist in taskLists"
      :key="tasklist.id"
      :task-list="tasklist"
      >
    </task-list>
    <task-list
      key="add-task"
      @create-task-list="onCreateTaskList"
      :task-list="null">
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
  },
  methods: {
    onCreateTaskList (name) {
      if (!name) {
        return
      }
      return this.$store.dispatch('createTaskList', {
        projectId: this.project.id,
        name
      })
        .then(() => this.$nextTick(
          () => this.$el.scrollTo(this.$el.scrollWidth, 0)
        ))
    }
  }
}
</script>

<style lang="scss" scoped>
.project {
  height: 100%;
  width: 100%;
  overflow-x: auto;
  display: flex;
  align-items: flex-start;
}
</style>
