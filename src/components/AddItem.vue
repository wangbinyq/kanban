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
        ref="input"
        v-autofocus
        autosize
        @keypress.native.enter="$nextTick(onAdd)"
        :type="inputType"
        v-model="newName"></el-input>
    </div>
    <el-button @click="onAdd" size="small" type="primary">
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
  },
  methods: {
    onAdd () {
      const content = this.newName.trim()
      if (!content) {
        return
      }
      this.$emit('create', this.newName)
      this.newName = ''
      this.$refs.input.focus()
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

  color: #666;
  &:hover {
    color: #333 !important;
  }

  .el-icon-plus {
    padding-right: 0.5em;
  }
}
</style>
