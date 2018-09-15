<template>
  <div v-if="taskList" class="task-list">
    <div class="list-header task-list-draggable">
      <edit-input
        :value="taskList.name"
        @change="name => onUpdateTaskList({ name })">
      </edit-input>
      <delete-icon @delete="onDeleteTaskList"></delete-icon>
    </div>
    <div ref="elTaskList" class="tasks-wrapper">
      <container
        @drop="onMoveTask"
        :get-child-payload="idx => this.tasks[idx]"
        group-name="tasks">
        <draggable
          v-for="task in tasks"
          :key="task.id"
          >
          <task-item
            :task="task"
            >
          </task-item>
        </draggable>
      </container>
    </div>
    <add-task-item
      name="Task"
      input-type="textarea"
      @create="onCreateTask"
      class="add-task">
    </add-task-item>
  </div>
  <div v-else class="task-list add-task-list">
    <add-task-item
      name="TaskList"
      @create="name => $emit('create-task-list', name)"
      class="add-task">
    </add-task-item>
  </div>
</template>

<script>
import EditInput from './EditInput'
import TaskItem from './TaskItem'
import AddTaskItem from './AddItem'
import DeleteIcon from './DeleteIcon'
import { Container, Draggable } from 'vue-smooth-dnd'

export default {
  components: {
    EditInput,
    TaskItem,
    AddTaskItem,
    DeleteIcon,
    Container,
    Draggable
  },
  props: {
    taskList: Object
  },
  computed: {
    tasks () {
      const taskListId = this.taskList.id
      return this.$store.getters.tasks(taskListId)
        .sort((t1, t2) => t1.sort - t2.sort)
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
      const sort = ((this.tasks[this.tasks.length - 1] ||
        { sort: 0 }).sort + 100) || 100
      return this.$store.dispatch('createTask', {
        content,
        taskListId,
        sort
      })
        .then(() => this.$nextTick(
          () => this.$refs.elTaskList.scrollTo(0, this.$refs.elTaskList.scrollHeight))
        )
    },
    onDeleteTaskList () {
      return this.$store.dispatch('deleteTaskList', this.taskList.id)
    },
    onMoveTask ({ removedIndex, addedIndex, payload }) {
      if (removedIndex === null && addedIndex === null) {
        return
      }
      const movedTask = this.tasks[removedIndex]
      const targetTask = this.tasks[addedIndex]
      if (removedIndex !== null && addedIndex !== null) {
        if (!movedTask || !targetTask) {
          return
        }
        const pushAfter = addedIndex > removedIndex ? 1 : -1
        const midTask = this.tasks[addedIndex + pushAfter]
        let newSortVal

        if (midTask) {
          newSortVal = (midTask.sort + targetTask.sort) / 2
        } else {
          newSortVal = targetTask.sort + pushAfter * 100
        }
        return this.$store.dispatch('updateTask', {
          id: movedTask.id,
          sort: newSortVal
        })
      }
      if (removedIndex !== null && payload) {
        return this.$store.dispatch('deleteTask', payload.id)
      }
      if (addedIndex !== null && payload) {
        let sort
        if (!targetTask) {
          sort = ((this.tasks[this.tasks.length - 1] ||
          { sort: 0 }).sort + 100) || 100
        } else {
          const midTask = this.tasks[addedIndex - 1]
          if (midTask) {
            sort = (midTask.sort + targetTask.sort) / 2
          } else {
            sort = targetTask.sort - 100
          }
        }

        /* eslint-disable */
        const { id, ...task } = payload
        /* eslint-enable */
        return this.$store.dispatch('createTask', {
          ...task,
          taskListId: this.taskList.id,
          sort
        })
      }
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
  flex: 0 0 300px;
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
  position: relative;
  display: flex;
  align-content: center;
  padding: 5px;

  & >>> .edit-input {
    padding: 10px;
    width: calc(100% - 30px);
    overflow-wrap: break-word;
  }

  /deep/ .el-icon-close {
    display: none;
  }

  &:hover {
    /deep/ .el-icon-close {
      display: block;
    }
  }
}

.tasks-wrapper {
  height: 100%;
  overflow-y: auto;

  /deep/ .smooth-dnd-draggable-wrapper {
    margin: 8px 5px 0;

    &:first-child {
      margin-top: 0;
    }
  }
}

.add-task {
  cursor: pointer;
  padding: 14px 15px;
}
</style>
