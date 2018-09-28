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
          <el-dropdown-item divided >
            <el-popover
              popper-class="sync-menu-popover"
              trigger="hover"
              v-model="bShowSyncMenu"
              placement="right-start">
              <div @click.stop="''" slot="reference">
                Sync
              </div>
              <div @click.stop="bShowSyncMenu = false">
                <el-dropdown-item @click.native="onSync"
                  :disabled="!syncInfo.syncKey || !syncInfo.syncId">
                  Sync Now
                </el-dropdown-item>
                <el-dropdown-item @click.native="bShowEditSyncSetting = true">
                  Sync Setting
                </el-dropdown-item>
                <el-dropdown-item @click.native="onSyncExport" divided>
                  Export
                </el-dropdown-item>
                <el-dropdown-item @click.native="$refs.syncImportFile.click()">
                  Import
                </el-dropdown-item>
                <input ref="syncImportFile"
                  style="display: none"
                  @change="onSyncImport"
                  type="file"
                  accept=".json" >
              </div>
            </el-popover>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <span class="current-project">
        <edit-input v-if="currentProject"
          @change="updateProjectName"
          :value="currentProject.name">
        </edit-input>
        <template>
          {{ $route.meta.title }}
        </template>
      </span>
      <span class="el-icon-loading" v-if="headerLoading">
      </span>
      <el-button
        v-if="syncInfo.syncKey && syncInfo.syncId"
        @click="onSync"
        :loading="headerLoading"
        type="text"
        style="margin-left: auto"
        icon="el-icon-refresh"></el-button>
    </el-header>
    <el-main class="app-main" style="padding: 10px;">
      <router-view></router-view>
    </el-main>
    <el-dialog
      :visible="bShowEditSyncSetting"
      title="Sync Settting"
      width="400px"
      @close="bShowEditSyncSetting = false"
      >
      <el-form size="small">
        <el-form-item label="gist key: ">
          <el-input style="width: 200px" v-model="syncInfoForm.syncKey"></el-input>
          <el-button size="mini" type="info" style="margin-left: 1em"
            :loading="testLoading"
            @click="testSyncKey(syncInfoForm)"
            :disabled="!syncInfoForm.syncKey || !syncInfoForm.syncId">test</el-button>
        </el-form-item>
        <el-form-item label="gist id:">
          <el-input style="width: 200px" v-model="syncInfoForm.syncId"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="bShowEditSyncSetting = false" size="small" type="default">Cancel</el-button>
        <el-button @click="updateSyncInfo(syncInfoForm); bShowEditSyncSetting = false" size="small" type="primary">Confirm</el-button>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import { mapGetters, mapState, mapActions } from 'vuex'
import EditInput from '@/components/EditInput'
import { readFile } from '@/utils'

export default {
  components: {
    EditInput
  },
  data () {
    return {
      bShowSyncMenu: false,
      bShowEditSyncSetting: false,
      syncInfoForm: {},
      testLoading: false,
      headerLoading: false
    }
  },
  computed: {
    ...mapGetters(['projects']),
    ...mapState(['syncInfo']),
    currentProject () {
      const { projectId } = this.$route.params
      return this.$store.state.projects[projectId]
    }
  },
  watch: {
    bShowEditSyncSetting (val) {
      val && (this.syncInfoForm = Object.assign({}, this.syncInfo))
    },
    syncInfo (val) {
      this.syncInfoForm = Object.assign({}, val)
    }
  },
  methods: {
    ...mapActions(['updateSyncInfo', 'syncExport', 'syncImport', 'sync']),
    updateProjectName (name) {
      if (!this.currentProject) {
        return
      }
      return this.$store.dispatch('updateProject', {
        id: this.currentProject.id,
        name
      })
    },
    testSyncKey (syncInfo) {
      this.testLoading = true
      this.$store.dispatch('testSyncKey', syncInfo)
        .then(
          () => this.$message.success('This key is valid'),
          (err) => this.$message.error('This key is unvalid: ' + err.message)
        )
        .finally(() => this.testLoading = false)
    },
    async onSync () {
      this.headerLoading = true
      return this.sync()
        .finally(() => this.headerLoading = false)
    },
    async onSyncExport () {
      const projects = await this.syncExport()
      const a = document.createElement('a')
      const json = JSON.stringify(projects, null, 2)
      const blob = new Blob([json], { type: 'octet/stream' })
      const url = window.URL.createObjectURL(blob)
      a.href = url
      a.download = 'export.json'
      a.click()
      window.URL.revokeObjectURL(url)
    },
    onSyncImport (e) {
      const file = e.target.files[0]
      if (!file) {
        return Promise.resolve()
      }
      this.headerLoading = true
      return readFile(file)
        .then(json => JSON.parse(json))
        .then(projects => this.syncImport(projects))
        .finally(() => this.headerLoading = false)
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
  height: 100%;
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

.el-icon-loading {
  font-size: 18px;
  margin-left: 10px;
}
</style>

<style lang="scss">
.sync-menu-popover {
  padding: 10px 0 !important;
}
</style>
