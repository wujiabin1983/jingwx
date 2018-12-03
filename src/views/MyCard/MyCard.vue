<!--我的会员卡-->
<template lang="html">
	<box class="app">
		<div class="app-container">
			<div class="myCard-container">
				<div class="myCard-item " :style="myCardItemStyle" id="myCardBg">
					<div class="content-item">
						<img src="../../assets/imgExchange1.png" class="myCard-logo" />
						<span class="myCard-brandName">{{form.cardBrandName}}</span>
						<span class="myCard-title">{{form.title}}</span>
						<span class="myCard-cardNo">{{lineCardNum}}</span>
					</div>
				</div>
				<div class="myCard-memberInfo">
					<p><span>积分</span><span>优惠券</span><span>等级</span></p>
					<p><span>{{availableIntegral}}</span><span @click="coupClick">查看</span><span>{{memberLevel}}</span></p>
				</div>
				<dsh-br></dsh-br>
				<div class="myCard-two">
					<img :src="qrcodeTwo" v-if="cardType!='仅卡片'" />
					<p>{{lineCardNum}}</p>
					<dsh-button type="primary" @click.native="bindingCardFn" class="bindingCard-btn" size="174-1" :disabled="false" :title="btnName" :text="btnName"></dsh-button>
				</div>
				<dsh-br></dsh-br>
				<group class="dsh-group" v-for="item in btnList" :key="item.name">
					<cell :title="item.name" style="background: #fff;" :link="item.url"></cell>
				</group>
			</div>
		</div>
	</box>
</template>

<script>
	import { Cell, Group, Box } from 'vux'
	import qrcodeTwo from '@/assets/qrcodeTwo.png'
	import huiyuanka1 from '@/assets/huiyuanka1.png'
	import huiyuanka2 from '@/assets/huiyuanka2.png'
	import huiyuanka3 from '@/assets/huiyuanka3.png'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)
	export default {
		name: '我的会员卡',
		components: {
			Cell,
			Group,
			DshBr,
			DshButton,
			Box
		},
		data() {
			return {
				token: '',
				cardType: '仅卡片',
				memberLevel: '',
				availableIntegral: '',
				lineCardNum: '',
				myCardItemStyle: {
					//  		'background-image': `url(${huiyuanka2})`
				},
				colorArray: [{
						"key": "Color010",
						"value": "#63b359"
					},
					{
						"key": "Color020",
						"value": "#2c9f67"
					},
					{
						"key": "Color030",
						"value": "#509fc9"
					},
					{
						"key": "Color040",
						"value": "#5885cf"
					},
					{
						"key": "Color050",
						"value": "#9062c0"
					},
					{
						"key": "Color060",
						"value": "#d09a45"
					},
					{
						"key": "Color070",
						"value": "#e4b138"
					},
					{
						"key": "Color080",
						"value": "#ee903c"
					},
					{
						"key": "Color081",
						"value": "#f08500"
					},
					{
						"key": "Color082",
						"value": "#a9d92d"
					},
					{
						"key": "Color090",
						"value": "#dd6549"
					},
					{
						"key": "Color100",
						"value": "#cc463d"
					},
					{
						"key": "Color101",
						"value": "#cf3e36"
					},
					{
						"key": "Color102",
						"value": "#5E6671"
					}
				],
				form: {
					cardBrandName: '',
					title: '',
					cardNo: ''
				},
				btnName: '',
				btnList: [], //查看详情按钮的list
				qrcodeTwo: qrcodeTwo, //条形码
				bindingCardData: {
					cardType: "银卡",
					cardNo: "2331800201990",
					mobile: "18381921231",
					storeName: "XXX旗舰店",
					bindingCardDateBegin: "2018.09.09",
					bindingCardDateEnd: "2020.09.09",
				},
				//  	memberInfo:{name: "会员卡详情"}
			}
		},
		methods: {
			coupClick() {
				this.$router.push({
					name: '我的券'
				});
			},
			bindingCardFn() {
				this.$router.push({
					name: '会员中心首页'
				});
			},
			loadingHtmlData() {
				this.$http.post('I_SCRM_WX_INTERFACE_008.action', {
					openId: this.token,
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					console.log(JSON.stringify(data) + '008')
					if(code == '0') {
						this.btnList = msg.customEntry;
						if(msg.coverType == "图片") {
							if(msg.coverDesc != "") {
								document.getElementById("myCardBg").style.backgroundImage = 'url(' + msg.coverDesc + ')';
							} else {
								document.getElementById("myCardBg").style.backgroundImage = '`url(${huiyuanka2})`';
							}
						}
						if(msg.coverType == "颜色") {
							document.getElementById("myCardBg").style.backgroundImage = '';
							this.colorArray.forEach((val, index) => {
								if(val.key == msg.coverDesc) {
									document.getElementById("myCardBg").style.backgroundColor = val.value;
								}
							})
						}
						if(msg.cardSet.cardDiscern == "仅卡片") {
							this.cardType = "仅卡片";
						}
						if(msg.cardSet.cardDiscern == "卡号和二维码") {
							this.cardType = "卡号和二维码";
						}
						if(msg.cardSet.cardDiscern == "卡号和条形码") {
							this.cardType = "卡号和条形码";
						}
						this.form.cardBrandName = msg.cardBrandName;
						this.form.title = msg.title;
						this.btnName = msg.customButtom.buttomName;
					}
				});
			},
			loadingData() {
				this.$http.post('I_SCRM_WX_INTERFACE_041.action', {
					openId: this.token,
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.memberLevel = msg.memberLevel;
						this.availableIntegral = msg.availableIntegral;
						this.lineCardNum = msg.lineCardNum;
						this.qrcodeTwo = msg.qrUrl;
						console.log(JSON.stringify(data) + '041')
					}
				});
			},
		},
		computed: {

		},
		created() {
			document.oncontextmenu = function(e) {
				//或者return false;
				e.preventDefault();
			};
			if(window.location.href.split('=')[1]) {
				this.token = window.location.href.split('=')[1];
				localStorage.setItem("token", this.token);
			} else if(localStorage.getItem("token")) {
				this.token = localStorage.getItem("token");
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
			this.loadingHtmlData();
			this.loadingData();
		}
	}
</script>

<style lang="less">
	.myCard-container {
		padding-top: 36*@rem;
		.myCard-item {
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
				.myCard-logo {
					width: 120*@rem;
					height: 120*@rem;
					border-radius: 50%;
					margin-top: 20*@rem;
					float: left;
				}
				.myCard-brandName {
					width: 320*@rem;
					height: 40*@rem;
					padding-left: 30*@rem;
					float: left;
					margin-top: 20*@rem;
					display: inline-block;
				}
				.myCard-title {
					width: 320*@rem;
					height: 40*@rem;
					padding-left: 30*@rem;
					float: left;
					margin-top: 20*@rem;
					display: inline-block;
				}
				.myCard-cardNo {
					width: 100%;
					display: block;
					float: left;
					margin-top: 50*@rem;
				}
			}
		}
		.myCard-two {
			height: 340*@rem;
			background: #fff;
			padding-top: 46*@rem;
			img {
				width: 374*@rem;
				height: 168*@rem;
				margin: 0 auto;
				display: block;
				margin-bottom: 10*@rem;
			}
			p {
				text-align: center;
				margin-bottom: 30*@rem;
			}
		}
		.myCard-memberInfo {
			background: #fff;
			p {
				height: 58*@rem;
				line-height: 58*@rem;
				font-size: 30*@rem;
				span {
					width: 33.3%;
					display: inline-block;
					text-align: center;
				}
			}
			p:last-child {
				color: #F79628;
				;
				font-size: 26*@rem;
			}
		}
	}
</style>