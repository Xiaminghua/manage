<template>
  <el-row>
    <el-col :span="3" class="col">
      <div>
        <div class="title">应用管理系统</div>
        <!-- <img src="@/assets/img/logo.png" alt=""> -->
      </div>
    </el-col>

    <!-- 密码 -->
    <el-col :span="20" class="logout">
      <el-dropdown trigger="click">
        <span class="el-dropdown-link" style="color:#fff;">
          {{username}}
          <i class="el-icon-arrow-down el-icon--right" style="color:#fff;"></i>
        </span>
        <el-dropdown-menu slot="dropdown" style="top:43px;">
          <el-dropdown-item @click.native="editPawDialog=true">修改密码</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <a href="#" @click.prevent="logout" style="margin-left:50px;">退出</a>
    </el-col>
    <el-dialog
      title="修改密码"
      :visible.sync="editPawDialog"
      :modal-append-to-body="false"
      custom-class="editPawDialog"
    >
      <el-form :model="editPaw" :rules="editPawRules" ref="editPaw" label-width="100px">
        <el-form-item label="旧密码" prop="oldPaw">
          <el-input v-model="editPaw.oldPaw" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPaw">
          <el-input v-model="editPaw.newPaw" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="确认新密码" prop="confirmNewPaw">
          <el-input v-model="editPaw.confirmNewPaw" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
     <div slot="footer" class="dialog-footer">
        <el-button @click="editPawDialog = false">取 消</el-button>
        <el-button type="primary" @click="editPawSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </el-row>
</template>
<script>
export default {
  data() {
    return {
      activeIndex: "1",
      username: "",
      editPawDialog:false,
      editPaw: {
        oldPaw: "",
        newPaw: "",
        confirmNewPaw: ""
      },
      editPawRules: {
        oldPaw: [{ required: true, message: "请输入旧密码", trigger: "blur" }],
        newPaw: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          {
            min: 8,
            max: 20,
            message: "长度在 8 到 20 个字符",
            trigger: "blur"
          },
          {
            // eslint-disable-next-line
            validator(rule, value, callback, source, options) {
              var errors = [];
              if (!/(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/.test(value)) {
                errors.push("至少包含数字跟字母,长度在 6 到 20 个字符");
              }
              callback(errors);
            }
          }
        ],
        confirmNewPaw: [
          { required: true, message: "请再次输入新密码", trigger: "blur" },
          {
            min: 8,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur"
          },
          {
            // eslint-disable-next-line
            validator(rule, value, callback, source, options) {
              var errors = [];
              if (!/(?=.*([a-zA-Z].*))(?=.*[0-9].*)[a-zA-Z0-9-*/+.~!@#$%^&*()]{6,20}$/.test(value)) {
                errors.push("至少包含数字跟字母,长度在 6 到 20 个字符");
              }
              callback(errors);
            }
          }
        ]
      },
      formLabelWidth: "100px",
      systemUrl:""
    };
  },
  methods: {
    logout() {
      this.$confirm("您确定要退出吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          window.sessionStorage.removeItem("userList");
          window.sessionStorage.removeItem("roleList");
          window.sessionStorage.removeItem("systemUrl");
          this.$router.push("/login");
          this.$message({
            type: "success",
            message: "退出成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消退出"
          });
        });
    },
    handleSelect() {},
    editPawSubmit() {
      let users = JSON.parse(sessionStorage.getItem("userList"));
      let param = new URLSearchParams();
      param.append('id', users.id)
      param.append('name', users.name)
      param.append('tel', users.tel)
      param.append('mailbox', users.mailbox)
      param.append('phoneNum', users.phoneNum)
      param.append('jobNum', users.jobNum)
      param.append('department', users.department)
      param.append('post', users.post)
      param.append('deputyPost', users.deputyPost)
      param.append('jobLevel', users.jobLevel)
      param.append('sysRole', users.sysRole)
      param.append('passwd', this.editPaw.confirmNewPaw)
      this.$axios({
        method:"post",
        url:this.systemUrl + "user/updateUserInfo",
        data:param,
        }).then(res => {
          alert('编辑成功')
          this.editPawDialog = false;
          this.searchData();
        });
    }
  },
  mounted() {
    this.systemUrl = sessionStorage.getItem('systemUrl');
    this.username = JSON.parse(sessionStorage.getItem("userList")).name;
    
  }
};
</script>
<style>
/* 头部样式 */

el-row {
  background-color: #545c64;
}
.title {
  font-size: 24px;
  color: #fff;
  text-align: center;
}

.logout {
  text-align: right;
  /* margin-right: 10px; */
}

.logout a {
  color: #fff;
  text-decoration: none;
}

.logout a:hover {
  color: red;
}
#dropdown-menu-4016 {
  top: 43px;
}
</style>