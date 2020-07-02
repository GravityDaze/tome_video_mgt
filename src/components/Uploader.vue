/* 
    基于Element-ui上传组件封装的通用图片上传组件
    Author:朱星杰
    Date:2020/7/1
*/

<template>
  <el-upload
    class="uploader"
    action="https://upload-z2.qiniup.com"
    :show-file-list="false"
    :on-success="onSuccess"
    :before-upload="beforeUpload"
    :data="{token}"
  >
    <div slot="tip" class="el-upload__tip">{{tip}}</div>
    <img
      v-if="imgUrl"
      :src="imgUrl"
      class="upload-img"
    />
    <i v-else class="el-icon-plus uploader-icon"></i>
  </el-upload>
</template>

<script>
export default {
    props:['tip','imgUrl','token'],
    data(){
        return{
            action:"https://upload-z2.qiniup.com"
        }
    },
    methods:{
        // 上传之前回调
        beforeUpload(file){
            this.$emit('beforeUpload',file) 
        },

        // 上传成功回调
        onSuccess(res,file){
            this.$emit('onSuccess',{res,file}) 
        },
    }
};
</script>

<style>
.uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 157px;
    height: 48px;
    line-height: 48px;
    text-align: center;
  }
  .upload-img {
    width: 157px;
    height: 48px;
    display: block;
  }
</style>