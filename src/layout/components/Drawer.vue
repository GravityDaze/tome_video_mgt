<template>
  <el-drawer
    size="20%"
    show-close
    :title="drawerFormType === 'profile'?'个人资料':'修改密码'"
    :visible.sync="showDrawer"
    direction="rtl"
    append-to-body
    :before-close="handleClose"
    custom-class="drawer"
    ref="drawer"
    @closed="drawerClose"
    @open="drawerOpen"
  >
    <!--  -->
    <div class="drawer" v-if="drawerFormType === 'profile'">
      <el-upload
        class="avatar-upload"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :data="{token}"
        action="https://upload-z2.qiniup.com"
      >
        <el-avatar
          style="width:80px;height:80px"
          :src="userInfo.headheadPicPath || this.userInfoForm.headPicPath || require('../../assets/images/avatar.png')"
        ></el-avatar>
        <div class="mask">
          <span>修改头像</span>
        </div>
      </el-upload>
      <el-form ref="userInfoForm" :model="userInfoForm" label-width="80px">
        <el-form-item label="用户名">
          <span>{{userInfo.loginName}}</span>
        </el-form-item>
        <el-form-item label="真实姓名">
          <el-input v-if="showForm" v-model="userInfoForm.realName"></el-input>
          <span v-else>{{userInfo.realName}}</span>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-if="showForm" v-model="userInfoForm.sex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="0">女</el-radio>
          </el-radio-group>
          <span v-else>{{userInfo.sex?'男':'女'}}</span>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-if="showForm" v-model="userInfoForm.phone"></el-input>
          <span v-else>{{userInfo.phone || '未设置'}}</span>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-if="showForm" v-model="userInfoForm.email"></el-input>
          <span v-else>{{userInfo.email || '未设置'}}</span>
        </el-form-item>
        <el-form-item label="生日">
          <el-input v-if="showForm" v-model="userInfoForm.birthday"></el-input>
          <span v-else>{{userInfo.birthday}}</span>
        </el-form-item>
      </el-form>
    </div>

    <!-- 修改密码表单 -->
    <div class="changePwd" v-else>
      <el-form ref="pwdForm" status-icon :model="pwdForm" label-width="80px" :rules="rules">
        <el-row type="flex" justify="center">
          <el-col :span="18">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input type="password" v-model="pwdForm.oldPassword"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="18">
            <el-form-item label="新密码" prop="newPassword">
              <el-input type="password" v-model="pwdForm.newPassword"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="18">
            <el-form-item label="确认密码" prop="confirmPassword">
              <el-input type="password" v-model="pwdForm.confirmPassword"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" justify="center">
          <el-col :span="18">
            <el-form-item>
              <el-button @click="changePwd('pwdForm')" type="primary">确认修改</el-button>
              <el-button @click="cancel">关闭</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div
      class="drawer__footer"
      v-if="drawerFormType === 'profile'"
      style="display:flex;justify-content:center"
    >
      <el-button :disabled="pending" type="primary" @click="edit">{{showForm?'保存资料':'修改资料'}}</el-button>
      <el-button @click="cancel">{{showForm?'取消':'关闭'}}</el-button>
    </div>
  </el-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";
import { restore } from "@/utils/restoreModel";
import { getPublicUploadParams } from "@/api/qiniu";
import { editUserInfo, editPassword } from "@/api/user";
export default {
  computed: mapGetters(["userInfo"]),
  props: {
    showDrawer: {
      type: Boolean,
      default: false
    },
    drawerFormType: {
      type: String,
      default: ""
    }
  },
  data() {
    // 自定义密码修改校验规则
    var opValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入原密码"));
      } else {
        callback();
      }
    };

    var npValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入新密码"));
      } else {
        if (this.pwdForm.confirmPassword !== "") {
          this.$refs.pwdForm.validateField("confirmPassword");
        }
        callback();
      }
    };

    var cpValid = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.pwdForm.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      userInfoForm: {
        realName: "",
        sex: "",
        phone: "",
        email: "",
        birthday: "",
        headPicPath: ""
      }, //个人资料表单
      pwdForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      }, //修改密码表单
      rules: {
        oldPassword: [{required: true, validator: opValid, trigger: "blur" }],
        newPassword: [{required: true, validator: npValid, trigger: "blur" }],
        confirmPassword: [{required: true, validator: cpValid, trigger: "blur" }]
      },
      showForm: false,
      pending: false,
      token: "" //七牛云上传token
    };
  },
  methods: {
    handleClose() {
      if (this.showForm) return this.$message.warning("请保存资料");
      this.$emit("close");
    },

    // 上传头像前
    async beforeAvatarUpload({ type, name }) {
      // 校验文件类型
      if (["image/jpeg", "image/png"].indexOf(type) == -1) {
        this.$message.error("只能上传jpg & png 格式的图片");
        return Promise.reject();
      } else {
        try {
          const { data } = await getPublicUploadParams({ fileName: name });
          this.token = data.value.token;
          return true;
        } catch (err) {
          return Promise.reject();
        }
      }
    },

    // 成功上传头像后
    async handleAvatarSuccess({ key }) {
      // 回显头像
      this.userInfoForm.headPicPath = `https://tomevideo.zhihuiquanyu.com/${key}`;
      console.log(this.userInfo);
      await editUserInfo({
        ...this.userInfo,
        headPicPath: `https://tomevideo.zhihuiquanyu.com/${key}`
      });
      //   同步至vuex
      this.$store.commit("user/SET_USER_INFO", {
        ...this.userInfo,
        headPicPath: `https://tomevideo.zhihuiquanyu.com/${key}`
      });
      this.$message.success("头像修改成功");
    },

    // 编辑个人资料
    async edit() {
      if (!this.showForm) {
        this.showForm = true;
      } else {
        //  发送编辑请求
        try {
          this.pending = true;
          await editUserInfo(this.userInfoForm);
          //   同步至vuex
          this.$store.commit("user/SET_USER_INFO", {
            loginName: this.userInfo.loginName,
            ...this.userInfoForm
          });
          this.$message.success("修改资料成功");
        } catch (err) {
        } finally {
          this.pending = false;
          this.showForm = false;
        }
      }
    },

    // 关闭抽屉或关闭输入框
    cancel() {
      if (this.showForm) {
        this.showForm = false;
        // 清除表单数据
        this.userInfoForm = restore(this.userInfoForm);
        // 重新回填数据
        for (const item in this.userInfoForm) {
          this.userInfoForm[item] = this.userInfo[item];
        }
      } else {
        this.$emit("close");
      }
    },

    // 修改密码
    changePwd(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          const { data } = await editPassword(this[formName]);
          this.$message.success("修改密码成功");
          this.$emit("close");
        } else {
          console.log("error submit!!");
        }
      });
    },
    // 抽屉打开回调
    drawerOpen() {
      // 回显个人资料表单数据
      for (const item in this.userInfoForm) {
        this.userInfoForm[item] = this.userInfo[item];
      }
    },

    // 抽屉关闭回调
    drawerClose() {
      this.pwdForm = restore(this.pwdForm);
      this.$refs["pwdForm"].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
// 修改密码
.changePwd {
  margin-top: 20px;
}

// 抽屉
.drawer {
  padding: 20px;
  display: flex;
  align-items: center;
  flex-flow: column;

  .avatar-upload {
    margin-bottom: 20px;
    position: relative;

    .mask {
      position: absolute;
      top: 0;
      width: 80px;
      height: 80px;
      opacity: 0;
      background: rgba(0, 0, 0, 0.5);
      border-radius: 50%;
      transition: 0.5s;
      display: flex;
      justify-content: center;
      align-items: center;
      span {
        font-size: 12px;
        color: #fff;
      }
    }

    &:hover {
      .mask {
        opacity: 1;
      }
    }
  }
}
</style>