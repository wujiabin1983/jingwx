<template>
  <div class="coupon-box" :class="{'disabled':disabled}" >
    <div class="coupon-box__left" :style="leftStyle">
      <template v-if="couponInfo.coupType=='礼品券'">
          <img class="gift-img" src="@/assets/coupon/card_icon_gift.png" alt="">
      </template>
      <template v-else>
        <span class="price">{{couponInfo.couponValue}}<i v-text="couponInfo.coupType=='折扣券'?'折':'元'"></i></span>
      </template>
      <div class="type">{{couponInfo.coupType}}</div>
      
    </div>
     <!-- coupon-detail-box -->
    <div class="coupon-box__center">
      <p class="info">
        {{couponInfo.coupName}}
          <!-- <span class="type">{{couponInfo.coupType}}</span> -->
      </p>
      <p class="sub-info">满{{couponInfo.useThreshold}}元可用</p>
      <span class="time" v-if="couponInfo.coupDate">{{couponInfo.coupDate}}</span>
    </div>
    <div class="coupon-box__right">
      <div class="coupon-btn" :style="btnStyle">
        {{couponInfo.status=='可使用'?'立即使用':couponInfo.status}}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props:{
    couponInfo:{
      type:Object
    }
  },
  computed:{
    disabled(){
      return this.couponInfo.status!=='可使用'
    },
    btnText(){
      let text = '立即使用'
      switch( this.couponInfo.status ){
        case '可使用' :
          return  '立即使用';
        case '已使用':
          return '已使用';
        case '已过期' :
          return '已过期';
      }
    },
    // couponType(){
    //   switch( this.couponInfo.coupType ){
    //     case '礼品券' :
    //       return  'gift';
    //     case '代金券':
    //       return 'cash';
    //     case '折扣券' :
    //       return 'discount';
    //   }
    // },
    leftStyle(){
      
      let { begin, end } = this.couponInfo.bgColor
      let obj = {
        'background-image': `linear-gradient(to right ,${begin}, ${end})`
      }
      if(this.disabled){
        obj= {
          'background-image': `linear-gradient(to right , rgb(185, 185, 185), #9A9A9A)`
        }
      }
      return obj
    },
    btnStyle(){
      let obj = {
        'color': this.disabled?'#aaa':this.couponInfo.bgColor.end
      }
      return obj
    }
  },
  data(){
    return{

    }
  }
}
</script>
<style lang="less" scoped>
//渐变background
// @mixin gradient-background($angle:to right, $formColor:#fb851d,$toColor:#fe1708) {
//     background-image: linear-gradient($angle , $formColor, $toColor);
// }

@bigBg:#f8f8f8;
.sawtooth(@bg:#e24141){
  position: relative;
  background-image: radial-gradient(transparent 0, transparent 4*@rem, @bg 4*@rem);
  background-size: 18*@rem 12*@rem;
  background-position: 10*@rem 2*@rem;

  &:before {
    content: ' ';
    display: block;
    background-color: @bg;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 6*@rem;
    right: 6*@rem;
    z-index: -1;
  }
}
.half-angle{
  width:100%;
  height:100%;
  position: relative;
  &::before,&::after{
    content:'';
    display: inline-block;
    width:30*@rem;
    height:30*@rem;
    border-radius: 50%;
    background-color:@bigBg;
    position: absolute;
    left:-18*@rem;
  }
  &::before{
    top:-18*@rem;
    
  }
  &::after{
    bottom:-18*@rem;
  }
}

.coupon-box{
  display: flex;
  height: 180*@rem;
  // overflow: hidden;
  position: relative;
  color:#111;
  &.disabled{
    .coupon-box__center{
      .info,.sub-info{
        color:#aaa;
      }
    }
  }
  &+.coupon-box{
    margin-top:20*@rem;
  }
  &__left{
    position:relative;
    width:166*@rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    color:#fff;
    &::after,&::before{
      content:'';
      display:inline-block;
      width:28*@rem;
      height:28*@rem;
      border-radius: 50%;
      position: absolute;
      right:-14*@rem;
      // transform: translateY(-50%);
      background-color:@bigBg;
      z-index: 1;
    }
    &::after{
      top:-14*@rem;
    }
    &::before{
      bottom:-14*@rem;
    }
    .gift-img{
      width: 68*@rem;
    }
    .price{
      font-size: 42*@rem;
      font-weight: 700;
      i{
        font-size: 22*@rem;
        font-style: normal;
        display: inline-block;
        margin-left: 10*@rem;
      }
    }
    .type{
      margin-top:22*@rem;
      font-size: 28*@rem;
    }
  }
  &__center{
    display: flex;
    justify-content: center;
    // align-items: center;
    flex-direction: column;
    flex:1;
    font-size: 22*@rem;
    padding-left:28*@rem;
    background-color: #fff;
    .info{
      font-size: 28*@rem;
      margin-bottom:6*@rem;
      color:#111;
      font-weight: 700;
    }
    .sub-info{
      margin-bottom:6*@rem;
    }
    .time{
      color: #aaa;
      font-size:20*@rem;
    }
  }
  &__right{
    width:90*@rem;
    color:#fff;
    -webkit-writing-mode: vertical-lr;
    writing-mode: vertical-lr ;
    position: relative;
    border-left:1px dotted #EEEEEE;
    background-color: #fff;
    .coupon-btn{
      width:100%;
      height:100%;
      position: relative;
      color:#e24141;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    // .half-angle-box{
    //   width:100%;
    //   height:100%;
    //   top:2*@rem;
    //   .half-angle();
    //   &:after,&::before{
    //     right:-18*@rem;
    //   }
    // }
  }
}
</style>
