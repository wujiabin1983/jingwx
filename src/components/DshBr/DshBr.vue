<template lang="html">
  <!-- <div class="app-container"> -->
    <box class="box-br" :style="h">.</box>
  <!-- </div> -->
</template>

<script>
import { Box, XButton  } from 'vux'
export default {
  components: {
    Box
  },
  props: {
    height: {
      type: Number,
      default: 24
    }
  },
  data () {
    return {
      msg: 'Hello World!'
    }
  },
  methods: {

  },
  computed: {
    h () {
      return {
        height: `${parseInt(this.height)/75}rem!important`
      }
    }
  },
  created () {

  }
}
</script>

<style lang="less">
  .box-br {
    position: relative;
    // z-index: 1;
    width: 100%;
    // height: .32rem /* 24/75 */!important;
    font-size: 0;
    background: #f8f8f8;
  }
</style>
