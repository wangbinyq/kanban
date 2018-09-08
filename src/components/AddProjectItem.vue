<template>
  <div
    @click="add = true"
    v-if="!add"
    class="project-item-add">
    <i class="el-icon-plus"></i>
    Add a new project
  </div>
  <div
    v-else
    v-clickoutside="() => add = false"
    class="project-item-add project-item-add-edit">
    <div class="project-input">
      <el-input
        v-autofocus
        @keypress.native.enter="($emit('create', newProjectName), newProjectName = '')"
        v-model="newProjectName"></el-input>
    </div>
    <el-button @click="($emit('create', newProjectName), newProjectName = '')" size="small" type="primary">
      Create
    </el-button>
  </div>
</template>

<script>
export default {
  data () {
    return {
      add: false,
      newProjectName: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.project-item-add {
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

  .project-input {
    margin-bottom: 8px;
  }

  &.project-item-add-edit {
    display: block;
  }

  &:hover {
    background: #ccc;
  }

  .el-icon-plus {
    padding-right: 0.5em;
  }
}
</style>
