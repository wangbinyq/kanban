import Vue from 'vue'

const updateValue = (store, { type, key, value }) => {
  Vue.set(store[type], key,
    Object.assign({}, store[type][key], value))
}

const deleteProject = (store, id) => {
  Vue.delete(store.projects, id)
  setTimeout(() => {
    Object.values(store.taskLists)
      .filter(tl => tl.projectId === id)
      .forEach(tl => deleteTaskList(store, tl.id))
  }, 0)
}

const deleteTaskList = (store, id) => {
  Vue.delete(store.taskLists, id)
  setTimeout(() => {
    Object.values(store.tasks)
      .filter(tl => tl.taskListId === id)
      .forEach(tl => deleteTask(store, tl.id))
  }, 0)
}

const deleteTask = (store, id) => {
  Vue.delete(store.tasks, id)
}

export default {
  setState (store, obj) {
    Object.entries((key, value) => Vue.set(key, value))
  },

  updateProject (store, value) {
    updateValue(store, {
      type: 'projects',
      key: value.id,
      value
    })
  },

  updateTaskList (store, value) {
    updateValue(store, {
      type: 'taskLists',
      key: value.id,
      value
    })
  },

  updateTask (store, value) {
    updateValue(store, {
      type: 'tasks',
      key: value.id,
      value
    })
  },

  deleteProject,

  deleteTaskList,

  deleteTask
}
