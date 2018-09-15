<template>
  <container
    ref="container"
    @mousemove.native="onDragScrollMove"
    @mouseup.native="onDragScrollEnd"
    class="project "
    orientation="horizontal"
    drag-handle-selector=".task-list-draggable"
    @drop="onMoveTaskList">
    <draggable
        @mousedown.native.self="onDragScrollStart"
        v-for="tasklist in taskLists"
        :key="tasklist.id">
      <task-list
        :task-list="tasklist"
        >
      </task-list>
    </draggable>
    <task-list
      key="add-task"
      @create-task-list="onCreateTaskList"
      :task-list="null">
    </task-list>
  </container>
</template>

<script>
import TaskList from '@/components/TaskList'
import { Container, Draggable } from 'vue-smooth-dnd'

export default {
  components: {
    TaskList,
    Container,
    Draggable
  },
  computed: {
    project () {
      const projectId = this.$route.params.projectId
      return this.$store.state.projects[projectId]
    },
    taskLists () {
      return this.$store.getters.taskLists(this.project.id)
        .sort((tl1, tl2) => tl1.sort - tl2.sort)
    }
  },
  methods: {
    onCreateTaskList (name) {
      if (!name) {
        return
      }
      const sort = ((this.taskLists[this.taskLists.length - 1] ||
        { sort: 0 }).sort + 100) || 100
      return this.$store.dispatch('createTaskList', {
        projectId: this.project.id,
        name,
        sort
      })
        .then(() => this.$nextTick(
          () => this.$el.scrollTo(this.$el.scrollWidth, 0)
        ))
    },
    onMoveTaskList ({ removedIndex, addedIndex }) {
      if (removedIndex === addedIndex) return
      const movedTaskList = this.taskLists[removedIndex]
      const targetTaskList = this.taskLists[addedIndex]
      const pushAfter = addedIndex > removedIndex ? 1 : -1
      const midTaskList = this.taskLists[addedIndex + pushAfter]
      if (!movedTaskList || !targetTaskList) return
      const targetSortVal = targetTaskList.sort

      let newSortVal
      if (midTaskList) {
        newSortVal = (midTaskList.sort + targetSortVal) / 2
      } else {
        newSortVal = targetSortVal + pushAfter * 100
      }

      return this.$store.dispatch('updateTaskList', {
        id: movedTaskList.id,
        sort: newSortVal
      })
    },
    onDragScrollStart (e) {
      this.bDragScroll = true
    },
    onDragScrollMove (e) {
      if (!this.bDragScroll) {
        return
      }
      const container = this.$refs.container.$el
      container.scrollLeft -= e.movementX
    },
    onDragScrollEnd (e) {
      this.bDragScroll = false
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
