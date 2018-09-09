import db from '@/db'

function cap (str) {
  return str[0].toUpperCase() + str.substr(1)
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
  async initApp ({ dispatch }) {
    await db.open()
    await dispatch('getProjects')
    await dispatch('getTaskLists')
    await dispatch('getTasks')
  },

  ...resource('project'),
  ...resource('taskList'),
  ...resource('task')
}
