export default {
  projects (state) {
    return Object.values(state.projects)
      .sort((p1, p2) => p1.id - p2.id)
  },

  taskLists (state) {
    return (projectId) => {
      return Object.values(state.taskLists)
        .filter(tl => tl.projectId === projectId)
    }
  },

  tasks (state) {
    return (taskListId) => {
      return Object.values(state.tasks)
        .filter(t => t.taskListId === taskListId)
    }
  }
}
