<template>
  <div class="project-item">
    <div class="project-name">
      {{ project.name }}
    </div>
    <div class="column-preview">
      <div
        v-for="taskList in taskLists"
        :key="taskList.id"
        :style="{height: `${taskListHeight(taskList)}%`}"
        class="column-preview-tasks"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    project: Object
  },
  computed: {
    taskLists () {
      return this.$store.getters.taskLists(this.project.id)
    }
  },
  methods: {
    taskListHeight (taskList) {
      const taskNum = this.$store.getters.tasks(taskList.id).length
      return Math.min(100, (taskNum + 1) * 18)
    }
  }
}
</script>

<style lang="scss" scoped>
.project-item {
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin: 5px;
  font-size: 16px;
  font-weight: bold;
  color: #ececec;
  background: #8cc5ff;
  width: 240px;
  height: 120px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.1s;
  overflow-wrap: break-word;

  &:hover {
    background: #75b6f7;
  }
}

.project-name {
  padding-bottom: 5px;
}

.column-preview {
  display: flex;
  align-items: flex-start;
  height: 100%;
}

.column-preview-tasks {
  width: 24px;
  background-color: rgba(255, 255, 255, 0.25);
  margin-right: 6px;
  border-radius: 3px;
}
</style>
