<script>
// 该组件详见:https://juejin.im/post/5c92ff94f265da6128275a85  => redirect 刷新页面
export default {
  created() {
    const { params, query } = this.$route
    const { path } = params
    this.$router.replace({ path: '/' + path, query })
  },
  render: function(h) {
    return h() // avoid warning message
  }
}
</script>
