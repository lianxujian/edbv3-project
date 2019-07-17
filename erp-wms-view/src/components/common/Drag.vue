<!--拖拽示例 尘音-->
<template>
  <div id="drag">
    <div v-drag style="position: absolute;top:0;left: 0;">拖拽试试</div>
  </div>
</template>
<script>
  import Vue from 'vue'
  Vue.directive('drag',function(el){
    let oDiv=el;
    oDiv.onmousedown=function(ev){
      let disX=ev.clientX-oDiv.offsetLeft;
      let disY=ev.clientY-oDiv.offsetTop;
      document.onmousemove=function(ev){
        let l=ev.clientX-disX;
        let t=ev.clientY-disY;
        oDiv.style.left=l+'px';
        oDiv.style.top=t+'px';
      };
      document.onmouseup=function(){
        document.onmousemove=null;
        document.onmouseup=null;
      };
    };
  });
  export default {
    data() {
      return {}
    },
  }
</script>



