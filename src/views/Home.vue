<template>
  <div>
    <el-container>
      <el-header class="homeHeader">
        <div class="head">
          云e办
        </div>
        <el-dropdown class="userInfo" @command="commandHandler">
              <span class="el-dropdown-link">
              {{ user.name }}}<i>
                <img :src="user.userFace">
              </i>
               </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="userinfo">个人中心</el-dropdown-item>
            <el-dropdown-item command="setting">设置</el-dropdown-item>
            <el-dropdown-item command="logout">注销登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-container>
        <el-aside width="200px">
          <el-menu router unique-opened>
            <el-submenu :index="index+''" v-for="(item,index) in routes"
                        :key="index" v-if="!item.hidden">
              <template slot="title">
                <i :class="item.iconCls" style="color: #0aeeee;margin-right: 5px"></i>
                <span>{{ item.name }}</span>
              </template>
              <el-menu-item
                :index="children.path"
                v-for="(children,index) in item.children" :key="index">
                {{ children.name }}
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-main>
          <el-breadcrumb separator-class="el-icon-arrow-right" v-if="this.$router.currentRoute.path!='/Home'">
            <el-breadcrumb-item :to="{ path: '/Home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>{{ this.$router.currentRoute.name }}</el-breadcrumb-item>
          </el-breadcrumb>
          <div class="homeWelcome" v-if="this.$router.currentRoute.path=='/Home'">
            欢迎来到云e办系统
          </div>
          <router-view class="homer outerView"/>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "Home",
  data() {
    return {
      user: JSON.parse(window.sessionStorage.getItem('user'))
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes;
    }
  },
  methods: {
    commandHandler(command) {
      if (command == 'logout') {
        this.$confirm('此操作将注销登录, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.postRequest('/logout');
          window.sessionStorage.removeItem('tokenStr');
          window.sessionStorage.removeItem('user');
          this.$store.commit('initRoutes', []);
          this.$router.replace('/')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消操作'
          });
        });
      }
    }
  }
}
</script>

<style>
.homeHeader {
  background: antiquewhite;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 15px;
  box-sizing: border-box;
}

.homeHeader.head {
  font-size: 30px;
  font-family: 宋体;
  color: white;
}

.homeHeader.userInfo {
  cursor: pointer;
}

.el-dropdown-link img {
  width: 48px;
  height: 48px;
  border-radius: 24px;
}

.homeWelcome {
  text-align: center;
  font-size: 30px;
  font-family: 宋体;
  color: #f10a0a;
  padding-top: 50px;
}

.homerouterView {
  margin-top: 20px;
}
</style>
