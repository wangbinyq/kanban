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
        @blur="onUpdateTask(content)"
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
    onUpdateTask (content) {
      this.$store.dispatch('updateTask', {
        ...this.task,
        content
      })
    },
    onItemClick (e) {
      if (e.target.tagName !== 'INPUT') {
        return this.edit = true
      }
      const subTaskText = e.target.nextSibling.data.trim()
      const idx = this.task.content.search(new RegExp(`[ x]]( )+${subTaskText}`, 'g'))
      if (idx > -1) {
        const target = this.task.content[idx] === ' ' ? 'x' : ' '
        const newContent = this.task.content.substr(0, idx) + target + this.task.content.substring(idx + 1)
        this.onUpdateTask(newContent)
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

    input[type="checkbox"] {
      cursor: pointer !important;
    }
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
