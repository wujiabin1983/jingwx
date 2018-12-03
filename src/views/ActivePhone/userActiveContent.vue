<!--激活手机-用户协议-->
<template lang="html">
  <box class="app dsh-box">
    <div class="app-container">
	    <div class="integralRule-container" v-html="data" v-if="data!=''">
	  	</div>
      <div class="integralRule-noOrderList" v-if="data==''">
      	<img :src="biaoqing"/>
      	<p>暂时没有用户激活协议</p>
      </div>
    </div>
  </box>
</template>

<script>
import { Box } from 'vux'
import biaoqing from '@/assets/biaoqing.png'
const DshButton = () => import('@/components/DshButton/DshButton.vue').then(m => m.default)
export default {
  name: '用户激活协议',
  components: {
		DshButton,
		Box
  },
  data () {
    return {
    	biaoqing:biaoqing,
    	data:'',
			token:''
    }
  },
  methods: {

  },
  computed: {

  },
  created () {
		if(window.location.href.split('=').length<=2){
			if(window.location.href.split('=')[1]){
				this.token=window.location.href.split('=')[1];
				localStorage.setItem("token",this.token);
			}else if(localStorage.getItem("token")){
				this.token=localStorage.getItem("token");
			}
		}
		this.$http.post('I_SCRM_WX_INTERFACE_057.action',{
			openId:this.token
		}).then((res) => {
			let data = res.data,
				code = data.returnCode,
				msg = data.returnMsg;
			if(code == '0') {
				this.data = msg;
				// console.log(JSON.stringify(msg) + "getCardUrlInfo")
			}
		});
  }
}
</script>

<style lang="less">
	.ql-align-center{
		text-align: center;
	}
	.ql-align-right{
		text-align: right;
	}
	pre.ql-syntax {
    background-color: #23241f;
    color: #f8f8f2;
    overflow: visible;
	}	
	sub, sup {
    font-size: 75%;
    line-height: 0;
    position: relative;
    vertical-align: baseline;
	}
	sup {
    top: -.5em;
	}
	sub {
    bottom: -.25em;
	}
	.ql-size-large {
    font-size: 1.5em;
	}
	.ql-size-huge {
    font-size: 2.5em;
	}
	.ql-size-small {
    font-size: .75em;
	}
	.ql-font-monospace {
    font-family: Monaco,Courier New,monospace;
	}
	.ql-font-serif {
    font-family: Georgia,Times New Roman,serif;
	}
	.integralRule-container{
		padding: 40*@rem 15*@rem 0 15*@rem;
		img{
			width: 100%;
		}
	}
	.integralRule-noOrderList{
		padding-top: 378*@rem;
		img{
			width: 348*@rem;
			height: 216*@rem;
			display: block;
			margin: 0 auto;
		}
		p{
			text-align: center;
			margin-top: 56*@rem;
			color: #aaa;
		}
	}
</style>
