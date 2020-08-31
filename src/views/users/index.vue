<template>
  <el-card>
    <mybread firstnav="用户管理" lastnav="用户管理" />
    <el-row class="myrow">
      <el-col :span="5">
        <el-input placeholder="请输入内容" v-model="search" class="input-with-select">
          <el-button slot="append" icon="el-icon-search" @click="searchData"></el-button>
        </el-input>
      </el-col>
      <el-col :span="19" style="text-align:right;">
        <el-button type="success" @click="addDialog=true" v-if="auth.indexOf('add') !=-1">添加用户</el-button>
        <el-button type="success" @click="synchronization">同 步</el-button>
      </el-col>
    </el-row>

    <!-- <el-table :data="tableData" style="width: 100%;margin-bottom:20px;"> -->
    <el-table
    :data="tableData.slice((pagenum-1)*pagesize,pagenum*pagesize)"
    style="width: 100%;margin-top: 20px;"
    row-key="id"
    border
    default-expand-all
    :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
      <el-table-column prop="name" sortable label="用户名"></el-table-column>
      <el-table-column prop="tel" sortable label="座机"></el-table-column>
      <el-table-column prop="mailbox" label="邮箱"></el-table-column>
      <el-table-column prop="phoneNum" label="手机"></el-table-column>
      <el-table-column prop="jobNum" sortable label="工号"></el-table-column>
      <el-table-column prop="department" sortable label="部门"></el-table-column>
      <el-table-column prop="address" label="操作" width="150" v-if="auth.indexOf('edit') !=-1 || auth.indexOf('del') !=-1">
        <template slot-scope="scope">
          <div>
            <el-button
              @click="openEidt(scope.row)"
              size="mini"
              v-if="auth.indexOf('edit') !=-1"
              plain
              type="primary"
              icon="el-icon-edit"
            ></el-button>
            <el-button
              @click="del(scope.row.id)"
              size="mini"
              v-if="auth.indexOf('del') !=-1"
              plain
              type="danger"
              icon="el-icon-delete"
            ></el-button>
            <!-- <el-button
                @click="openRole(scope.row.id)"
                size="mini"
                plain
                type="success"
                icon="el-icon-check"
            ></el-button>-->
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @current-change="currentchange"
      @size-change="sizechange"
      :current-page="pagenum"
      :page-sizes="[10, 20]"
      :page-size="pagesize"
      background
      layout="total, sizes, prev, pager, next,jumper"
      :total="total"
    ></el-pagination>
    <!-- 添加 -->
    <el-dialog title="用户信息" :visible.sync="addDialog">
      <el-form :model="adduser">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="adduser.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="座机" :label-width="formLabelWidth">
          <el-input v-model="adduser.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="adduser.mailbox" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="adduser.phoneNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工号" :label-width="formLabelWidth">
          <el-input v-model="adduser.jobNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-input v-model="adduser.department" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮件" :label-width="formLabelWidth">
          <el-input v-model="adduser.post" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="副邮件" :label-width="formLabelWidth">
          <el-input v-model="adduser.deputyPost" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="岗位" :label-width="formLabelWidth">
          <el-input v-model="adduser.jobLevel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="系统角色" :label-width="formLabelWidth">
          <el-input v-model="adduser.sysRole" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="adduser.passwd" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="用户信息" :visible.sync="editDialog">
      <el-form :model="edituser">
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="edituser.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="座机" :label-width="formLabelWidth">
          <el-input v-model="edituser.tel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" :label-width="formLabelWidth">
          <el-input v-model="edituser.mailbox" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="手机" :label-width="formLabelWidth">
          <el-input v-model="edituser.phoneNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="工号" :label-width="formLabelWidth">
          <el-input v-model="edituser.jobNum" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="部门" :label-width="formLabelWidth">
          <el-input v-model="edituser.department" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="邮件" :label-width="formLabelWidth">
          <el-input v-model="edituser.post" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="副邮件" :label-width="formLabelWidth">
          <el-input v-model="edituser.deputyPost" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="岗位" :label-width="formLabelWidth">
          <el-input v-model="edituser.jobLevel" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="系统角色" :label-width="formLabelWidth">
          <el-input v-model="edituser.sysRole" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" :label-width="formLabelWidth">
          <el-input v-model="edituser.passwd" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editUsers">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      search: "",
      tableData: [],
      formLabelWidth: "120px",
      addDialog: false,
      editDialog: false,
      adduser: {
        name: "",
        tel: "",
        mailbox: "",
        phoneNum: "",
        jobNum: "",
        department: "",
        post: "",
        deputyPost: "",
        jobLevel: "",
        sysRole: "",
        passwd: ""
      },
      edituser: {},
      // 分页的当前页
      pagenum: 1,
      // 分页的页容量
      pagesize: 10,
      // 数据的总条数
      total: 0,
      auth:'',
      systemUrl:''
    };
  },
  methods: {
    searchData() {
      // this.$axios.get("user/getAllUser").then(successResponse => {
      //   if (successResponse.status === 200) {
      //     this.tableData = successResponse.data.userInfoList;
      //     this.total = successResponse.data.userInfoList.length;
      //     var compare = function(obj1, obj2) {
      //       var val1 = obj1.department;
      //       var val2 = obj2.department;
      //       if (val1 < val2) {
      //         return -1;
      //       } else if (val1 > val2) {
      //         return 1;
      //       } else {
      //         return 0;
      //       }
      //     };
      //     this.tableData.sort(compare)
      //   }
      // });
      this.$axios({
        url:this.systemUrl + "user/getAllUser",
        method:'get',
      }).then(successResponse => {
          if (successResponse.status === 200) {
          this.tableData = successResponse.data.userInfoList;
          this.total = successResponse.data.userInfoList.length;
          var compare = function(obj1, obj2) {
            var val1 = obj1.department;
            var val2 = obj2.department;
            if (val1 < val2) {
              return -1;
            } else if (val1 > val2) {
              return 1;
            } else {
              return 0;
            }
          };
          this.tableData.sort(compare)
        }
      })
    },
    // 当页容量发生改变时，重新请求数据
    sizechange(size) {
      // 将 size 设置给 pageize
      this.pagesize = size;
      // 更新数据
      // this.searchData();
    },
    // 当当前页发生改变时，重新请求数据
    currentchange(num) {
      // 将 num 设置 pagenum
      this.pagenum = num;
      // 重新请求数据
      // this.searchData();
    },
    addUsers() {
      let param = new URLSearchParams();
      param.append('name', this.adduser.name)
      param.append('tel', this.adduser.tel)
      param.append('mailbox', this.adduser.mailbox)
      param.append('phoneNum', this.adduser.phoneNum)
      param.append('jobNum', this.adduser.jobNum)
      param.append('department', this.adduser.department)
      param.append('post', this.adduser.post)
      param.append('deputyPost', this.adduser.deputyPost)
      param.append('jobLevel', this.adduser.jobLevel)
      param.append('sysRole', this.adduser.sysRole)
      param.append('passwd', this.adduser.passwd)
      this.$axios({
        method:"post",
        url:this.systemUrl+ "user/addUserInfo", 
        data:param,
        }).then(res=>{
            alert('添加成功')
            this.addDialog = false;
            this.searchData();
        })
    },
    openEidt(row) {
      this.editDialog = true;
      this.edituser = row;
    },
    editUsers() {
      let param = new URLSearchParams();
      param.append('id', this.edituser.id)
      param.append('name', this.edituser.name)
      param.append('tel', this.edituser.tel)
      param.append('mailbox', this.edituser.mailbox)
      param.append('phoneNum', this.edituser.phoneNum)
      param.append('jobNum', this.edituser.jobNum)
      param.append('department', this.edituser.department)
      param.append('post', this.edituser.post)
      param.append('deputyPost', this.edituser.deputyPost)
      param.append('jobLevel', this.edituser.jobLevel)
      param.append('sysRole', this.edituser.sysRole)
      param.append('passwd', this.edituser.passwd)
      this.$axios({
        method:"post",
        url:this.systemUrl + "user/updateUserInfo",
        data:param,
        }).then(res => {
          alert('编辑成功')
          this.editDialog = false;
          this.searchData();
        });
    },
    del(id) {
      let param = new URLSearchParams();
      param.append('id', id)
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            method:"post",
            url:this.systemUrl + "user/delUserInfo",
            data:param,
            }).then(res => {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.searchData();
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    synchronization(){
      this.$axios
      .post(this.systemUrl + "user/delUserInfo",{})
      .then(successResponse =>{
        alert('同步成功')
      })
    }
  },
  mounted() {
    // let userName = JSON.parse(sessionStorage.getItem("userList")).name
    if(JSON.parse(sessionStorage.getItem("userList")) == null){
      this.$router.push("/login");
    } else{
      this.systemUrl = sessionStorage.getItem("systemUrl")
      this.searchData();
      let roleList = JSON.parse(sessionStorage.getItem("roleList")) ;
      let roleAuth = '';
      for(var i = 0;i<roleList.length;i++){
        if(roleList[i].moduleName == '用户管理'){
         roleAuth = roleList[i].auth
        }
      }
      if(roleAuth == '15'){
        this.auth = 'add;edit;del'
      } else if(roleAuth == '1'){
        this.auth = ''
      }
    }
  }
};
</script>
<style>
.myrow {
  margin-top: 15px;
}
</style>