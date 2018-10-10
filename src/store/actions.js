import db from '@/db'
import axios from 'axios'

const githubApi = axios.create({
  baseURL: 'https://api.github.com/'
})

githubApi.interceptors.response.use(
  (response) => {
    if ((response.headers['x-oauth-scopes'] || '').indexOf('gist') === -1) {
      return Promise.reject(new Error('Token need gist scope'))
    }
    return response.data
  },
  (err) => {
    return Promise.reject(err.response.data || err)
  }
)

function cap (str) {
  return str[0].toUpperCase() + str.substr(1)
}

function setSyncKey (key) {
  githubApi.defaults.headers.common['Authorization'] = `token ${key}`
}

function resource (name, addition) {
  const Name = cap(name)
  return {
    async [`get${Name}s`] ({ commit }) {
      return db[`${name}s`].each(v => commit(`update${Name}`, v))
    },

    async [`get${Name}`] ({ commit }, id) {
      const v = await db[`${name}s`].get(id)
      v && commit(`update${Name}`, v)
    },

    async [`create${Name}`] ({ dispatch, commit }, value) {
      const id = await db[`${name}s`].put(value)
      await dispatch(`get${cap(name)}`, id)
    },

    async [`delete${Name}`] ({ commit }, id) {
      commit(`delete${cap(name)}`, id)
      await db[`${name}s`].delete(id)
    },

    async [`update${Name}`] ({ dispatch, commit }, value) {
      commit(`update${Name}`, value)
      await db[`${name}s`].update(value.id, value)
      await dispatch(`get${cap(name)}`, value.id)
    },

    ...addition
  }
}

export default {
  async initApp ({ dispatch, state }) {
    await db.open()
    await dispatch('getProjects')
    await dispatch('getTaskLists')
    await dispatch('getTasks')
    setSyncKey(state.syncInfo.syncKey)
  },

  ...resource('project'),
  ...resource('taskList'),
  ...resource('task'),

  async deleteProject ({ commit, dispatch, getters }, id) {
    commit('deleteProject', id)
    await db.projects.delete(id)
    await Promise.all(
      getters.taskLists(id).map(
        tl => dispatch('deleteTaskList', tl.id)
      )
    )
  },

  async deleteTaskList ({ commit, dispatch, getters }, id) {
    commit('deleteTaskList', id)
    await db.taskLists.delete(id)
    await Promise.all(
      getters.tasks(id).map(
        t => dispatch('deleteTask', t.id)
      )
    )
  },

  updateSyncInfo ({ commit, state }, payload) {
    const syncInfo = {
      ...state.syncInfo,
      ...payload
    }
    Object.entries(syncInfo).forEach(([key, value]) => localStorage.setItem(key, value))
    setSyncKey(state.syncInfo.syncKey)
    commit('setState', {
      syncInfo
    })
  },

  testSyncKey ({ state }, syncInfo) {
    const oldKey = state.syncInfo.syncKey
    setSyncKey(syncInfo.syncKey)
    const promise = githubApi.get(`/gists/${syncInfo.syncId}`)
    setSyncKey(oldKey)
    return promise
  },

  upload ({ state }, projects) {
    const projectsFile = {
      filename: 'projects.json',
      content: JSON.stringify(projects, null, 4)
    }
    const configFile = {
      filename: 'config.json',
      content: JSON.stringify({
        updateAt: Date.now()
      }, null, 4)
    }

    return githubApi.post(`/gists/${state.syncInfo.syncId}`, {
      description: 'kanban sync',
      files: {
        'projects.json': projectsFile,
        'config.json': configFile
      }
    })
  },

  async download ({ state }) {
    const gist = await githubApi.get(`/gists/${state.syncInfo.syncId}`)
    const projectsFile = gist.files['projecst.json']
    const configFile = gist.files['config.json']

    if (!configFile || !projectsFile) {
      return [[], { updateAt: 0 }]
    }
    return [
      JSON.parse(projectsFile.content),
      JSON.parse(configFile.content)
    ]
  },

  async sync ({ dispatch }) {
    let [projects, config] = await dispatch('download')
    const currentUpdateAt = (localStorage.getItem('syncUpdateAt') * 1) || 0
    if (config.updateAt <= currentUpdateAt) {
      projects = await dispatch('syncExport')
      await dispatch('upload', projects)
      localStorage.setItem('syncUpdateAt', Date.now())
    } else {
      await dispatch('clearDB')
      await dispatch('syncImport', projects)
      localStorage.setItem('syncUpdateAt', config.updateAt)
    }
  },

  async clearDB () {
    await db.projects.clear()
    await db.taskLists.clear()
    await db.tasks.clear()
  },

  syncExport ({ getters }) {
    return getters.projects.map(p => ({
      ...p,
      taskLists: getters.taskLists(p.id).map(tl => ({
        ...tl,
        tasks: getters.tasks(tl.id)
      }))
    }))
  },

  syncImport ({ dispatch }, projects) {
    return Promise.all(projects.map(async (project) => {
      const projectId = await db.projects.put({
        name: project.name
      })
      await Promise.all(project.taskLists.map(async (taskList) => {
        const taskListId = await db.taskLists.put({
          projectId,
          name: taskList.name,
          sort: taskList.sort
        })
        await Promise.all(taskList.tasks.map(async (task) => {
          await db.tasks.put({
            taskListId,
            content: task.content,
            sort: task.sort
          })
        }))
      }))
    }))
      .then(() => dispatch('initApp'))
  }
}
