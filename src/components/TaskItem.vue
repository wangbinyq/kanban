<template>
  <div class="task-item-wrapper">
    <div v-if="!edit"
      key="editable"
      @click="edit = true"
      class="task-item markdown-body"
      v-marked="task.content">
    </div>
    <div v-clickoutside="() => edit = false"
      key="edutcontent"
      v-else
      class="task-item editable">
      <el-input
        type="textarea"
        v-autofocus
        autosize
        v-model="content">
      </el-input>
    </div>
    <delete-icon v-if="!edit" @delete="onDeleteTask"></delete-icon>
  </div>
</template>

<script>
import DeleteIcon from './DeleteIcon'

export default {
  components: {
    DeleteIcon
  },
  props: {
    task: Object
  },
  data () {
    return {
      edit: false,
      content: this.task.content
    }
  },
  watch: {
    'task.content' (val) {
      this.content = val
    }
  },
  methods: {
    onDeleteTask () {
      this.$store.dispatch('deleteTask', this.task.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.task-item-wrapper {
  position: relative;
  border-radius: 5px;
  padding: 6px 8px;
  background: white;
  margin: 8px 5px 0;

  &:first-child {
    margin-top: 0;
  }

  &.markdown-body {
    cursor: pointer;
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
</style>
