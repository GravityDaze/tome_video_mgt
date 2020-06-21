<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App"
};
</script>

<style>
html {
  min-width: 1280px;
}

html,
body,
ul,
li {
  font-size: 12px;
  margin: 0;
  padding: 0;
}

.btn1,.btn2,.btn3,.btn4,.btn5,.btn6,.btn7,.btn8,.btn9{
  text-align: center;
}

#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

/*左侧导航栏样式*/
.tac .el-menu {
  padding: 0;
}

.tac .el-menu .el-submenu__title {
  padding: 0 40px 10px !important;
  font-size: 16px !important;
  text-align: left;
}

.tac .el-menu .el-menu .el-menu-item {
  padding: 5px 60px !important;
  list-style: none;
  text-align: left;
}

.my_searchs {
  border: 1px solid lightgrey;
  /*padding: 10px 0;*/
}

.my_tables {
  /*border:1px solid lightgrey;*/
  margin-top: 0.3rem;
}

.my_hover {
  cursor: pointer;
}

#publicAddEditorDialog .el-dialog__header,
#sceneryAllInfo .el-dialog__header,
#alterPasswordForm .el-dialog__header,
#addEditorForm .el-dialog__header,
#userInfoForm .el-dialog__header,
#myTablesDialog .el-dialog__header {
  /*border: 1px solid red;*/
  background-color: #fa8819;
}

#tagInfo .el-dialog__header {
  background-color: #fa8819;
}

/*单排的新增编辑模态框样式控制*/
.face {
  /*border:1px solid red;*/
  display: flex;
  padding-left: 0.65rem;
}

.obj_box {
  border: 1px solid lightgrey;
  position: relative;
  margin-left: 10px;
}

.upload_header,
.upload_input {
  border: 1px solid lightgrey;
  width: 2.5rem;
  min-width: 120px;
  height: 1.2rem;
  min-height: 100px;
}

.upload_input {
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
}

.face2 {
  /*border:1px solid blue;*/
  display: flex;
  padding-left: 0.65rem;
}

.all_pic_box {
  /*border:1px solid red;*/
  display: flex;
  flex-wrap: wrap;
}

.pic_title {
  /*width:calc(100% - 0.65rem);*/
  padding-left: 0.65rem;
  /*border:1px solid red;*/
}

.pic_title > span,
.face_title > span {
  /*border:1px solid red;*/
  display: flex;
  width: 0.6rem;
  min-width: 80px;
}

.pic_and_input {
  /*border:1px solid red;*/
  position: relative;
  margin: 10px 0 10px 10px;
}

.pic_box,
.input_box {
  border: 1px solid lightgrey;
  width: 2.5rem;
  min-width: 120px;
  height: 1.2rem;
  min-height: 100px;
}

.input_box {
  position: absolute;
  opacity: 0;
  top: 0;
  left: 0;
}

.tip_info {
  padding: 0.2rem 0;
  white-space: nowrap;
  color: red;
}

.position_center {
  text-align: center;
  margin: 10px 0;
}

.change_select_style {
  width: 100%;
}

.clear_btn {
  /*border: 1px solid red;*/
  padding: 10px 10px;
}

.clear_btn > span {
  background-color: orange;
  border: 1px solid orange;
  padding: 5px;
}
</style>
