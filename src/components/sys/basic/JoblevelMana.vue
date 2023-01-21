<template>
  <div>
    <div>
      <el-input size="small" v-model="jl.name" placeholder="添加职称名称..."
                prefix-icon="el-icon-plus" style="width: 300px"></el-input>
      <el-select v-model="jl.titleLevel" placeholder="职称等级" size="small"
                 style="margin-left: 5px; margin-right: 5px">
        <el-option
            v-for="item in titleLevels"
            :key="item"
            :label="item"
            :value="item">
        </el-option>
      </el-select>
      <el-button size="small" type="primary" icon="el-icon-plus" @click="addJobLevel" @Click="addJobLevel">添加
      </el-button>
    </div>
    <div style="margin-top: 10px">
      <el-table
          :data="jls"
          stripe
          border
          size="small"
          style="width: 100%"
          @selection-change="handleSelectionChange">
        <el-table-column
            type="selection"
            width="55">
        </el-table-column>
        <el-table-column
            prop="id"
            label="编号"
            width="180">
        </el-table-column>
        <el-table-column
            prop="name"
            label="支撑名称"
            width="150">
        </el-table-column>
        <el-table-column
            prop="titleLevel"
            label="职称等级"
            width="150">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建日期"
            width="150">
        </el-table-column>
        <el-table-column
            prop="enabled"
            label="是否启用"
            width="150">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.enabled" type="success">已启用</el-tag>
            <el-tag v-else type="danger">已启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column
            label="操作"
            width="150">
          <template slot-scope="scope">
            <el-button size="small" type="primary" @click="showEditView(scope.row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deletehHandler(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button type="danger" size="small" style="margin-top: 8px"
                 :disabled="this.multipleSelection==0"
                 @click="deleteMany">批量删除
      </el-button>
    </div>
    <el-dialog
        title="编辑职称"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose">
      <table>
        <tr>
          <td>
            <el-tab>职称名称</el-tab>
          </td>
          <td>
            <el-input v-model="updateJl.name" size="small"></el-input>
          </td>
        </tr>
        <tr>
          <td>
            <el-tab>职称等级</el-tab>
          </td>
          <td>
            <el-select v-model="updateJl.titleLevel" placeholder="职称等级" size="small"
                       style="margin-left: 5px; margin-right: 5px">
              <el-option
                  v-for="item in titleLevels"
                  :key="item"
                  :label="item"
                  :value="item">
              </el-option>
            </el-select>
          </td>
        </tr>
        <tr>
          <td>
            <el-tag>是否启用</el-tag>
          </td>
          <td>
            <el-switch
                style="display: block"
                v-model="updateJl.enabled"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="已启用"
                inactive-text="未启用">
            </el-switch>
          </td>
        </tr>
      </table>
      <span slot="footer" class="el-dialog-footer">
        <el-button @click="dialogVisible = false ">取消</el-button>
        <el-button type="primary" @click="doUpdata">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "JoblevelMana",
  data() {
    return {
      jl: {
        name: '',
        titleLevel: ''
      },
      updateJl: {
        name: '',
        titleLevel: '',
        enabled: false
      },
      titleLevels: [
        '正高级',
        '副高级',
        '中级',
        '初级',
        '员级'
      ],
      jls: [],
      dialogVisible: false,
      multipleSelection: []
    }
  },
  mounted() {
    this.initJls()
  },
  methods: {
    deleteMany(){
      this.$confirm('此操作将永久删除[' + this.multipleSelection.length + ']条职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids='?'
        this.multipleSelection.forEach(item=>{
          ids+='ids='+item.id+'&';
        });
        this.deleteRequest('/sys/basic/joblevel/' + ids).then(resp => {
          if (resp) {
            this.initPositions();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    doUpdata() {
      this.putRequest('/sys/basic/joblevel/', this.updateJl).then(resp => {
        if (resp) {
          this.initJls();
          this.dialogVisible = false;
        }
      })
    },
    showEditView(data) {
      Object.assign(this.updateJl, data);
      this.updateJl.createDate = '';
      this.dialogVisible = true;
    },
    deletehHandler(data) {
      this.$confirm('此操作将永久删除[' + data.name + ']职位, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest('/sys/basic/joblevel/' + data.id).then(resp => {
          if (resp) {
            this.initJls();
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addJobLevel() {
      if (this.jl.name && this.jl.titleLevel) {
        this.postRequest('/sys/basic/joblevel/', this.jl).then(resp => {
          if (resp) {
            this.initJls();
          }
        })
      } else {
        this.$message.error('字段不能为空!');
      }
    },
    initJls() {
      this.getRequest('/sys/basic/joblevel/').then(resp => {
        if (resp) {
          this.jls = resp;
          this.jl.name = '';
          this.jl.titleLevel = '';
        }
      })
    }
  }
}
</script>

<style scoped>

</style>
