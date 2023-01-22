<template>
  <div style="width: 500px">
    <el-input
      placeholder="输入部门名称进行搜素..."
      prefix-icon="el-icon-search"
      v-model="filterText">
    </el-input>
    <el-tree
      class="filter-tree"
      :data="deps"
      :props="defaultProps"
      :filter-node-method="filterNode"
      :expand-on-click-node="false"
      ref="tree">
       <span class="custom-tree-node" slot-scope="{ node, data }"
             style="display: flex;justify-content:space-between;width: 100%">
        <span>{{ data.name }}</span>
        <span>
          <el-button
            type="primary"
            size="mini"
            class="depBth"
            @click="() => showAddDep(data)">
            添加部门
          </el-button>
          <el-button
            type="danger"
            size="mini"
            class="depBth"
            @click="() => showDeleDep(data)">
            删除部门
          </el-button>
        </span>
      </span>
    </el-tree>
    <el-dialog
      title="添加部门"
      :visible.sync="dialogVisible"
      width="30%">
      <div>
        <table>
          <tr>
            <td>
              <el-tag>上级部门</el-tag>
            </td>
            <td>{{ pname }}</td>
          </tr>
          <tr>
            <td>
              <el-tag>
                部门名称
              </el-tag>
            </td>
            <td>
              <el-input v-model="dep.name" placeholder="请输入部门名称..."></el-input>
            </td>
          </tr>
        </table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="doaddDep">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "DepMana",
  data() {
    return {
      filterText: '',
      deps: [],
      defaultProps: { // 树形控件
        children: 'children',
        label: 'name' // 绑定数据 :name="r.id"
      },
      dialogVisible: false,
      dep: {
        name: '',
        parentId: '-1',
      },
      pname: ''
    }
  },
  mounted() {
    this.initDeps();
  },
  methods: {
    initDep() {
      this.dep = {
        name: '',
        parentId: -1
      }
      this.pname = '';
    },
    addDep2(deps, dep) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == dep.parentId) {
          d.children = d.children.concat(dep);
          if (d.children.length > 0) {
            d.isParent = true;
          }
          return;
        } else {
          this.addDep2(d.children, dep);
        }
      }
    },
    doaddDep() {
      this.postRequest('/sys/basic/department/add', this.dep).then(resp => {
        if (resp) {
          this.addDep2(this.deps, resp.obj);
          this.dialogVisible = false;
          this.initDep();
        }
      })
    },
    initDeps() {
      this.getRequest('/sys/basic/department/').then(resp => {
        if (resp) {
          this.deps = resp;
        }
      })
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    showAddDep(data) {
      this.dep.parentId = data.id;
      this.pname = data.name;
      this.dialogVisible = true;
    },
    removeDep2(p, deps, id) {
      for (let i = 0; i < deps.length; i++) {
        let d = deps[i];
        if (d.id == id) {
          deps.splice(i, 1);
          if (deps.length == 0) {
            p.isParent = false;
          }
          return;
        } else {
          this.removeDep2(d, d.children, id);
        }
      }
    },
    showDeleDep(data) {
      if (data.isParent) {
        this.$message.error('父部门删除失败');
      } else {
        this.$confirm('此操作将永久删除该[' + data.name + ']部门, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.postRequest('/sys/basic/department/' + data.id).then(resp => {
            if (resp) {
              this.removeDep2(null, this.deps, data.id);
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    }
  }
}
</script>

<style scoped>
.depBth {
  padding: 2px;
}
</style>
