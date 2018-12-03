<template lang="html">
  <box class="dsh-pull-down-menu app dsh-box">
    <!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
    <div class="dsh-pull-down-menu app-container">
      <div id="text-menu" class="dsh-pull-down-menu text-menu">
        <div id="text" class="dsh-pull-down-menu text" @click="handleClick"><span class="dsh-pull-down-menu text-type">{{!selectedItem ? menu : selectedItem}}</span><x-icon class="dsh-pull-down-menu" type="ios-arrow-down" size="15"></x-icon></div>
        <transition name="item-menu">
          <div class="dsh-pull-down-menu item-menu" :ref="`item-menu-${menu}`" v-show="showItems">
            <div class="dsh-pull-down-menu item" :ref="`${menu}${item}`" v-for="(item, index) in items" :key="item" @click="handleItemClick(item, index)">{{item}}</div>
          </div>
      </transition >
      </div>
    </div>
  </box>
</template>

<script>
import { Box, Group } from 'vux'
const DshButton = () => import('@/components/DshButton/DshButton.vue').then(m => m.default)
export default {
  name: '我的券',
  components: {
    Box,
    Group
  },
  props: ['menu', 'items', 'selectedItem', 'isClose'],
  data () {
    return {
      showItems: false,
    }
  },
  methods: {
    handleClick () {
      this.showItems = !this.showItems;
    },
    handleItemClick (item, index) {
      let time = null;
      clearTimeout(time);
      let that = this;
      let actives = this.$refs[`item-menu-${this.menu}`].querySelector('.active');
      if(!actives) {
        this.$refs[`${this.menu}${item}`][0].classList.add('active');
      }else {
        actives.classList.remove('active');
        this.$refs[`${this.menu}${item}`][0].classList.add('active');
      }
      // 延迟关闭下拉窗口
      time = setTimeout(function() {
        that.showItems = false;
      }, 100);
      this.$emit('setItem', item);
    }
  },
  computed: {
    type () {
      return this.selectedItem;
    }
  },
  created () {
    // let body = document.querySelector('body');
    // body.addEventListener('click',(e)=>{
    //   // console.log(e.target.className);
    //   if(e.target.className === 'text-type' || e.target.className === 'text'){
    //     this.showItems = true
    //   }else {
    //     this.showItems = false
    //   }
    // },false)
  },
  watch: {
    type: function(val) {
      let classList = this.$refs[`${this.menu}${val}`][0];
    },
    isClose: function(val) {
      console.log(val)
      if(val.indexOf('true') != -1) {
        // console.log('应该关了')
        this.showItems = false;
      }else {
        // console.log('就这样吧');
      }
    }
  }
}
</script>

<style lang="less">
.text-menu {
  position: relative;
  width: 100%;
  height: 52*@rem;
  padding: 9*@rem 0;
  background: #FFF;
  text-align: center;
  // box-sizing: border-box;
  .text {
    position: absolute;
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 52*@rem;
    line-height: 52*@rem;
    font-size: 30*@rem;
    color: #5486dd;
    border-right: 1*@rem solid #5486dd!important;
    .text-type {
      margin-right: 15*@rem;
    }
    .vux-x-icon {
      fill: #5486dd;
    }
  }
  .item-menu {
    position: absolute;
    top: 70*@rem;
    left: 0;
    width: 99%;
    background: #FFF;
    z-index: 1;
    border: 1*@rem solid #e5e5e5;
    border-top: none;
    box-shadow: 0*@rem 2*@rem 2*@rem rgba(0,0,0,0.2);
    .item {
      box-sizing: border-box;
      width: 90%;
      height: 60*@rem;
      line-height: 60*@rem;
      margin: 0 5%;
      font-size: 26*@rem;
      color: #888;
      text-align: center;
      &:not(:last-child) {
        border-bottom: 1*@rem solid #eeeeee;
      }
      &.active {
        color: #5387dd;
      }
    }
  }
}

.item-menu-enter-active,.item-menu-leave-active{
    transition: 0.2s all ease;
}
.item-menu-enter-active{
    opacity: 1;
}
.item-menu-leave-active{
    opacity: 0;
}
.item-menu-enter,.donghua-leave{
    opacity: 0;
}
</style>
