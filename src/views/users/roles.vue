<template>
  <el-card>
    <mybread firstnav="用户管理" lastnav="用户权限" />
    <el-row>
      <el-col :span="24" style="text-align:right">
        <el-button type="success" @click="addDialog=true" v-if="auth.indexOf('add') !=-1">添加模块</el-button>
      </el-col>
    </el-row>
    <el-table :data="rolesList.slice((pagenum-1)*pagesize,pagenum*pagesize)" style="width: 100%;margin-top:20px;">
      <el-table-column prop="appName" label="模块名称"></el-table-column>
      <el-table-column prop="moduleName" label="模块菜单"></el-table-column>
      <el-table-column prop="funcName" label="模块内容"></el-table-column>
      <el-table-column prop="auth" label="按钮权限"></el-table-column>
      <el-table-column label="操作" v-if="auth.indexOf('edit') !=-1 ||auth.indexOf('del') !=-1">
        <template slot-scope="scope">
          <el-button 
          size="mini" 
          plain 
          type="primary" 
          icon="el-icon-edit" 
          @click="edit(scope.row)" 
          v-if="auth.indexOf('edit') !=-1"
          ></el-button>
          <el-button 
          size="mini" 
          plain 
          type="danger" 
          icon="el-icon-delete" 
          @click="del(scope.row.id)" 
          v-if="auth.indexOf('del') !=-1"
          ></el-button>
          <el-button
            @click="openRole(scope.row)"
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            v-if="auth.indexOf('edit') !=-1"
          ></el-button>
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
      <el-form :model="addModule">
        <el-form-item label="模块名称" :label-width="formLabelWidth">
          <el-input v-model="addModule.appName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模块菜单" :label-width="formLabelWidth">
          <el-input v-model="addModule.moduleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模块内容" :label-width="formLabelWidth">
          <el-input v-model="addModule.funcName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="按钮权限" :label-width="formLabelWidth">
          <el-input v-model="addModule.auth" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="用户信息" :visible.sync="editDialog">
      <el-form :model="editModule">
        <el-form-item label="模块名称" :label-width="formLabelWidth">
          <el-input v-model="editModule.appName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模块菜单" :label-width="formLabelWidth">
          <el-input v-model="editModule.moduleName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="模块内容" :label-width="formLabelWidth">
          <el-input v-model="editModule.funcName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="按钮权限" :label-width="formLabelWidth">
          <el-input v-model="editModule.auth" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editRole">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 分配 -->
    <el-dialog title="分配权限" :visible.sync="roleDialog">
      <el-tree
        :data="root1"
        show-checkbox
        :default-expand-all="false"
        node-key="id"
        ref="tree"
        highlight-current
        :props="defaultProps"
      ></el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      total: "",
      roleDialog: false,
      formLabelWidth:'120px',
      root1: [],
      data: [],
      defaultProps: {
        children: "children",
        label: "label"
      },
      addDialog:false,
      editDialog:false,
      addModule:{
        appName:"",
        moduleName:'',
        funcName:'',
        auth:""
      },
      roluName:[],
      editModule:{},
      userList:[],
      pagenum:1,
      pagesize: 10,
      total: 0,
      auth:'',
      systemUrl:''
    };
  },
  methods: {
    searchData() {
      let username = sessionStorage.getItem('username');
      this.$axios.get(this.systemUrl + `auth/getAuthInfoList?userName=${username}`).then(successResponse => {
        if (successResponse.status === 200) {
          this.rolesList = successResponse.data.authInfoList;
          this.total = successResponse.data.authInfoList.length;
        }
      });
    },
    searchList() {
      this.$axios.get(this.systemUrl + "user/getAllUser").then(successResponse => {
        if (successResponse.status === 200) {
          this.data = successResponse.data.userInfoList;
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
          this.data.sort(compare)
          this.treeData(this.data);
        }
      });
    },
    openRole(row) {
      this.userList = [];
      this.roleDialog = true;
      this.editModule = row
      if(row.userList == null){
        this.userList = []
      } else{
        let list = row.userList.split(';')
        for(var i = 0;i<this.data.length;i++){
          for(var j = 0;j<list.length;j++){
            if(list[j] == this.data[i].name){
              // userList[j].id = this.data[i].id
              this.userList.push({id:this.data[i].id,label:this.data[i].name})
            }
          }
        }
      }
      this.$nextTick(function(){
        this.$refs.tree.setCheckedNodes(this.userList);
      })
      
    },
    currentchange(num) {
      // 将 num 设置 pagenum
      this.pagenum = num;
      // 重新请求数据
      // this.searchData();
    },
    // 当页容量发生改变时，重新请求数据
    sizechange(size) {
      // 将 size 设置给 pageize
      this.pagesize = size;
      // 更新数据
      // this.searchData();
    },
    treeData(data) {
      var code1 = "-1";
      var code2 = "-1";
      // var root1 = []
      var rootData1 = {};
      var tmp1 = -1;
      var tmp2 = -1;
      for (var info of data) {
        if (code1 != info.department) {
          rootData1 = {
            label: info.department,
            id: tmp1,
            children: [
              {
                label: info.name,
                id:info.id
              }
            ]
          };
          this.root1.push(rootData1);
          code1 = info.department;
          code2 = info.name;
          tmp1++;
          tmp2 = 0;
        } else {
          var children = this.root1[tmp1].children;
          if (code2 == info.name) {
            var children2 = children[tmp2].children;
            // children2.push({
            //   label: info.name3,
            //   id: tmp1 + tmp2 + tmp2,
            // });
            // children[tmp2].children = children2;
          } else {
            children.push({
              label: info.name,
              id: info.id,
            });
            rootData1.children = children;
            this.root1[tmp1] = rootData1;
            tmp2++;
          }
          code2 = info.name;
          code1 = info.department;
        }
      }
      return this.root1;
      // this.data1 = root1;
    },
    // 添加模块
    addUsers() {
      let param = new URLSearchParams();
      let userName = JSON.parse(sessionStorage.getItem("userList")).name
      param.append('userName',userName)
      param.append('appName', this.addModule.appName)
      param.append('moduleName', this.addModule.moduleName)
      param.append('funcName', this.addModule.funcName)
      param.append('auth', this.addModule.auth)
      this.$axios({
         method:"post",
         url:this.systemUrl + "auth/addAuthInfo",
          data: param,
        })
        .then(successResponse => {
          this.addDialog = false;
          this.searchData()
          //   if (successResponse.data.code === 200) {
          //     localStorage.setItem('username',this.ruleForm.username);
          //     this.$router.replace({ path: "/users" });
          //   }
        });
    },
    setRights() {
      this.roluName = [];
      var names = this.$refs.tree.getCheckedNodes();
      let userList = '';
      for(var i = 0;i<names.length;i++){
        if(names[i].label !== '' && names[i].label.indexOf('部')==-1 && names[i].label.indexOf('办公室')==-1
        && names[i].label.indexOf('董事长')==-1&& names[i].label.indexOf('检查组')==-1&& names[i].label.indexOf('团队')==-1){
          this.roluName.push(names[i].label)
          userList  += names[i].label +';'
        }
      }
      // this.roluName = this.roluName.replace(/,/g,';')
      let userName = JSON.parse(sessionStorage.getItem("userList")).name
      let param = new URLSearchParams();
      param.append('id', this.editModule.id)
      param.append('appName', this.editModule.appName)
      param.append('moduleName', this.editModule.moduleName)
      param.append('funcName', this.editModule.funcName)
      param.append('userList', userList)
      param.append('userName', userName)
      this.$axios({
         method:"post",
         url:this.systemUrl + "auth/updateAuthInfo",
          data: param,
        })
        .then(successResponse => {
          this.roleDialog = false;
        });
    },
    edit(row) {
      this.editDialog = true;
      this.editModule = row;
    },
    editRole() {
      let userName = JSON.parse(sessionStorage.getItem("userList")).name
      let param = new URLSearchParams();
      param.append('id', this.editModule.id)
      param.append('appName', this.editModule.appName)
      param.append('moduleName', this.editModule.moduleName)
      param.append('funcName', this.editModule.funcName)
      param.append('auth', this.editModule.auth)
      param.append('userList', this.editModule.userList)
      param.append('userName', userName)
      this.$axios({
         method:"post",
         url:this.systemUrl + "auth/updateAuthInfo",
          data: param,
        })
        .then(successResponse => {
          this.editDialog = false;
        });
    },
    del(id) {
      let userName = JSON.parse(sessionStorage.getItem("userList")).name
      let param = new URLSearchParams();
      param.append('id', id)
      param.append('userName', userName)
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            method:"post",
            url:this.systemUrl + "auth/delAuthInfo",
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
    }
  },
  mounted() {
    // let userName = JSON.parse(sessionStorage.getItem("userList")).name
    if(JSON.parse(sessionStorage.getItem("userList")) == null){
      this.$router.push("/login");
    } else{
      this.systemUrl = sessionStorage.getItem("systemUrl")
      this.searchList();
      this.searchData()
      let roleList = JSON.parse(sessionStorage.getItem("roleList")) ;
      let roleAuth = '';
      for(var i = 0;i<roleList.length;i++){
        if(roleList[i].moduleName == '权限管理'){
          roleAuth = roleList[i].auth
        }
      }
      if(roleAuth == '15'){
        this.auth = 'add;edit;del'
      } else if (roleAuth == '1') {
         this.auth = ''
      }
    };
  }
};
</script>