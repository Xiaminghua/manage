<template>
  <el-menu
    :router="true"
    :unique-opened="true"
    default-active="2"
    class="el-menu-vertical-demo mymenu">
    <!-- <el-submenu v-for="item1 in root1" :key="item1.id" :index="item1.path">
      <template slot="title">
        <i :class="item1.class"></i>
        <span>{{item1.name1}}</span>
      </template>
      <el-menu-item v-for="item2 in item1.children" :key="item2.id" :index="item2.path">
        <i :class="item2.class"></i>
        <span>{{item2.title}}</span>
      </el-menu-item>
    </el-submenu>-->
    <!--一级菜单-->
    <template>
      <el-submenu v-for="item in root1" :index="item.path" :key="item.path">
        <template slot="title">
          <i :class="item.class"></i>
          <span>{{item.name1}}</span>
        </template>
        <!-- 二级菜单 -->
        <template v-for="itemChild in item.children">
          {{itemChild.children.title}}
          <el-submenu
            v-if="itemChild.children[0].title !== ''"
            :index="itemChild.path"
            :key="itemChild.path"
          >
            <template slot="title">
              <span>{{itemChild.title}}</span>
            </template>
            <!-- 三级菜单 -->
            <el-menu-item v-for="itemChild_Child in itemChild.children" :index="itemChild_Child.path"  :key="itemChild_Child.path">
              <i :class="itemChild_Child.class"></i>
              <span>{{itemChild_Child.title}}</span>
            </el-menu-item>
          </el-submenu>
          <el-menu-item v-else :index="itemChild.path" :key="itemChild.path">
            <i :class="itemChild.class"></i>
            <span slot="title">{{itemChild.title}}</span>
          </el-menu-item>
        </template>
      </el-submenu>
    </template>
  </el-menu>
</template>
<script>
export default {
  data() {
    return {
      list: [
        {
          name1: "系统管理",
          name2: "用户管理",
          name3: '',
          path: "/users",
          class: "el-icon-user-solid"
        },
        {
          name1: "系统管理",
          name2: "权限管理",
          name3: '',
          path: "/roles",
          class: "el-icon-user-solid"
        },
        {
          name1: "系统管理",
          name2: "操作日志",
          name3: '',
          path: "/journal",
          class: "el-icon-s-tools"
        },
        {
          name1: "系统管理",
          name2: "系统配置",
          name3: '',
          path: "/system",
          class: "el-icon-s-tools"
        },
        {
          name1: "数据可视化",
          name2: "资管条线规模收入",
          path: "/scaleIncome",
          class: "el-icon-s-platform"
        },
        {
          name1: "1",
          name2: "1",
          name3: "1",
          path: "/scaleIncome",
          class: "el-icon-s-platform"
        }
      ],
      data: [],
      root1: [],
      rolesList: [],
      systemUrl: ""
    };
  },
  methods: {
    // 登录获取用户所有权限
    async getRightsList() {
      let username = JSON.parse(sessionStorage.getItem("userList")).name;
      this.$axios
        .get(this.systemUrl + `login/getUserAuthInfo?userName=${username}`)
        .then(successResponse => {
          this.data = successResponse.data.authInfoList;
          sessionStorage.setItem("roleList", JSON.stringify(this.data));
          for (var i = 0; i < this.list.length; i++) {
            for (var j = 0; j < this.data.length; j++) {
              if (this.list[i].name2 == this.data[j].moduleName) {
                this.data[j] = this.list[i];
              }
            }
          }
          var compare = function(obj1, obj2) {
            var val1 = obj1.name1;
            var val2 = obj2.name1;
            if (val1 < val2) {
              return 1;
            } else if (val1 > val2) {
              return -1;
            } else {
              return 0;
            }
          };
          this.data = this.data.sort(compare);
          console.log(this.data)
          this.treeData(this.data);
        });
    },
    getSystem() {
      this.$axios.get(`conf/getAppConfList`).then(successResponse => {
        if (successResponse.status === 200) {
          this.rolesList = successResponse.data.appConfInfoList;
        }
      });
    },
    treeData(data) {
      var code1 = "-1";
      var code2 = "-1";
      // var root1 = []
      var rootData1 = {};
      var tmp1 = -1;
      var tmp2 = -1;
      for (var info of data) {
        if (code1 != info.name1) {
          rootData1 = {
            name1: info.name1,
            id: tmp1,
            path: info.path,
            children: [
              {
                title: info.name2,
                id: tmp1 + tmp2,
                path: info.path,
                class: info.class,
                children: [
                  {
                    title: info.name3,
                    id: tmp1 + tmp2 + tmp2,
                    path: info.path,
                    class: info.class
                  }
                ]
              }
            ]
          };
          this.root1.push(rootData1);
          code1 = info.name1;
          code2 = info.name2;
          tmp1++;
          tmp2 = 0;
        } else {
          var children = this.root1[tmp1].children;
          if (code2 == info.name2) {
            var children2 = children[tmp2].children;
            children2.push({
              title: info.name3,
              id: tmp1 + tmp2 + tmp2,
              path: info.path,
              class: info.class
            });
            children[tmp2].children = children2;
          } else {
            children.push({
              title: info.name2,
              id: tmp1 + tmp2,
              path: info.path,
              class: info.class,
              children: [
                {
                  title: info.name3,
                  id: tmp1 + tmp2 + tmp2,
                  path: info.path,
                  class: info.class
                }
              ]
            });
            rootData1.children = children;
            this.root1[tmp1] = rootData1;
            tmp2++;
          }
          code2 = info.name2;
          code1 = info.name1;
        }
      }
      return this.root1;
      // this.data1 = root1;
    }
  },
  mounted() {
    this.systemUrl = sessionStorage.getItem("systemUrl");
    this.getRightsList();
    console.log(this.root1);
  }
};
</script>
<style>
/* 侧边栏样式 */

.mymenu {
  height: 100%;
  /* background-color: lightblue; */
}
</style>