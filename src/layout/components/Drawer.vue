<template>
  <el-drawer
    show-close
    :title="drawerFormType === 'profile'?'个人资料':'修改密码'"
    :visible.sync="showDrawer"
    direction="rtl"
    append-to-body
    :before-close="handleClose"
  >
    <!--  -->
    <div class="drawer" v-if="drawerFormType === 'profile'">
      <img src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
      <el-form ref="form" :model="userInfoForm" label-width="80px">
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
          <span v-else>{{userInfo.phone}}</span>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-if="showForm" v-model="userInfoForm.email"></el-input>
          <span v-else>{{userInfo.email}}</span>
        </el-form-item>
        <el-form-item label="生日">
          <el-input v-if="showForm" v-model="userInfoForm.birthday"></el-input>
          <span v-else>{{userInfo.birthday}}</span>
        </el-form-item>
        <el-form-item>
          <el-button :disabled="pending" type="primary" @click="edit">{{showForm?'保存资料':'修改资料'}}</el-button>
        </el-form-item>
      </el-form>
    </div>

    <!-- 修改密码表单 -->
    <div class="changePwd" v-else>
      <el-form ref="changePwd" :model="pwdForm" label-width="80px" :rules="rules">
        <el-form-item label="原密码">
          <el-input v-model="pwdForm.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="pwdForm.newPassword"></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="pwdForm.confirmPassword"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="changePwd">确认修改</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import { editUserInfo } from "@/api/user";
export default {
  computed: mapGetters(["userInfo"]),
  props: {
    showDrawer: {
      type: Boolean,
      default: false
    },
    drawerFormType:{
        type:String,
        default:''
    }
  },
  data() {
    return {
      userInfoForm: {
        realName: "",
        sex: "",
        phone: "",
        email: "",
        birthday: ""
      }, //个人资料表单
      pwdForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      }, //修改密码表单
      rules:[
          {}
      ],
      showForm: false,
      pending: false
    };
  },
  methods: {
    handleClose() {
      this.$emit("close");
    },
    // 编辑个人资料
    async edit() {
      if (!this.showForm) {
        this.showForm = true;
        //   回填数据
        for (const item in this.userInfoForm) {
          this.userInfoForm[item] = this.userInfo[item];
        }
      } else {
        //  发送编辑请求
        try {
          this.pending = true;
          const { data } = await editUserInfo(this.userInfoForm);
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
    // 修改密码
    changePwd(){

    }
  }
};
</script>

<style lang="less" scoped>
// 修改密码
.changePwd{

}


// 抽屉
.drawer {
  padding: 20px;
  display: flex;
  align-items: center;
  flex-flow: column;

  img {
    width: 80px;
    padding: 20px;
  }
}
</style>