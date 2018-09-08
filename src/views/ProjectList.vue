<template>
  <div class="project-list">
    <router-link
      tag="div"
      class="project-item"
      v-for="project in projects"
      :key="project.id"
      :to="{name: 'project', params: {projectId: project.id}}">
      <project-item
        @delete="onDeleteProject(project)"
        :project="project">
      </project-item>
    </router-link>
    <add-project-item
      @create="onCreateProject"
      >
    </add-project-item>
  </div>
</template>

<script>
import ProjectItem from '@/components/ProjectItem'
import AddProjectItem from '@/components/AddProjectItem'

import { mapGetters } from 'vuex'
export default {
  components: {
    ProjectItem,
    AddProjectItem
  },
  computed: {
    ...mapGetters(['projects'])
  },
  methods: {
    onCreateProject (name) {
      if (!name) return
      return this.$store.dispatch('createProject', { name })
    },
    onDeleteProject (project) {
      return this.$store.dispatch('deleteProject', project.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.project-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
