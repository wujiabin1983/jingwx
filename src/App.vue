<template>
  <div id="app">
    <!-- <a href="Page.html">page</a> -->
    <!-- loading -->
    <div>
      <loading v-model="isLoading"></loading>
    </div>

    <view-box ref="viewBox">
      <!-- <x-header :left-options="{backText: ''}" class="x-header" slot="header">{{$route.name}}</x-header> -->
      <router-view class="router-view"></router-view>
<!--      <img id="icon-home" :src="img.home" alt="" v-if="$route.path != '/'" @click="handleBackHome">
-->      <!-- <x-header
        v-if="isShowNav"
        slot="header"
        style="width:100%;position:absolute;left:0;top:0;z-index:100;"
        :left-options="leftOptions"
        :right-options="rightOptions"
        :title="title"
        :transition="headerTransition"
        @on-click-more="onClickMore">
        <span v-if="route.path === '/' || route.path === '/component/drawer'" slot="overwrite-left" @click="drawerVisibility = !drawerVisibility">
          <x-icon type="navicon" size="35" style="fill:#fff;position:relative;top:-8px;left:-3px;"></x-icon>
        </span>
      </x-header> -->

    </view-box>
  </div>
</template>

<script>
import { Loading, XHeader, ViewBox } from 'vux'
import home from '@/assets/home.png'
import { mapState } from 'vuex'
export default {
  name: 'app',
  components: {
    Loading,
    XHeader,
    ViewBox
  },
  data () {
    return {
      img: {
        home: home
      },
      entryUrl: document.location.href,
    }
  },
  computed: {
    ...mapState({
      route: state => state.route,
      isLoading: state => state.vux.isLoading,
      token: state => state.token
    }),
    isShowNav () {
      if (this.entryUrl.indexOf('hide-nav') > -1) {
        return `0`
      }
      return `${25/37.5}rem`
    },
    leftOptions () {
      return {
        showBack: this.route.path !== '/'
      }
    },
    scrollTop () {
      return this.$refs.viewBox.getScrollTop;
    }
  },
  created () {
    // 获取token
    // this.$http.post('nearbyStore').then((res) => {
    // }).catch((err) => {
    // });
    // this.$store.commit('setToken', window.location.href.split('=')[1]);
    // console.log(this.$store);
  },
  methods: {
    handleBackHome() {
      this.$router.push({
        name: '会员中心首页'
      });
    }
  }
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';
@import '~vux/src/styles/close.less';
// @import '~vux/src/styles/1px.less';
@import './styles/common.less';
#app {
  height: 100%;
  background: #f8f8f8;
}
.x-header {
  width:100%!important;
  position:absolute!important;
  left:0!important;
  top:0!important;
  z-index:100!important;
}
.router-view {
  width: 100%;
  // top: 46px;
  // padding-top: 30px;
}




html, body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  background-color: #fbf9fe;
}
#icon-home {
  position: absolute;
  right: 60*@rem;
  bottom: 60*@rem;
  width: 120*@rem;
  height: 120*@rem;
  opacity: 0.6;
  z-index: 1000;
}



</style>
