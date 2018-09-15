<template>
  <div @click="edit=true" v-if="!edit" class="edit-input">
    <span>
      {{ value }}
    </span>
    <span v-if="showDelete"
      @click.stop="$emit('delete')"
      class="el-icon-remove">
    </span>
  </div>
  <el-input
    style="z-index: 100;"
    v-else
    v-autofocus
    @blur="onEnter"
    @keypress.native.enter="onEnter"
    v-model="dValue">
  </el-input>
</template>

<script>
export default {
  props: {
    value: String,
    showDelete: Boolean
  },
  data () {
    return {
      edit: false,
      dValue: this.value
    }
  },
  watch: {
    value (val) {
      this.dValue = val
    }
  },
  methods: {
    onEnter () {
      this.$emit('change', this.dValue)
      this.edit = false
    }
  }
}
</script>

<style lang="scss" scoped>
.edit-input {
  cursor: pointer;
  padding: 5px;
  padding-right: 10px;
  border-bottom: 1px solid transparent;

  .el-icon-remove {
    visibility: hidden;
    padding-left: 5px;
  }

  &:hover {
    border-bottom: 1px solid #eee;

    .el-icon-remove {
      visibility: visible;
    }
  }
}
</style>
