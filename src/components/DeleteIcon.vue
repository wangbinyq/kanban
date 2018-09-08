<template>
  <el-popover
    v-model="bShowDelete"
    popper-class="delete-popover"
    content="delete?"
    placement="bottom">
    <i @click.stop="bShowDelete = true" slot="reference" class="el-icon-close"></i>
    <div style="margin-bottom: 5px;">
      Are you sure?
    </div>
    <el-button
      style="width: 100%;"
      @click="$emit('delete')"
      size="small"
      type="danger">
      Delete
    </el-button>
  </el-popover>
</template>

<script>
export default {
  data () {
    return {
      bShowDelete: false
    }
  }
}
</script>

<style lang="scss" scoped>
.el-icon-close {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>
