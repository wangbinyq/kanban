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
      name="Project"
      class="add-project-item"
      @create="onCreateProject"
      >
    </add-project-item>
  </div>
</template>

<script>
import ProjectItem from '@/components/ProjectItem'
import AddProjectItem from '@/components/AddItem'

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

.add-project-item {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ddd;
  color: #444;
  font-size: 16px;
  font-weight: bold;
  padding: 10px;
  margin: 5px;
  width: 240px;
  height: 120px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.1s;

  &:hover {
    background: #ccc;
  }
}
</style>
