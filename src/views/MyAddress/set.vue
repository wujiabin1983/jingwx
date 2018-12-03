<!--修改我的地址-->
<template lang="html">
	<box class="app dsh-box">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="app-container">
			<div class="addAddress">
				<group class="dsh-group">
					<x-input class="dsh-input" title="收货人" v-model="groupForm.consigneeName" type="text" placeholder="请输入收货人"></x-input>
					<x-input class="dsh-input" title="联系电话" v-model="groupForm.consigneeTel" type="text" placeholder="请输入联系电话"></x-input>
					<x-address class="dsh-address" title="所在地区" v-model="address" @on-shadow-change="addrChange" :list="addressData" placeholder="请选择"></x-address>
					<x-textarea class="dsh-textarea" v-model="groupForm.addr" placeholder="请输入详细地址" :max="2000" :rows="5"></x-textarea>
					<dsh-br></dsh-br>
					<check-icon :value.sync="groupForm.isDefault">设置为默认地址</check-icon>
					<dsh-button class="btn-save" type="primary" text="保存" :size="490" @click.native="handleSave"></dsh-button>
				</group>
			</div>
			<toast v-model="show" :type="toastType" width="8rem">{{toastText}}</toast>
			<loading :show="show2" text=""></loading>
		</div>
	</box>
</template>

<script>
	import { Box, Group, XInput, XAddress, ChinaAddressV4Data, XTextarea, CheckIcon, Toast, Loading } from 'vux'
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	export default {
		name: '我的地址',
		components: {
			Box,
			Toast,
			Group,
			XInput,
			XAddress,
			XTextarea,
			DshBr,
			DshButton,
			CheckIcon,
			Loading
		},
		data() {
			return {
				addressData: ChinaAddressV4Data,
				show: false,
				show2: false,
				toastType: 'warn',
				token: '',
				address: ["110000", "110100", "110101"],
				groupForm: {
					"consigneeName": "",
					"consigneeTel": "",
					"provinceId": "",
					"provinceName": "",
					"cityId": "",
					"cityName": "",
					"areaId": "",
					"areaName": "",
					"addr": "",
					"isDefault": false
				},
				toastText: '',
				pageType: '',
			}
		},
		methods: {
			addrChange(id, name) {
				console.log(id, name);
				this.groupForm.provinceName = name[0];
				this.groupForm.cityName = name[1];
				this.groupForm.areaName = name[2];
				this.groupForm.provinceId = id[0];
				this.groupForm.cityId = id[1];
				this.groupForm.areaId = id[2];
			},
			handleSave() {
				const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
				console.log(JSON.stringify(this.groupForm));
				if(this.groupForm.consigneeName == "") {
					this.toastText = "请输入收货人姓名";
					this.show = true;
					return false;
				}
				if(this.groupForm.consigneeTel == "") {
					this.toastText = "请输入收货人联系电话";
					this.show = true;
					return false;
				}
				if(!reg.test(this.groupForm.consigneeTel)) {
					this.toastText = "请输入正确收货人联系电话";
					this.show = true;
					return false;
				}
				if(this.groupForm.addr == "") {
					this.toastText = "请输入收货人详细地址";
					this.show = true;
					return false;
				}
				if(this.groupForm.addr.length > 2000) {
					this.toastText = "收货人详细地址不得超过2000";
					this.show = true;
					return false;
				}
				this.show2 = true;
				setTimeout(() => {
					this.show2 = false;
				}, 3000)
				this.$http.post('I_SCRM_WX_INTERFACE_037.action', {
					openId: this.token,
					...this.groupForm
				}).then((res) => {
					this.show2 = false;
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.toastText = msg;
						this.show = true;
						this.toastType = "success";
						setTimeout(() => {
							this.$router.replace({
								name: '我的地址',
							});
						}, 2000)
						console.log(JSON.stringify(msg) + "037");
					}
				});

				//    this.$router.replace({
				//      name: '我的地址',
				//      params: {
				//        pageType: 'addAddress',
				//        formData: JSON.stringify(this.groupForm)
				//      }
				//    });
			}
		},
		computed: {
			getPageData() {
				return this.$route.params.data;
			},
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
			if(sessionStorage.getItem("setAddr")) {
				this.groupForm = JSON.parse(sessionStorage.getItem("setAddr"));
				this.address = [];
				this.address.push(this.groupForm.provinceId);
				this.address.push(this.groupForm.cityId);
				this.address.push(this.groupForm.areaId);
			}
			//		console.log(JSON.stringify(ChinaAddressV4Data))
		}
	}
</script>

<style lang="less">
	.addAddress {
		// 去除上边框
		.weui-cells:before {
			border-top: none!important;
		}
		.dsh-textarea {
			height: auto;
		}
	}
	
	// 去除下边框
	.weui-cells:after {
		border: none!important;
	}
	
	// 设置为默认地址
	.vux-check-icon {
		padding-left: (52 - 15)*@rem;
		padding-top: 52*@rem;
		font-size: 30*@rem;
	}
	
	// 保存
	.btn-save {
		margin-top: 230*@rem;
	}
</style>