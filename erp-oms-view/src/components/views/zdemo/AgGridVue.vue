<!--快速退货入库 尘音-->
<template>
  <div id="agGrid">
    <el-button type="primary" @click="channelBtn">change</el-button>
    <ag-grid-vue style="width: 100%; height: 350px;" class="ag-theme-balham" id="myGrid"
                 :gridOptions="gridOptions"
                 :columnDefs="columnDefs"
                 :rowData="rowData"
                 :pinnedBottomRowData="pinnedBottomRowData"
                 :firstDataRendered="onFirstDataRendered">
    </ag-grid-vue>
  </div>
</template>
<script>
  import Vue from "vue";
  import {AgGridVue} from "ag-grid-vue";
  let SquareComponent = Vue.extend({
    template: '<span>{{ valueSquared() }}</span>',
    methods: {
      valueSquared() {
        return this.params.value * this.params.value;
      }
    }
  });
  export default {
    data() {
      return {
        gridOptions: null,
        columnDefs: null,
        rowData: null,
        pinnedBottomRowData:null,
      }
    },
    components: {
      'ag-grid-vue': AgGridVue,
      RowFn:{
        template:'<span>{{params.node.rowIndex+1}}</span>'
      },
      'CubeComponent': {
        template: '<span>{{ valueCubed() }}</span>',
        methods: {
          valueCubed() {
            return this.params.value * this.params.value * this.params.value;
          }
        }
      },
      ParamsComponent: {
        template: `<div>
           <span v-if="params.value != 'Row 0'" @click="valueCubed">Field: {{params.colDef.field}}, Value: {{params.value}}</span>
       </div>`,
        methods: {
          valueCubed() {
            //return this.params.value * this.params.value * this.params.value;
            console.log(this.params);
          }
        }
      },
      ChildMessageComponent: {
        template: '<span><el-button style="height: 20px" @click="invokeParentMethod">Invoke Parent</el-button></span>',
        methods: {
          invokeParentMethod() {
            //console.log(this.params);
            console.log(this.params.context.rowData);
            //this.params.context.componentParent.methodFromParent(`Row: ${this.params.node.rowIndex}, Col: ${this.params.colDef.headerName}`)
          }
        }
      }
    },
    methods: {
      createRowData() {
        const rowData = [];

        for (let i = 0; i < 15; i++) {
          rowData.push({
            row: "Row " + i,
            value: i,
            currency: i + Number(Math.random().toFixed(2))
          });
        }

        this.rowData = rowData;
        console.log(this.rowData);
        setTimeout(()=>{
          //this.gridOptions.setPinnedBottomRowData([{}]);
          this.pinnedBottomRowData = [{}]
        },1000)
      },
      createColumnDefs() {
        this.columnDefs = [
          {headerName: "Row", field: "row", width: 100,suppressToolPanel:true,lockPosition: true,headerCheckboxSelection:true,checkboxSelection:true ,cellRendererFramework: 'RowFn',},
          {
            headerName: "Square",
            field: "value",
            cellRendererFramework: SquareComponent,
            width: 100
          },
          {
            headerName: "Cube",
            field: "value",
            cellRendererFramework: 'CubeComponent',
            width: 100
          },
          {
            headerName: "Row Params",
            field: "row",
            cellRendererFramework: 'ParamsComponent',
            width: 215
          },
          {
            headerName: "Currency (Filter)",
            field: "currency",
            cellRendererFramework: 'ParamsComponent',
            width: 135
          },
          {
            headerName: "Child/Parent",
            field: "value",
            cellRendererFramework: 'ChildMessageComponent',
            width: 120
          }
        ];
      },
      methodFromParent(cell) {
        console.log(this.rowData);
        //alert(`"Parent Component Method from ${cell}!`);
      },
      onFirstDataRendered(params) {
        params.api.sizeColumnsToFit();
      },
      channelBtn(){
        /*const rowData = [];

        for (let i = 0; i < 20; i++) {
          rowData.push({
            row: "Row " + i,
            value: i,
            currency: i + Number(Math.random().toFixed(2))
          });
        }
        this.gridOptions.api.setRowData(rowData);
        this.gridOptions.api.redrawRows({rowNodes: rows});
        var rows = [];
        rowData.forEach((item,i)=>{
          rows.push(this.gridOptions.api.getDisplayedRowAtIndex(i));
        })
        this.gridOptions.api.redrawRows({rowNodes: rows});*/
        console.log(this.gridOptions.columnApi.getColumnState()

        );
      }
    },
    beforeMount() {
      this.gridOptions = {
        enableSorting:true,
        context: this
      };
      //this.pinnedBottomRowData = [{}]
      this.createRowData();
      this.createColumnDefs();
    }
  }
</script>
<style scoped>

</style>

