import Vue from 'vue'

const updateValue = (state, { type, key, value }) => {
  Vue.set(state[type], key,
    Object.assign({}, state[type][key], value))
}

const deleteProject = (state, id) => {
  Vue.delete(state.projects, id)
}

const deleteTaskList = (state, id) => {
  Vue.delete(state.taskLists, id)
}

const deleteTask = (state, id) => {
  Vue.delete(state.tasks, id)
}

export default {
  setState (state, obj) {
    Object.entries((key, value) => Vue.set(state, key, value))
  },

  updateProject (state, value) {
    updateValue(state, {
      type: 'projects',
      key: value.id,
      value
    })
  },

  updateTaskList (state, value) {
    updateValue(state, {
      type: 'taskLists',
      key: value.id,
      value
    })
  },

  updateTask (state, value) {
    updateValue(state, {
      type: 'tasks',
      key: value.id,
      value
    })
  },

  deleteProject,

  deleteTaskList,

  deleteTask
}
