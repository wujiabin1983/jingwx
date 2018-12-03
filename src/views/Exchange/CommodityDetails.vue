<!--积分兑换详情-->
<template lang="html">
	<box class="app">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="app-container">
			<div class="dsh-group"></div>
			<div class="img-header-commodity-detail">
				<img :src="form.goodUrl" alt="" v-if="type=='1'">
				<swiper :list="img_list" :aspect-ratio="340/800" v-else auto loop dots-position="center"></swiper>
			</div>
			<div class="content-commodity-detail">
				<div class="content-info">
					<h4 class="title">{{form.goodName}}</h4>
					<div class="price-inte-exchange">
						<span class="inte" v-if="form.amount!=''">兑换价格: <i>{{form.amount}}</i>元</span>
						<span class="inte" v-if="form.integralValue!=''"><i>{{form.integralValue}}</i>积分</span>
					</div>
					<div class="price-inte">
						<span class="price" v-if="type!='1'&&form.salePrice!=''">销售价格: <em>{{form.salePrice}}元</em></span>
					</div>
					<div class="num-time">
						<span class="num">剩余数量: {{form.qty}}</span>
						<span class="time">截止时间: {{form.endDate}}</span>
					</div>
				</div>
				<dsh-br></dsh-br>
				<div class="content-desc">
					<div class="code">
						<span class="label">商品编码</span>
						<span class="text">{{form.goodCode}}</span>
					</div>
					<div class="desc">
						<span class="label">商品描述</span>
						<span class="text">{{form.goodDesc}}</span>
					</div>
				</div>
				<dsh-br></dsh-br>
				<group class="dsh-group-no-border">
					<cell class="dsh-cell" title="自提门店" is-link @click.native="handleSelfLiftShop"></cell>
				</group>
				<dsh-button v-if="isBtn" type="primary" size="490" class="exchange" @click.native="handleActive" :disabled="btnDis" :title="btnText" :text="btnText"></dsh-button>
			</div>
			<div>
				<confirm v-model="showInte" :close-on-confirm="false" title="" @on-confirm="onConfirm">
					<p style="text-align:center;">您确定要兑换吗？</p>
				</confirm>
			</div>
			<loading :show="show2" text=""></loading>
			<toast v-model="show" type="success" width="20em">{{toastText}}</toast>
		</div>
	</box>
</template>

<script>
	import { Box, Group, Toast, Cell, Swiper, Loading, Confirm } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)
	const DshEmpty = () =>
		import('@/components/DshEmpty/DshEmpty.vue').then(m => m.default)

	import ActivePhone from '@/assets/ActivePhone.png'
	export default {
		name: '积分兑换',
		components: {
			DshButton,
			Box,
			Group,
			DshBr,
			Cell,
			Swiper,
			Loading,
			Toast,
			Confirm
		},
		data() {
			return {
				toastText: '',
				show: false,
				showInte: false,
				token: '',
				isBtn:false,
				show2: false,
				btnText: '',
				btnDis: false,
				img_list: [],
				flag: '',
				form: {
					"goodUrl": "", //json格式
					"goodName": "",
					"integralValue": "",
					"salePrice": "",
					"amount": "",
					"qty": "",
					"endDate": "",
					"goodCode": "",
					"goodDesc": ""
				},
				img: {
					ActivePhone: ActivePhone
				},
				id: '',
				type: '0',
			}
		},
		methods: {
			handleSelfLiftShop() {
				this.$router.push({
					name: '自提门店'
				});
			},
			// 按钮兑换操作
			handleActive() {
				if(this.btnDis){
					return false;
				}
				this.showInte = true;
			},
			// 确认兑换
			onConfirm() {
				let params = {
					openId: this.token,
					id: this.id,
					type: this.type
				}
				this.show2=true;
				this.$http.post('I_SCRM_WX_INTERFACE_055.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					//					console.log(JSON.stringify(data) + '055')
					if(code == '0') {
						let param = {
							openId: this.token,
							id: params.id,
							type: params.type
						}
						this.loadingData(param);
						this.toastText = msg;
						this.show = true;
					}else{
						this.show2 = false;
					}
				});
				this.showInte = false;
			},
			loadingData(params) {
				this.$http.post('I_SCRM_WX_INTERFACE_023.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					console.log(JSON.stringify(data) + '023')
					if(code == '0') {
						this.show2 = false;
						this.form = msg;
						if(JSON.stringify(msg) != "{}") {
							if(msg.goodUrl == "") {
								this.form.goodUrl = this.img.ActivePhone;
							}
						} else {
							this.form.goodUrl = this.img.ActivePhone;
						}
						if(this.form.buttonInfo == '立即兑换') {
							this.btnText = '立即兑换';
							this.btnDis = false;
						}else {
							this.btnText = this.form.buttonInfo;
							this.btnDis = true;
						}
						this.isBtn=true;
						if(params.type == "0") {
							this.img_list = [];
//							this.img_list.push({
//								url: 'javascript:',
//								img: this.form.goodUrl.main.attaUrl,
//								title: ''
//							})
							if(this.form.goodUrl.atta) {
								let imgStr = this.form.goodUrl.atta.attaUrl;
								imgStr = imgStr.substr(0, imgStr.length - 1);
								let imgArray = imgStr.split(",");
								if(imgArray.length == 1) {
									this.img_list.push({
										url: 'javascript:',
										img: '',
										title: '',
										fallbackImg: lastImg
									})
								} else {
									let lastImg = imgArray.pop();
									imgArray.forEach((val, index) => {
										this.img_list.push({
											url: 'javascript:',
											img: val,
											title: ''
										})
									})
									this.img_list.push({
										url: 'javascript:',
										img: '',
										title: '',
										fallbackImg: lastImg
									})
								}
							} else {
								this.form.goodUrl = this.form.goodUrl.main.attaUrl;
							}
						}
					}
				});
			}
		},
		computed: {

		},
		created() {
			document.oncontextmenu = function(e) {
				//或者return false;
				e.preventDefault();
			};
			this.show2 = true;
			let url = window.location.href;
			let openId = '';
			let id = '';
			let params = '';
			let urlStr = url.split("?")[1];
			
			if(urlStr) {
				let urlArray = urlStr.split("&");
				if(urlArray) {
					openId = urlArray[0].split("=")[1];
					this.token = openId;
					localStorage.setItem("token", this.token);
					id = urlArray[1].split("=")[1];
					this.type = '0';
					this.id = id;
					params = {
						openId: this.token,
						id: id,
						type: '0'
					}
					this.loadingData(params);
				}else{
					this.token = urlStr;
				}
			}
			if(localStorage.getItem("token")) {
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
			if(sessionStorage.getItem('goodsId')) {
				params = JSON.parse(sessionStorage.getItem('goodsId'));
				//			console.log(params)
				this.type = params.type;
				this.id = params.id;
//				if(params.flag) {
//					if(params.flag == '立即兑换') {
//						this.btnText = '立即兑换';
//						this.btnDis = false;
//					}else {
//						this.btnText = params.flag;
//						this.btnDis = true;
//					}
//				}
				let param = {
					openId: this.token,
					id: params.id,
					type: params.type
				}
				this.loadingData(param);
			}
		}
	}
</script>

<style lang="less">
	.img-header-commodity-detail {
		width: 100%;
		background: #FFFFFF;
		img {
			width: 100%;
			max-height: 320*@rem;
		}
	}
	
	.exchange {
		margin: 30*@rem 0;
	}
	
	.content-commodity-detail {
		.content-info {
			padding: 0 42*@rem 42*@rem 32*@rem;
			background: #FFF;
			position: relative;
			.title {
				font-size: 30*@rem;
				color: #3b3b3b;
				padding-top: 24*@rem;
				font-weight: normal;
			}
			span {
				display: block;
				color: #949494;
				font-size: 24*@rem;
			}
			.price-inte {
				display: flex;
				justify-content: space-between;
				margin-top: (50)*@rem;
				i {
					font-style: normal;
					font-size: 36*@rem;
					color: #f79628!important;
				}
				em {
					font-style: normal;
					text-decoration: line-through;
				}
			}
			.price-inte-exchange {
				display: flex;
				justify-content: space-between;
				margin-top: (50)*@rem;
				i {
					font-style: normal;
					font-size: 36*@rem;
					color: #f79628!important;
				}
				em {
					font-style: normal;
				}
			}
			.num-time {
				display: flex;
				justify-content: space-between;
				margin-top: (60)*@rem;
			}
		}
		.content-desc {
			padding: 0 42*@rem 0 32*@rem;
			background: #FFF;
			border-bottom: 1*@rem solid #dcdcdc;
			.label {
				display: inline-block;
				margin-right: 70*@rem;
				vertical-align: top;
				font-size: 24*@rem;
				color: #949494;
			}
			.text {
				display: inline-block;
				vertical-align: top;
				font-size: 26*@rem;
				color: #3b3b3b;
			}
			.code {
				padding: 36*@rem 0 22*@rem 0;
			}
			.desc {
				padding: 36*@rem 0 34*@rem 0;
				.text {
					width: 456*@rem;
				}
			}
		}
	}
	
	.vux-slider>.vux-swiper>.vux-swiper-item>a>.vux-img {
		background-size: contain!important;
	}
</style>