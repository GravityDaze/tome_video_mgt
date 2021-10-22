/* 
    通用上传组件
    Author:朱星杰
    Date:2020/2/26
*/

<template>
  <el-upload
    ref="upload"
    class="uploader"
    action="https://upload-z2.qiniup.com"
    :element-loading-text="loadingText"
    v-loading="loading"
    :show-file-list="listType !== 'text'"
    :before-upload="beforeUpload"
    :on-success="onSuccess"
    :on-progress="onProgress"
    :on-error="onError"
    :on-remove="onRemove"
    :on-preview="onPreview"
    :file-list="fileList"
    :list-type="listType"
    :data="{ token }"
  >
    <div v-if="tips" slot="tip" class="el-upload__tip">
      {{ tips }}
    </div>
    <img :style="{ height:height+'px',width:width+'px' }" v-if="imageUrl" :src="imageUrl" class="img" />
    <video :style="{ height:height+'px',width:width+'px' }" autoplay loop v-else-if="videoUrl" :src="videoUrl" class="video" />
    <i :style="{ height:height+'px',width:width+'px' }" v-else :class="['el-icon-plus',  listType ==='text'?'uploader-icon':'' ]"></i>
  </el-upload>
</template>

<script>
import { getPublicUploadParams } from "@/api/qiniu";
export default {
  props: {
    imageUrl: {
      default: ""
    },
    videoUrl:{
      default:""
    },
    name: {
      default: "",
    },
    allowedFileType: {
      default() {
        return [];
      },
      type: Array,
    },
    tips: {
      default: "",
      type: String,
    },
    fileList:{
      default(){
        return []
      },
      type:Array
    },
    listType:{
      default:"text",
      type:String 
    },
    height:{
      default:178
    },
    width:{
      default:178
    }
  },
  data() {
    return {
      token: "",
      loading:false,
      loadingText:""
    };
  },
  methods: {
    async beforeUpload({ type, name }) {
      const filterType = this.setDefaultType()
      if (filterType.indexOf(type) === -1) {
        //'video/ogg', 'video/flv', 'video/avi', 'video/wmv', 'video/rmvb'
        this.$message.error("请上传的正确的文件格式");
        return Promise.reject();
      } else {
        try {
          const { data } = await getPublicUploadParams({ fileName: name });
          this.token = data.value.token;
        } catch (err) {
          return Promise.reject();
        }
      }
    },

    setDefaultType(){
      // 设置默认类型过滤
      console.log(  this.imageUrl === undefined  )
      if( this.allowedFileType.length ){
        return this.allowedFileType
      }else if( this.imageUrl !== undefined ){
        return [ "image/jpeg" ,"image/png" ]
      }else{
        return [ "video/mp4" ]
      }
    },

    // 获取上传进度
    onProgress(event) {
      this.loading = true
      this.loadingText = `正在上传中，请勿关闭对话框或刷新页面${parseInt(event.percent)}%`
      this.$emit('progress',event)
    },
    onError() {
      this.$confirm("上传视频失败,请刷新网页并尝试重新上传", "提示", {
        type: "error",
      })
        .then(() => {})
        .catch(() => {});
    },
    onSuccess(res, file) {
      this.loading = false
      this.loadingText = ""
      this.$emit("success", res, file);
    },
    onPreview(file){
      this.$emit("preview", file);
    },
    onRemove(file){
      this.$emit("remove", file);
    },
    abort(){
      this.$refs.upload.abort();
    },
    clearFiles(){
       this.$refs.upload.clearFiles();
    }

  },
};
</script>

<style lang="less">
.uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.uploader .el-upload:hover {
  border-color: #409eff;
}

.uploader img{
   width: 178px;
   height: 178px;
   display: block;
}

.uploader video{
   width: 178px;
   height: 178px;
   object-fit: cover;
}

.uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
</style>