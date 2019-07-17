<template>
  <div class="container">
    <el-tree :data="data" :props="defaultProps" accordion @node-click="handleNodeClick"></el-tree>
    <!-- 表格树element@2.7.0 -->
    <el-table
      :data="tableData"
      ref='multipleTable'
      style="width: 100%;margin-bottom: 20px;"
      @selection-change="handleSelectionChange"
      lazy
      :load="load"
      border
      row-key="id">
      <el-table-column
        :selectable='checkboxInit'
        type="selection"
        width="55">
      </el-table-column>
      <el-table-column
        prop="date"
        label="日期"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        label="姓名"
        sortable
        width="180">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },

        tableData: [{
          id: 1,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 2,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          id: 3,
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
          children: [{
            id: 31,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1500 弄',isSelect:true
          }, {
            id: 32,
            date: '2016-05-01',
            name: '王小虎',
            address: '上海市普陀区金沙江路 1501 弄',isSelect:true
          }]
        }, {
          id: 4,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      };
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      },
      handleSelectionChange(val) {
        console.log(val)
      },
      checkboxInit(row, index) {
        if (row.isSelect === true) {
          return false;
        } else {
          return true;
        }
      },
      load(tree, treeNode, resolve) {
        console.log(tree,treeNode)
        this.$refs.multipleTable.toggleRowSelection(tree, false);
        if(!treeNode.expanded){
          tree.isSelect=true;
          tree.children.forEach(item=>{
            item.isSelect = false;
          })
        }else{
          tree.isSelect=false;
          tree.children.forEach(item=>{
            item.isSelect = true;
          })
        }
        resolve([]);
      }
    }
  };
</script>
