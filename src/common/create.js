import Vue from 'vue';

export default function create(Component, props) {
   // 先创建实例
   const vm = new Vue({
      // render生成虚拟DOM
      render(h) {
         // h就是createElement，它返回VNode
         return h(Component, {
            props
         })
      }
   }).$mount(); // Vue不允许挂载到 body 上，$mount('body') 会报错

   // 所以手动挂载
   document.body.appendChild(vm.$el);

   // 销毁方法
   const comp = vm.$children[0];
   comp.remove = function() {
      document.body.removeChild(vm.$el);
      vm.$destroy();
   }

   // 返回实例
   return comp;
}