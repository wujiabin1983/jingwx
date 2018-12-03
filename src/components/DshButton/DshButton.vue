<template lang="html">
  <div class="app-container">
    <box>
      <x-button
        :style="wh"
        :class="className"
        :id="idName"
        :disabled="disabled"
        :type="type"
        v-text="text"
        ref="xButton">
      </x-button>
    </box>
  </div>
</template>

<script>
import { Box, XButton  } from 'vux'
export default {
  components: {
    XButton,
    Box
  },
  props: ['text', 'size', 'width', 'height', 'disabled', 'type'],
  data () {
    return {
      msg: 'Hello World!'
    }
  },
  methods: {

  },
  computed: {
    className () {
      if( this.size == '490') {
        return 'button-common size-490'
      }else if ( this.size == '284') {
        return 'button-common size-284'
      }else if( this.size == '218' ) {
        return 'button-common size-218'
      }else if ( this.size == '174') {
        return 'button-common size-174'
      }else if ( this.size == '174-1') {
        return 'button-common size-174-1'
      }else if( this.size == '144' ) {
        return 'button-common size-144'
      }else if( this.size == '130' ) {
        return 'button-common size-130'
      }else if( this.size == '132' ) {
        return 'button-common size-132'
      }else if ( this.size == '118') {
        return 'button-common size-118'
      }else if( this.size == '90' ) {
        return 'button-common size-90'
      }else {
        return ''
      }
    },
    idName () {
      if( this.disabled ) {
        return 'disabled'
      }else if( this.type == 'default' ) {
        return 'default'
      }else if( this.type == 'lucency' ) {
        return 'lucency'
      }else if( this.type == 'info' ) {
        return 'info'
      }else{
        return ''
      }
    },
    wh () {
      if(!this.width || !this.height) {
        if(!this.width) {
          return {
            height: `${this.height/75}rem!important`
          }
        }else {
          return {
            width: `${this.width/75}rem!important`
          }
        }
      }else {
        return {
          width: `${this.width/75}rem!important`,
          height: `${this.height/75}rem!important`
        }
      }
    }
  },
  created () {

  }
}
</script>

<style lang="less">
  .button-common {
    display: inline-block;
    font-size: .48rem /* 36/75 */;
    color: #FFF;
    // background-color: #5387dd!important;
    padding: 0!important;
  }
  .button-common:after {
    border: none!important;
  }
  .size-490 {
    width: 6.53rem /* 490/75 */!important;
    height: 1.2rem /* 90/75 */!important;
    line-height: 1.2rem /* 90/75 */!important;
    border-radius: .6rem /* 45/75 */!important;
  }
  .size-284 {
    width: 3.79rem /* 284/75 */!important;
    height: 1.07rem /* 80/75 */!important;
    line-height: 1.07rem /* 80/75 */!important;
    border-radius: .6rem /* 45/75 */!important;
  }
  .size-218 {
    width: 2.91rem /* 218/75 */!important;
    height: .93rem /* 70/75 */!important;
    line-height: .93rem /* 70/75 */!important;
    border-radius: .6rem /* 45/75 */!important;
    font-size: .4rem /* 30/75 */!important;
  }
  .size-174 {
    width: 2.32rem /* 174/75 */!important;
    height: .64rem /* 48/75 */!important;
    line-height: .64rem /* 48/75 */!important;
    border-radius: .13rem /* 10/75 */!important;
    font-size: .32rem /* 24/75 */!important;
  }
  .size-174-1 {
    width: 2.32rem /* 174/75 */!important;
    height: .64rem /* 48/75 */!important;
    line-height: .64rem /* 48/75 */!important;
    border-radius: .32rem /* 24/75 */!important;
    font-size: .32rem /* 24/75 */!important;
  }
  .size-144 {
    width: 144*@rem!important;
    height: 48*@rem!important;
    line-height: 40*@rem!important;
    border-color: #FFF!important;
    border-radius: 24*@rem!important;
    font-size: 24*@rem!important;
    background-color: transparent!important;
    color: #FFF!important;
  }
  .size-132 {
    width: 1.76rem /* 132/75 */!important;
    height: .64rem /* 48/75 */!important;
    line-height: .64rem /* 48/75 */!important;
    border-radius: .13rem /* 10/75 */!important;
    font-size: .32rem /* 30/75 */!important;
  }
  .size-130 {
    width: 1.73rem /* 130/75 */!important;
    height: .64rem /* 48/75 */!important;
    line-height: .64rem /* 48/75 */!important;
    border-radius: .13rem /* 10/75 */!important;
    font-size: .32rem /* 24/75 */!important;
  }
  .size-118 {
    width: 1.57rem /* 118/75 */!important;
    height: .59rem /* 44/75 */!important;
    line-height: .59rem /* 44/75 */!important;
    border-radius: .29rem /* 22/75 */!important;
    font-size: .32rem /* 24/75 */!important;
  }
  .size-90 {
    width: 1.2rem /* 90/75 */!important;
    heiht: .56rem /* 42/75 */!important;
    line-height: .56rem /* 42/75 */!important;
    border-radius: .13rem /* 10/75 */!important;
    font-size: .32rem /* 24/75 */!important;
  }
  #disabled {
    border: 3*@rem solid #d9d9d9!important;
    // background-color: #f8f8f8!important;
    // color: #d9d9d9!important;
  }
  #default {
    border: 3*@rem solid #5387dd;
  }
  /*白色边框白色字体透明背景*/
  #lucency{
    border: 3*@rem solid #fff;
    color: #fff;
    background: none;
  }
  /*蓝色边框蓝色字体透明背景*/
  #info{
    border: 3*@rem solid #5387dd;
    color: #5387dd;
    background: none;
  }
</style>
