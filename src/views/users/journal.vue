<template>
  <el-card>
    <mybread firstnav="用户管理" lastnav="操作日志" />
    <el-row>
      <el-col :span="5" style="margin-top:20px;">
        <el-date-picker v-model="value1" type="date" placeholder="选择日期时间"></el-date-picker>
      </el-col>
      <el-col :span="2" style="margin-top:20px;margin-left:15px;">
        <el-button type="primary" style="margin-left: 15px;">查询</el-button>
      </el-col>
      <el-col :span="16" style="text-align:right;margin-top:20px;">
        <el-button type="success" @click="addDialog=true" v-if="auth.indexOf('add') !=-1">添加</el-button>
      </el-col>
    </el-row>
    <el-table :data="tableData.slice((pagenum-1)*pagesize,pagenum*pagesize)" style="width: 100%">
      <el-table-column prop="time" label="日期" width="200"></el-table-column>
      <el-table-column prop="userName" label="姓名" width="200"></el-table-column>
      <el-table-column prop="appName" label="模块名称"></el-table-column>
      <el-table-column prop="moduleName" label="模块菜单"></el-table-column>
      <el-table-column prop="funcName" label="模块内容"></el-table-column>
      <el-table-column prop="operate" label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="openMessage(scope.row)">{{scope.row.operate}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="设置" v-if="auth.indexOf('del') !=-1">
        <template slot-scope="scope">
          <el-button
            size="mini"
            v-if="auth.indexOf('del') !=-1"
            plain
            type="danger"
            icon="el-icon-delete"
            @click="del(scope.row)"
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
    <!-- 查看 -->
    <el-dialog title="操作信息" :visible.sync="dialogTableVisible">
    <el-table :data="userData">
    <el-table-column property="appName" label="模块名称" width="150"></el-table-column>
    <el-table-column property="moduleName" label="模块菜单" width="200"></el-table-column>
    <el-table-column property="funcName" label="模块内容"></el-table-column>
    <el-table-column property="auth" label="按钮操作"></el-table-column>
    <el-table-column property="userList" label="用户名"></el-table-column>
  </el-table>
</el-dialog>
    <!-- 添加 -->
    <el-dialog title="添加信息" :visible.sync="addDialog">
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
        <el-form-item label="用户名" :label-width="formLabelWidth">
          <el-input v-model="addModule.userName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称" :label-width="formLabelWidth">
          <el-input v-model="addModule.tableName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作" :label-width="formLabelWidth">
          <el-input v-model="addModule.operate" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addJournal">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>
<script>
export default {
  data() {
    return {
      formLabelWidth:'120px',
      value1: "",
      tableData:[],
      addDialog:false,
      pagenum:1,
      pagesize: 10,
      total: 0,
      addModule:{
        appName:"",
        moduleName:"",
        funcName:"",
        userName:"",
        tableName:"",
        operate:""
      },
      delModule:{},
      dialogTableVisible:false,
      userData:[],
      auth:'',
      systemUrl:''
    };
  },
  methods:{
    searchData(){
      this.$axios.get(this.systemUrl + `log/getOptLogInfoList`).then(successResponse => {
        if (successResponse.status === 200) {
          this.tableData = successResponse.data.optLogInfoList;
          this.total = successResponse.data.optLogInfoList.length;
        }
      });
    },
    // 当当前页发生改变时，重新请求数据
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
    addJournal() {
      let param = new URLSearchParams();
      param.append('appName', this.addModule.appName);
      param.append('moduleName', this.addModule.moduleName);
      param.append('funcName', this.addModule.funcName);
      param.append('userName', this.addModule.userName);
      param.append('tableName', this.addModule.tableName);
      param.append('operate', this.addModule.operate);
      this.$axios({
         method:"post",
         url:this.systemUrl + "log/addOptLogInfo",
          data: param,
        })
        .then(successResponse => {
          this.addDialog = false;
          this.searchData()
          //   if (successResponse.data.code === 200) {
          // localStorage.setItem('username',this.ruleForm.username);
          //     this.$router.replace({ path: "/users" });
          //   }
        });
    },
    del(row) {
      this.delModule = row;
      let param = new URLSearchParams();
      param.append('id', this.delModule.id)
      param.append('tableName', this.delModule.tableName)
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios({
            method:"post",
            url:this.systemUrl + "log/delOptLogInfo",
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
    openMessage(row){
      this.userData = []
      this.dialogTableVisible = true;
      let name = row.moduleName;
      this.$axios.get(this.systemUrl + `log/getLogOptDetail?id=${row.id}&tableName=${row.tableName}`)
      .then(successResponse => {
        this.userData.push(successResponse.data.logOptDetail)
      });
    }
  },
  mounted(){
    // let userName = JSON.parse(sessionStorage.getItem("userList")).name;
    if (JSON.parse(sessionStorage.getItem("userList")) == null) {
      this.$router.push("/login");
    } else {
      this.systemUrl = sessionStorage.getItem("systemUrl")
      this.searchData();
      let roleList = JSON.parse(sessionStorage.getItem("roleList")) ;
      let roleAuth = '';
      for(var i = 0;i<roleList.length;i++){
        if(roleList[i].moduleName == '操作日志'){
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