<!--绑卡记录-->
<template lang="html">
	<box class="">
		<div class="app-container">
			<div class="bindingCardHis-container">
				<div v-if="data" class="bindingCardData">
					<div class="bindingCardHis-item" :style="myCardItemStyle" v-for="item in bindingCardData" :key="item.integralName">
						<div class="content-item">
							<p class="item-title"><span class="bindingCardHis-cardType">{{item.level}}</span><span class="bindingCardHis-mobile">{{item.mobile}}</span></p>
							<p class="bindingCardHis-storeName">{{item.storeName}}</p>
							<p class="bindingCardHis-cardNo">{{item.cardNo}}</p>
							<p class="bindingCardHis-date">{{item.validDate}}</p>
						</div>
					</div>
				</div>
				<div v-if="noData" class="bindingCardNoData">
					<img :src="nodata" />
					<p>您还没有绑卡记录哦！</p>
					<dsh-button type="primary" @click.native="bindingCardFn" class="bindingCardHis-btn" size="490" :disabled="false" title="绑定会员卡" text="绑定会员卡"></dsh-button>
				</div>
			</div>
		</div>
	</box>
</template>

<script>
	import nodata from '@/assets/biaoqing.png'
	import huiyuanka1 from '@/assets/huiyuanka1.png'
	import huiyuanka2 from '@/assets/huiyuanka2.png'
	import huiyuanka3 from '@/assets/huiyuanka3.png'
	import { Box, Group, XInput, Toast } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	export default {
		name: '绑定会员卡',
		components: {
			Box,
			DshButton,
			Group,
			XInput,
			Toast
		},
		data() {
			return {
				myCardItemStyle: {
					'background-image': `url(${huiyuanka2})`
				},
				token: '',
				nodata: nodata,
				data: false,
				noData: false,
				bindingCardData: []
				//  	{
				//  		cardType:"银卡",
				//  		cardNo:"2331800201990",
				//  		mobile:"18381921231",
				//  		storeName:"XXX旗舰店",
				//  		bindingCardDateBegin:"2018.09.09",
				//  		bindingCardDateEnd:"2020.09.09",
				//  	},{
				//  		cardType:"银卡",
				//  		cardNo:"2331800201990",
				//  		mobile:"18381921231",
				//  		storeName:"XXX旗舰店",
				//  		bindingCardDateBegin:"2018.09.09",
				//  		bindingCardDateEnd:"2020.09.09",
				//  	},{
				//  		cardType:"银卡",
				//  		cardNo:"2331800201990",
				//  		mobile:"18381921231",
				//  		storeName:"XXX旗舰店",
				//  		bindingCardDateBegin:"2018.09.09",
				//  		bindingCardDateEnd:"2020.09.09",
				//  	}
			}
		},
		methods: {
			bindingCardFn() {
				this.$router.push({
					name: '绑定会员卡'
				});
			},
		},
		computed: {

		},
		created() {
			document.oncontextmenu=function(e){
			    //或者return false;
			    e.preventDefault();
			};
			if(window.location.href.split('=')[1]){
				this.token=window.location.href.split('=')[1];
				localStorage.setItem("token",this.token);
			}else if(localStorage.getItem("token")){
				this.token=localStorage.getItem("token");
			}
			this.$http.post('getSignInfo.action', {
				openId: this.token,
				url: encodeURIComponent(window.location.href.split('#')[0])
			}).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg,
					that = this;
				if(code == '0') {
					this.show2 = false;
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: msg.appId, // 必填，公众号的唯一标识
						timestamp: msg.timestamp, // 必填，生成签名的时间戳
						nonceStr: msg.nonceStr, // 必填，生成签名的随机串
						signature: msg.signature, // 必填，签名，见附录1
						jsApiList: ['hideMenuItems']
						// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
					});
					wx.ready(function() {
						wx.hideMenuItems({
							menuList: ["menuItem:share:timeline", //分享到朋友圈
								"menuItem:share:appMessage", //发送给朋友
								"menuItem:share:qq", //分享到QQ
								"menuItem:share:weiboApp", //分享到Weibo
								"menuItem:favorite", //收藏
								"menuItem:share:facebook", //分享到FB
								"menuItem:share:QZone", //分享到 QQ 空间
								"menuItem:editTag", //编辑标签
								"menuItem:delete", //删除
								"menuItem:copyUrl", //复制链接
								"menuItem:originPage", //原网页
								"menuItem:readMode", //阅读模式
								"menuItem:openWithQQBrowser", //在QQ浏览器中打开
								"menuItem:openWithSafari", //在Safari中打开
								"menuItem:share:email", //邮件
								"menuItem:share:brand"
							] //一些特殊公众号
							// 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
						})
					})
				}
			});
			this.$http.post('I_SCRM_WX_INTERFACE_052.action', {
				openId: this.token,
				...this.groupForm
			}).then(res => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg;
				if(code == "0") {
					console.log(JSON.stringify(data) + "052")
					if(msg.length > 0) {
						this.bindingCardData = msg;
						this.data = true;
					} else {
						this.noData = true;
					}
				}
			});
		}
	}
</script>

<style lang="less">
	.bindingCardHis-container {
		.bindingCardData {
			padding-top: 48*@rem;
			.bindingCardHis-item {
				width: 710*@rem;
				height: 276*@rem;
				color: #fff;
				font-size: 30*@rem;
				margin: 0 auto;
				margin-bottom: 42*@rem;
				padding: 11*@rem 38*@rem;
				box-sizing: border-box;
				border-radius: 10*@rem;
				background-size: 100%;
				.content-item {
					.item-title {
						height: 52*@rem;
						line-height: 52*@rem;
						.bindingCardHis-cardType {
							float: left;
						}
						.bindingCardHis-mobile {
							float: right;
						}
					}
					.bindingCardHis-storeName {
						height: 50*@rem;
						line-height: 50*@rem;
						display: block;
						text-align: left;
					}
					.bindingCardHis-cardNo {
						height: 80*@rem;
						line-height: 80*@rem;
						text-align: center;
						font-size: 44*@rem;
					}
					.bindingCardHis-date {
						text-align: left;
						font-size: 24*@rem;
						margin-top: 33*@rem;
					}
				}
			}
			.bindingCardHis-col1 {
				background: url(../../assets/huiyuanka1.png) no-repeat center;
			}
			.bindingCardHis-col2 {
				background: url(../../assets/huiyuanka2.png) no-repeat center;
			}
			.bindingCardHis-col3 {
				background: url(../../assets/huiyuanka3.png) no-repeat center;
			}
		}
		.bindingCardNoData {
			img {
				width: 348*@rem;
				height: 216*@rem;
				display: block;
				margin: 0 auto;
				margin-top: 180*@rem;
			}
			p {
				text-align: center;
				font-size: 30*@rem;
				margin-top: 84*@rem;
				color: #aaa;
			}
			.bindingCardHis-btn {
				margin-top: 318*@rem;
			}
		}
	}
</style>