<template>
  <div class="coupon-box">
    <div class="coupon-box__left">
      <div class="coupon-price-box">
        <template v-if="couponInfo.coupType=='礼品卷'">
          <img class="gift-img" src="@/assets/coupon/card_icon_gift.png" alt="">
        </template>
        <template v-else>
          <span class="price">{{couponInfo.couponValue}}<i v-text="couponInfo.coupType=='折扣卷'?'折':'元'"></i></span>
        </template>
      </div>
      <div class="coupon-detail-box">
        <div class="info-subInfo">
          <p class="info">
            {{couponInfo.coupName}}
             <!-- <span class="type">{{couponInfo.coupType}}</span> -->
          </p>
          <p class="sub-info">满{{couponInfo.useThreshold}}元可用</p>
        </div>
        <span class="time" v-if="couponInfo.coupDate">{{couponInfo.coupDate}}</span>
      </div>
    </div>
    <div class="coupon-box__right">
      <div class="coupon-btn">
        {{couponInfo.status=='可使用'?'立即使用':couponInfo.status}}
      </div>
      <!-- <div class="half-angle-box"></div> -->
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
    btnText(){
      let text = '立即使用'
      switch( couponInfo.status ){
        case '可使用' :
          return  '立即使用';
        case '已使用':
          return '已使用';
        case '已过期' :
          return '已过期';
      }
    }
  },
  data(){
    return{

    }
  }
}
</script>
<style lang="less" scoped>
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
  height: 250*@rem;
  border-radius: 6*@rem;
  overflow: hidden;
  position: relative;
  color:#111;
  &::after,&::before{
    content:'';
    display:inline-block;
    width:46*@rem;
    height:46*@rem;
    border-radius: 50%;
    position: absolute;
    top:50%;
    transform: translateY(-50%);
    background-color:@bigBg;
    z-index: 1;
  }
  &::after{
    left:-23*@rem;
  }
  &::before{
    right:-23*@rem;
  }
  &+.coupon-box{
    margin-top:20*@rem;
  }
  &__left{
    flex:1;
    display: flex;
    justify-content: center;
    align-items: center;
    .sawtooth(#fff);
    background-position: 20*@rem 1.5*@rem;
    .coupon-price-box{
      width:200*@rem;
      text-align: center;
      .gift-img{
        width: 100*@rem;
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
    }
    .coupon-detail-box{
      flex:1;
      font-size: 22*@rem;
      .info-subInfo{
        margin-bottom:14*@rem;
        .info{
          font-size: 34*@rem;
          margin-bottom:6*@rem;
        }
        .sub-info{
        }
      }
      .time{
        color: #666;
        
      }
    }
  }
  &__right{
    width:110*@rem;
    color:#fff;
    -webkit-writing-mode: vertical-lr;
    writing-mode: vertical-lr ;
    position: relative;
    .sawtooth();
    .coupon-btn{
      width:100%;
      height:100%;
      text-align: center;
      position: relative;
      top:2*@rem;
      padding-left:20*@rem;
      .half-angle()
    }
    .half-angle-box{
      width:100%;
      height:100%;
      top:2*@rem;
      .half-angle();
      &:after,&::before{
        right:-18*@rem;
      }
    }
  }
}
</style>
