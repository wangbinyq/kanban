<template>
  <div
    @click="add = true"
    v-if="!add"
    class="item-add">
    <i class="el-icon-plus"></i>
    Create {{ name }}
  </div>
  <div
    v-else
    v-clickoutside="() => add = false"
    class="item-add item-add-edit">
    <div class="add-input">
      <el-input
        v-autofocus
        autosize
        :type="inputType"
        @keypress.native.enter="($emit('create', newName), newName = '')"
        v-model="newName"></el-input>
    </div>
    <el-button @click="($emit('create', newName), newName = '')" size="small" type="primary">
      Create
    </el-button>
  </div>
</template>

<script>
export default {
  props: {
    name: String,
    inputType: {
      type: String,
      default: 'text'
    }
  },
  data () {
    return {
      add: false,
      newName: ''
    }
  }
}
</script>

<style lang="scss" scoped>
.item-add {
  .add-input {
    margin-bottom: 8px;
  }

  &.item-add-edit {
    display: block;
  }

  &:hover {
    color: #333;
  }

  .el-icon-plus {
    padding-right: 0.5em;
  }
}
</style>
