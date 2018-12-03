<!--短信链接-->
<template lang="html">
	<box class="app noBottom">
		<div class="receive-coupon" :style="bgStyle">
			<div class="qcUrl">
				<p>打开微信查找公众号<b>{{publicName}}</b></p>
				<p>或</p>
				<p>截屏或长按将二维码保存到手机相册，使用微信<b>"扫一扫"</b>，<b>"相册"</b>关注公众号 </p>
				<img :src="qrUrl"/>
			</div>
		</div>
	</box>
</template>

<script>
	import { Box } from 'vux'
	import background from '@/assets/background1.png'
	export default {
		name: '活动详情',
		components: {
			Box
		},
		data() {
			return {
				bgStyle:{
					backgroundImage:'url('+background+')' 
				},
				qrUrl:'',
				publicName:'',
			}
		},
		methods: {
			// 获取 openId及参数
			GetRequest() {
				let url = window.location.href // 获取url中"?"符后的字串
				let theRequest = {}
				if(url.indexOf('?') >= 0) {
					let strArr = url.split('?')[1].split('&')
					strArr.forEach(val => {
						let str = val.split('=')
						theRequest[str[0]] = str[1]
					})
				}
				return theRequest
			}
		},
		computed: {

		},
		created() {
			let getRequest = this.GetRequest();
			let publicName = getRequest.publicName,
			qrUrl = getRequest.qrUrl;
		}
	}
</script>

<style lang="less">
	.receive-coupon {
		text-align: center;
		background-size: 100%;
		overflow: hidden;
		background-repeat: no-repeat;
		height: 100%;
		padding-top: 60*@rem;
		box-sizing: border-box;
		.title {
			padding: 26*@rem 0 20*@rem;
			font-size: 36*@rem;
			color: #373737;
		}
		.voucher {
			.dsh-voucher {
				margin: 20*@rem auto;
				width: 90%;
				margin: 0 auto;
			}
		}
		.btn {
			margin-top: 20*@rem;
			margin-bottom: 10*@rem;
			height: auto;
		}
	}
	.qcUrl{
		width:90%;
		background: #fff;
		margin: 0 auto;
		margin-top: 30*@rem;
		border-radius: 10*@rem;
		padding: 30*@rem 40*@rem;
		box-sizing: border-box;
		p{
			color: #C9C9C9;
			b{
				color: #333
			}
		}
		img{
			width: 300*@rem;
			height: 300*@rem;
			display: block;
			margin: 0*@rem auto;
			margin-top: 10*@rem;
		}
	}
	.noBottom{
		padding: 0;
	}
</style>