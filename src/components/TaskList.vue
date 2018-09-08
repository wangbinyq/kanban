<template>
  <div class="task-list">
    <div class="list-header">
      <edit-input
        :value="taskList.name"
        @change="name => onUpdateTaskList({ name })">
      </edit-input>
    </div>
    <div class="tasks-wrapper">
      <task-item
        v-for="task in tasks"
        :key="task.id"
        :task="task"
        >
      </task-item>
    </div>
    <add-task-item
      name="Task"
      input-type="textarea"
      @create="onCreateTask"
      class="add-task">
    </add-task-item>
  </div>
</template>

<script>
import EditInput from './EditInput'
import TaskItem from './TaskItem'
import AddTaskItem from './AddItem'

export default {
  components: {
    EditInput,
    TaskItem,
    AddTaskItem
  },
  props: {
    taskList: Object
  },
  computed: {
    tasks () {
      const taskListId = this.taskList.id
      return this.$store.getters.tasks(taskListId)
    }
  },
  methods: {
    onUpdateTaskList (value) {
      return this.$store.dispatch('updateTaskList', {
        id: this.taskList.id,
        ...value
      })
    },
    onCreateTask (content) {
      const taskListId = this.taskList.id
      return this.$store.dispatch('createTask', { content, taskListId })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~element-ui/packages/theme-chalk/src/common/var";

.task-list-wrapper {
  height: 100%;
}

.task-list {
  width: 300px;
  min-height: 0;
  max-height: 100%;
  background: #eee;
  margin: 0 5px;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
}

.list-header {
  min-height: 50px;
  display: flex;
  align-content: center;
  padding: 5px;

  & >>> .edit-input {
    padding: 10px;
    width: calc(100% - 30px);
    overflow-wrap: break-word;
  }
}

.tasks-wrapper {
  height: 100%;
  overflow-y: auto;
}

.add-task {
  cursor: pointer;
  padding: 14px 15px;

  &:hover {
    color: $--color-text-regular;
  }
}
</style>
