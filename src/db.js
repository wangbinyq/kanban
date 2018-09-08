import Dexie from 'dexie'

const db = new Dexie('kanban')

export default db

db.version(1).stores({
  projects: '++id,name',
  taskLists: '++id,name,projectId',
  tasks: '++id,content,taskListId,done'
})

export async function seed () {
  if (process.env.NODE_ENV === 'production') {
    return
  }
  await db.projects.clear()
  await db.projects.bulkAdd(
    [1, 2, 3].map(i => ({ name: `project ${i}`, id: i }))
  )

  await db.taskLists.clear()
  await db.taskLists.bulkAdd([].concat(
    [1, 2, 3].map(i => ({ name: `taskList ${i} of Project 1`, id: i, projectId: 1 })),
    [4, 5, 6].map(i => ({ name: `taskList ${i} of Project 2`, id: i, projectId: 2 }))
  ))

  await db.tasks.clear()
  await db.tasks.bulkAdd(
    [1, 2, 3].map(i => ({ content: `task ${i}`, id: i, taskListId: 1, done: false }))
  )
}
