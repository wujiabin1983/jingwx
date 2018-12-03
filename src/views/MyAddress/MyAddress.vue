<!--我的地址-->
<template lang="html">
	<box class="app dsh-box">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="app-container">
			<div class="listMyAddress" v-if="myAddressNoData">
				<img :src="imgNodata" alt="">
				<p>您还没有收货地址哦!</p>
				<dsh-button text="添加新地址" type="primary" :size="490" @click.native="handleAdd"></dsh-button>
			</div>
			<div v-if="myAddressData">
				<div class="listMyAddressItems" v-for="(item, index) in myAddressItems" :key="item.id">
					<!-- name and phone -->
					<div class="nap">
						<span class="nap-name">{{item.consigneeName}}</span>
						<span class="nap-phone">{{item.consigneeTel}}</span>
					</div>
					<p class="address">{{item.provinceName}}{{item.cityName}}{{item.areaName}}{{item.addr}}</p>
					<!-- check and action -->
					<div class="caa">
						<check-icon class="caa-isSure" @click.native="isDefaultFn(item)" :value.sync="item.isDefault">设置为默认地址</check-icon>
						<div class="caa-btn">
							<dsh-button class="dsh-btn" type="default" :size="90" text="编辑" @click.native="handleEdit(item, index)"></dsh-button>
							<dsh-button class="dsh-btn" type="default" :size="90" text="删除" @click.native="handleDelete(item.id)"></dsh-button>
						</div>
					</div>
					<dsh-br></dsh-br>
				</div>
				<div class="btnData">
					<dsh-button text="添加新地址" type="primary" :size="490" @click.native="handleAdd"></dsh-button>
				</div>
			</div>
			<toast v-model="show" :type="toastType" width="8rem">{{toastText}}</toast>
			<loading :show="show2" text=""></loading>
		</div>
	</box>
</template>

<script>
	import { Box, CheckIcon, Toast, Loading } from 'vux'
	import imgNodata from '@/assets/biaoqing.png'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	// const imgNodata = () => import('@/assets/nodata.png').then(m => m.default)
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)
	export default {
		name: '我的地址',
		components: {
			Box,
			DshButton,
			CheckIcon,
			DshBr,
			Toast,
			Loading
		},
		data() {
			return {
				token: '',
				show: false,
				show2: false,
				toastType: 'success',
				toastText: '',
				valueIs: true,
				myAddressData: false,
				myAddressNoData: false,
				myAddressItems: [],
				//      {
				//        id: '001',
				//        name: '江',
				//        phone: '13917916888',
				//        address: '上海市市辖区闵行区xxx路56号',
				//        textarea: '这里是详细地址',
				//        isSure: true,
				//      },
				//      {
				//        id: '002',
				//        name: '江',
				//        phone: '13917916888',
				//        address: '上海市市辖区闵行区xxx路56号',
				//        textarea: '这里是详细地址',
				//        isSure: true,
				//      }
				//    
				imgNodata: imgNodata
			}
		},
		methods: {
			isDefaultFn(data) {
				console.log(JSON.stringify(data));
				this.show2 = true;
				setTimeout(() => {
					this.show2 = false;
				}, 3000)
				this.$http.post('I_SCRM_WX_INTERFACE_037.action', {
					openId: this.token,
					...data
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.show2 = false;
						this.toastText = msg;
						this.show = true;
						this.loadingAddr();
					}
				});
			},
			handleAdd() {
				this.$router.push({
					name: '添加新地址'
				});
			},
			handleEdit(data, index) {
				sessionStorage.setItem("setAddr", JSON.stringify(data));
				this.$router.push({
					name: '修改地址'
				});
			},
			handleDelete(id) {
				this.show2 = true;
				setTimeout(() => {
					this.show2 = false;
				}, 3000)
				this.$http.post('I_SCRM_WX_INTERFACE_045.action', {
					openId: this.token,
					id: id
				}).then((res) => {
					this.show2 = false;
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.toastText = msg;
						this.show = true;
						this.loadingAddr();
					}
				});
			},
			loadingAddr() {
				this.$http.post('I_SCRM_WX_INTERFACE_035.action', {
					openId: this.token,
					"start": "0", //可为空
					"limit": "10" //可为空
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.show2 = false;
						if(msg.length > 0) {
							this.myAddressData = true;
							this.myAddressNoData = false;
						} else {
							this.myAddressData = false;
							this.myAddressNoData = true;
						}
						this.myAddressItems = [];
						msg.forEach((val, index) => {
							if(val.isDefault == "true") {
								this.myAddressItems.push({
									...val,
									isDefault: true
								});
							} else {
								this.myAddressItems.push({
									...val,
									isDefault: false
								});
							}
						})
						console.log(JSON.stringify(msg) + "035")
					}
				});
			}
		},
		computed: {
			getFormData() {
				return this.$route.params.formData;
			},
			getPageType() {
				return this.$route.params.pageType;
			}
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
			this.show2 = true;
			this.loadingAddr();
		}
	}
</script>

<style lang="less">
	.app-container {
		// background: #f8f8f8;
	}
	
	.listMyAddress {
		text-align: center;
		img {
			width: 394*@rem;
			height: 254*@rem;
			margin: 270*@rem auto 84*@rem;
		}
		p {
			margin-bottom: 318*@rem;
			font-size: 30*@rem;
		}
	}
	
	.listMyAddressItems {
		// padding: 50*@rem;
		font-size: 30*@rem;
		color: #3b3b3b;
		background: #FFF;
		.nap {
			padding: 44*@rem 50*@rem 0;
			.nap-name {
				margin-right: 78*@rem;
				margin-bottom: 36*@rem;
			}
		}
		.address {
			padding: 36*@rem 20*@rem 34*@rem;
			margin: 0 30*@rem;
			border-bottom: 1px solid #dcdcdc;
			color: #949494;
			font-size: 24*@rem;
		}
		.caa {
			display: block;
			height: 50*@rem;
			padding: 30*@rem 0 24*@rem;
			margin: 0 50*@rem;
			color: #949494;
			font-size: 24*@rem;
			.caa-isSure {
				padding: 0;
				margin: 0;
			}
			.caa-btn {
				float: right;
				.dsh-btn {
					float: left;
					margin-left: 28*@rem;
				}
			}
		}
	}
	
	.btnData {
		padding: 40*@rem 0;
		padding-top: 25*@rem;
		background: #fff;
	}
</style>