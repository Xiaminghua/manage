<template>
  <el-card>
    <mybread firstnav="用户管理" lastnav="系统配置" />
    <el-row>
      <el-col :span="24" style="text-align:right">
        <el-button type="success" @click="addDialog=true" v-if="auth.indexOf('add') !=-1">添加配置</el-button>
      </el-col>
    </el-row>
    <el-table :data="rolesList.slice((pagenum-1)*pagesize,pagenum*pagesize)" style="width: 100%;margin-top:20px;">
      <el-table-column prop="name" label="项目名称"></el-table-column>
      <el-table-column prop="port" label="端口"></el-table-column>
      <el-table-column prop="ipAddr" label="IP"></el-table-column>
      <el-table-column prop="version" label="版本"></el-table-column>
      <el-table-column label="操作" v-if="auth.indexOf('edit') !=-1 ||auth.indexOf('del') !=-1">
        <template slot-scope="scope">
          <el-button 
          size="mini" 
          plain 
          type="primary" 
          icon="el-icon-edit" 
          v-if="auth.indexOf('edit') !=-1"
          @click="edit(scope.row)"
          ></el-button>
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            v-if="auth.indexOf('del') !=-1"
            @click="del(scope.row.id)"
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
    <el-dialog title="添加配置" :visible.sync="addDialog">
      <el-form :model="addModule">
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="addModule.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="端口" :label-width="formLabelWidth">
          <el-input v-model="addModule.port" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="IP" :label-width="formLabelWidth">
          <el-input v-model="addModule.ipAddr" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本" :label-width="formLabelWidth">
          <el-input v-model="addModule.version" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addSystem">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog title="编辑配置" :visible.sync="editDialog">
      <el-form :model="editModule">
        <el-form-item label="项目名称" :label-width="formLabelWidth">
          <el-input v-model="editModule.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="端口" :label-width="formLabelWidth">
          <el-input v-model="editModule.port" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="IP" :label-width="formLabelWidth">
          <el-input v-model="editModule.ipAddr" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="版本" :label-width="formLabelWidth">
          <el-input v-model="editModule.version" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
        <el-button type="primary" @click="editSystem">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      rolesList: [],
      addDialog: false,
      editDialog: false,
      addModule: {
        name: "",
        port: "",
        ipAddr: "",
        version: ""
      },
      formLabelWidth: "120px",
      editModule: {},
      pagenum:1,
      pagesize: 10,
      total: 0,
      auth:"",
      systemUrl:''
    };
  },
  methods: {
    searchData(){
      this.$axios.get(this.systemUrl + `conf/getAppConfList`).then(successResponse => {
        if (successResponse.status === 200) {
          this.rolesList = successResponse.data.appConfInfoList;
          this.total = successResponse.data.appConfInfoList.length;
        }
      });
    },
    addSystem() {
      let param = new URLSearchParams();
      param.append('name',this.addModule.name)
      param.append('ipAddr',this.addModule.ipAddr)
      param.append('port',this.addModule.port)
      param.append('version',this.addModule.version)
      this.$axios({
         method:"post",
         url:this.systemUrl + "conf/addAppConfInfo",
          data: param,
        })
        .then(successResponse => {
          this.addDialog = false;
          this.searchData();
          //   if (successResponse.data.code === 200) {
          // localStorage.setItem('username',this.ruleForm.username);
          //     this.$router.replace({ path: "/users" });
          //   }
        });
    },
    edit(row) {
      this.editDialog = true;
      this.editModule = row;
    },
    editSystem() {
      let param = new URLSearchParams();
      param.append('id', this.editModule.id)
      param.append('name', this.editModule.name)
      param.append('ipAddr', this.editModule.ipAddr)
      param.append('port', this.editModule.port)
      param.append('version', this.editModule.version)
      this.$axios({
        method:"post",
        url:this.systemUrl + "conf/updateAppConfInfo",
        data:param
      }).then(successResponse => {
        this.editDialog = false;
        this.searchData();
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
    del(id) {
      let param = new URLSearchParams();
      param.append('id', id)
      this.$confirm("此操作将永久删除, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$axios({
          method:"post",
          url:this.systemUrl + "conf/delAppConfInfo",
          data:param
        }).then(res => {
          this.$message({
            type: "success",
            message: "删除成功"
          });
          this.searchData();
        })
          
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
    // let userName = JSON.parse(sessionStorage.getItem("userList")).name;
    if (JSON.parse(sessionStorage.getItem("userList")) == null) {
      this.$router.push("/login");
    } else{
      this.systemUrl = sessionStorage.getItem("systemUrl")
      this.searchData();
      let roleList = JSON.parse(sessionStorage.getItem("roleList")) ;
      let roleAuth = '';
      for(var i = 0;i<roleList.length;i++){
        if(roleList[i].moduleName == '系统配置'){
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