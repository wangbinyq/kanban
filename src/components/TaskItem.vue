<template>
  <div class="task-item-wrapper">
    <div v-if="!edit"
      key="editable"
      @click="onItemClick"
      class="task-item markdown-body"
      v-html="renderedContent">
    </div>
    <div v-clickoutside="() => edit = false"
      @click.stop="''"
      key="edutcontent"
      v-else
      class="task-item editable task-item-prevent-drag">
      <el-input
        type="textarea"
        v-autofocus
        @blur="onUpdateTask"
        autosize
        v-model="content">
      </el-input>
    </div>
    <delete-icon v-if="!edit" @delete="onDeleteTask"></delete-icon>
  </div>
</template>

<script>
import DeleteIcon from './DeleteIcon'
import showdown from '@/showdown'

const mdConverter = new showdown.Converter({
  tasklists: true,
  tables: true
})
mdConverter.setFlavor('github')

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
  computed: {
    renderedContent () {
      return mdConverter.makeHtml(this.task.content)
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
    },
    onUpdateTask () {
      this.$store.dispatch('updateTask', {
        ...this.task,
        content: this.content
      })
    },
    onItemClick (e) {
      if (e.target.tagName !== 'INPUT') {
        return this.edit = true
      }
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
  min-height: 36px;

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
