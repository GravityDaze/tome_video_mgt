<template>
  <el-form ref="form" :model="form" label-width="80px" :rules="rules">
    <el-form-item
      :label="item.label"
      :prop="item.prop"
      v-for="(item, index) in forms"
      :key="index"
    >
      <!-- 输入框 -->
      <el-input
        v-if="item.type === 'input'"
        v-model="form[item.prop]"
      ></el-input>
      <!-- 上传 -->
      <Uploader
        v-if="item.type === 'upload'"
        @success="(...arg)=>item.onSuccess && item.onSuccess(...arg)"
        :imageUrl="item.uploadType === 'image' && form[item.prop]"
        :videoUrl="item.uploadType === 'video' && form[item.prop]"
        :listType="item['list-type']"
        :fileList="Array.isArray(form[item.prop])?form[item.prop]:[]"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSubmit('form')">立即创建</el-button>
      <el-button>取消</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import Uploader from "../Uploader";
export default {
  props: {
    forms: {
      default: () => [],
      type: Array,
    },
    formdata:{
        default:()=>{},
        type:Object
    }
  },
  data() {
    return {
      rules: {},
      form: {},
    };
  },
  watch:{
      formdata:{
          handler(form){
              console.log(form)
              this.form = { ...form  } 
              console.log(  this.form )
          },
          deep:true,
          immediate:true
      }
  },
  created() {
    this.createModel();
    this.createRules();
  },
  methods: {
    createRules() {
      this.forms
        .filter((v) => v.rules)
        .forEach((v) => {
          this.$set(this.rules, v.prop, v.rules);
        });
    },
    createModel() {},
    onSubmit(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$emit("submit", this.form);
        } else {
          return false;
        }
      });
    },
    onSuccess(arg){
        console.log(arg)
    },
    resetFields() {
      this.$refs.form.resetFields();
    },
  },
  components: {
    Uploader,
  },
};
</script>

<style>
</style>