<template>
  <el-container class="app">
    <el-header class="app-header">
      <el-dropdown trigger="click">
        <i class="el-icon-menu"></i>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="$router.push('/')">
            Projects
          </el-dropdown-item>
          <el-dropdown-item
            v-for="(project, i) in projects"
            :key="project.id"
            :divided="i === 0"
            >
            <router-link tag="div"
              class="text-truncate project-router-link"
              :to="{name: 'project', params: {projectId: project.id}}">
              {{ project.name }}
              <span class="el-icon-arrow-right arrow-icon">
              </span>
            </router-link>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="current-project">
        <edit-input v-if="currentProject"
          show-delete
          @change="updateProjectName"
          @delete="deleteProject"
          :value="currentProject.name">
        </edit-input>
        <template>
          {{ $route.meta.title }}
        </template>
      </span>
    </el-header>
    <el-main class="app-main">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import EditInput from '@/components/EditInput'

export default {
  components: {
    EditInput
  },
  computed: {
    ...mapGetters(['projects']),
    currentProject () {
      const { projectId } = this.$route.params
      return this.$store.state.projects[projectId]
    }
  },
  methods: {
    updateProjectName (name) {
      if (!this.currentProject) {
        return
      }
      return this.$store.dispatch('updateProject', {
        id: this.currentProject.id,
        name
      })
    },
    deleteProject () {
      if (!this.currentProject) {
        return
      }
      this.$router.push('/')
      return this.$store.dispatch('deleteProject',
        this.currentProject.id)
    }
  }
}
</script>

<style lang="scss" scoped>
.app-header {
  display: flex;
  align-items: center;
  box-shadow: 0 -2px 5px 0 rgba(0, 0, 0, 0.5);
}

.app-main {
  overflow: auto;
}

.el-icon-menu {
  cursor: pointer;
}

.project-router-link {
  width: 100px;
  position: relative;

  .arrow-icon {
    display: none;
    position: absolute;
    right: 0px;
    top: 11px;
  }

  &:hover .arrow-icon {
    display: inline-block;
  }
}

.current-project {
  margin-left: 1em;
}
</style>
