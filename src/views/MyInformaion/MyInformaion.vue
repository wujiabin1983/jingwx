<!--我的资料-->
<template lang="html">
	<div class="app">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="app-container myInfomaion">
			<!--			<a href="javascript:void(0);" class="perfectPerInfomaion" @click="perfectPerInfomaion"></a>-->
			<div v-if="this.myInfomaion.flag=='是'">
				<a class="perfectPerInfomaion" @click="perfectClick">完善资料可以领取礼包哦~~~</a>
			</div>
			<group class="dsh-group">
				<cell title="头像" class="cell-head" is-link @click.native="headUrlClick">
					<div slot="value">
						<img :src="myInfomaion.headUrl">
					</div>
				</cell>
			</group>
			<group class="dsh-group" title="基础资料（只能修改一次）">
				<cell title="昵称" :value="myInfomaion.memName" :is-link="memNameFlag" @click.native="nickNameClick"></cell>
				<cell title="性别" :value="myInfomaion.sex" :is-link="sexFlag" @click.native="sexClick"></cell>
				<datetime v-model="myInfomaion.birthday" v-if="birthFlag" @on-confirm="change" default-selected-value="1990-01-01" :min-year="1900" :end-date="dateStr" title="生日"></datetime>
				<cell title="生日" :value="myInfomaion.birthday" v-else></cell>
			</group>
			<group class="dsh-group" title="其他资料">
				<x-address @on-hide="logHide" title="所在城市" v-model="value" :list="addressData" @on-shadow-change="onShadowChange" :show.sync="showAddress"></x-address>
				<cell title="地址" :value="myInfomaion.address" is-link @click.native="addressClick"></cell>
				<cell title="手机号" :value="myInfomaion.mobile" is-link @click.native="mobileClick"></cell>
				<cell title="入会时间" :value="myInfomaion.becomeDate"></cell>
			</group>
		</div>
		<!--性别-->
		<popup v-model="show" height="30%">
			<div class="container-pop">
				<popup-header title="" left-text="取消" @on-click-left="show = false" @on-click-right="enterMemberEnter" right-text="确定">
				</popup-header>
				<group gutter="0" class="show-group">
					<radio :options="roleData" v-model="form.sex"></radio>
				</group>
			</div>
		</popup>
		<!--昵称-->
		<popup v-model="showText" height="100%">
			<div class="container-pop">
				<popup-header title="" left-text="取消" @on-click-left="showText = false" @on-click-right="enterNickName" right-text="确定">
				</popup-header>
				<group gutter="0" class="show-group">
					<x-input class="dsh-input" title="昵称：" v-model="form.memName" type="text" placeholder="请输入昵称"></x-input>
				</group>
			</div>
		</popup>
		<!--手机号-->
		<popup v-model="showMobile" height="100%">
			<div class="container-pop">
				<popup-header title="" left-text="取消" @on-click-left="showMobile = false" @on-click-right="enterMobile" right-text="确定">
				</popup-header>
				<group gutter="0" class="show-group mobile-input">
					<x-input class="dsh-input" title="手机号：" v-model="form.mobile" type="text" placeholder="请输入手机号"></x-input>
					<span @click="getCode" v-if="showCode">获取验证码</span>
					<span v-if="!showCode">{{count}}</span>
				</group>
				<group gutter="0" class="show-group">
					<x-input class="dsh-input" title="验证码：" v-model="code" type="text" placeholder="请输入验证码"></x-input>
				</group>
			</div>
		</popup>
		<!--地址-->
		<popup v-model="addressShow" height="100%">
			<div class="container-pop">
				<popup-header title="" left-text="取消" @on-click-left="addressShow = false" @on-click-right="enterAddress" right-text="确定">
				</popup-header>
				<group gutter="0" class="show-group">
					<x-input class="dsh-input" title="地址：" v-model="form.address" type="text" placeholder="请输入地址"></x-input>
				</group>
			</div>
		</popup>
		<toast v-model="showToast" :type="toastType" width="8rem">{{toastText}}</toast>
		<loading :show="show2" text=""></loading>
	</div>
</template>

<script>
	import viewInvitationRecortHead from '@/assets/ViewInvitationRecortHead.png'
	import { Group, Cell, ChinaAddressData, XAddress, PopupHeader, Radio, Popup, Datetime, XInput, Marquee, MarqueeItem, Toast, Loading } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const TIME_COUNT = 60;
	export default {
		name: '我的资料',
		components: {
			Group,
			Cell,
			XAddress,
			PopupHeader,
			Radio,
			Popup,
			Datetime,
			XInput,
			Marquee,
			MarqueeItem,
			Toast,
			Loading
		},
		data() {
			return {
				token: '',
				showCode: true,
				count: '',
				timer: null,
				toastText: '修改成功！',
				toastType: 'warn',
				show2: false,
				showToast: false,
				memNameFlag: true,
				birthFlag: true,
				sexFlag: true,
				localId: [],
				serverId: [],
				value: [],
				addressShow: false,
				showAddress: false,
				showText: false,
				showMobile: false,
				addressData: ChinaAddressData,
				show: false, //选择下拉框
				roleRadio: '', //下拉框选择的值
				roleData: ['男', '女'], //下拉框的数据容器
				code: '',
				dateStr: '',
				myInfomaion: {
					headUrl: "",
					memName: "",
					sex: "",
					birthday: "",
					address: "",
					provinceId: "",
					provinceName: "",
					cityId: "",
					cityName: "",
					areaId: "",
					areaName: "",
					mobile: "",
					becomeDate: ""
				},
				form: {
					headUrl: "",
					memName: "",
					sex: "",
					birthday: "",
					address: "",
					provinceId: "",
					provinceName: "",
					cityId: "",
					cityName: "",
					areaId: "",
					areaName: "",
					mobile: "",
					becomeDate: ""
				}
			}
		},
		methods: {
			perfectPerInfomaion() {
				this.$router.push({
					name: '完善个人资料'
				});
			},
			//头像点击事件
			headUrlClick() {
				this.show2 = true;
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
							jsApiList: ['downloadImage', 'chooseImage', 'uploadImage']
							// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
						});
						wx.ready(function() {
							wx.chooseImage({
								debug: false,
								count: 1, // 限制图片最多选3张
								sizeType: ['compressed'], // 指定是压缩图
								success: function(res) {
									let localIds = res.localIds;
									that.myInfomaion.headUrl = localIds[0];
									// 下面是点击图片的时候获取当前第几个图片并且启用咱们做的调用微信图片浏览器的函数
									// 判断是手机是苹果手机
									if(window.__wxjs_is_wkwebview) {
										wx.getLocalImgData({
											localId: localIds[0],
											success: function(res) {
												if(res.localData > 0) {
													that.myInfomaion.headUrl = res.localData;
												}
											}
										});
									}
									wx.uploadImage({
										localId: localIds[0],
										isShowProgressTips: 1,
										success: function(res) {
											var serverId = res.serverId; // 返回图片的服务器端ID		请求方法传给后台
											var form = {
												openId: that.token,
												headUrl: serverId
											}
											that.setMyInformaion(form);
										}
									});
								},
								error: function(res) {
									this.toastText = "系统繁忙，请刷新页面后再试";
									this.showToast = true;
									this.toastType = "warn";
								}
							});
						}, function(data) {
							this.toastText = "系统繁忙，请刷新页面后重试";
							this.showToast = true;
							this.toastType = "warn";
						})
					}
				});
			},
			//性别点击事件
			sexClick() {
				if(this.sexFlag) {
					this.form.sex = this.myInfomaion.sex;
					this.show = true;
				}
			},
			//昵称点击事件
			nickNameClick() {
				if(this.memNameFlag) {
					this.showText = true;
					this.form.memName = this.myInfomaion.memName;
				}
			},
			//手机号点击事件
			mobileClick() {
				this.showMobile = true;
				this.form.mobile = this.myInfomaion.mobile;
			},
			//地址点击事件
			addressClick() {
				this.addressShow = true;
				this.form.address = this.myInfomaion.address;
			},
			//获取验证码
			getCode() {
				const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
				if(this.form.mobile == "") {
					this.toastText = "请输入手机号";
					this.toastType = 'warn';
					this.showToast = true;
					return false;
				}
				if(!reg.test(this.form.mobile)) {
					this.toastText = "请输入正确手机号";
					this.toastType = 'warn';
					this.showToast = true;
					return false;
				}
				this.show2 = true;
				setTimeout(() => {
					this.show2 = false;
				}, 3000)
				this.$http.post('I_SCRM_WX_INTERFACE_047.action', {
					openId: this.token,
					mobile: this.form.mobile
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.toastText = "发送成功!";
						this.toastType = 'success';
						this.showToast = true;
						this.show2 = false;
						if(!this.timer) {
							this.count = TIME_COUNT;
							this.showCode = false;
							this.timer = setInterval(() => {
								if(this.count > 0 && this.count <= TIME_COUNT) {
									this.count--;
								} else {
									this.showCode = true;
									clearInterval(this.timer);
									this.timer = null;
								}
							}, 1000)
						}
					}
				});
			},
			//监听生日
			change(value) {
				this.show2 = true;
				var form = {
					openId: this.token,
					birthDay: value
				}
				console.log(form)
				this.setMyInformaion(form);
			},
			//监听所属城市
			onShadowChange(id, name) {
				this.form.provinceName = name[0];
				this.form.cityName = name[1];
				this.form.areaName = name[2];
				this.form.provinceId = id[0];
				this.form.cityId = id[1];
				this.form.areaId = id[2];
			},
			//性别修改
			enterMemberEnter(value) {
				this.show2 = true;
				var form = {
					openId: this.token,
					sex: this.form.sex
				}
				this.setMyInformaion(form);
				this.show = false;
			},
			//昵称修改
			enterNickName() {
				if(this.form.memName == "") {
					this.toastText = "请输入昵称";
					this.toastType = 'warn';
					this.showToast = true;
					return false;
				}
				this.show2 = true;
				var form = {
					openId: this.token,
					memName: this.form.memName
				}
				this.setMyInformaion(form);
				this.showText = false;
			},
			//手机号修改
			enterMobile() {
				this.show2 = true;
				var form = {
					openId: this.token,
					mobile: this.form.mobile,
					code: this.code
				}
				console.log(form)
				this.setMyInformaion(form);
				this.showMobile = false;
			},
			//地址修改
			enterAddress() {
				if(this.form.address == "") {
					this.toastText = "请输入地址";
					this.toastType = 'warn';
					this.showToast = true;
					return false;
				}
				this.show2 = true;
				var form = {
					openId: this.token,
					addr: this.form.address
				}
				this.setMyInformaion(form);
				this.addressShow = false;
			},
			//所在城市修改
			logHide(str) {
				if(str) {
					this.show2 = true;
					var form = {
						openId: this.token,
						provinceName: this.form.provinceName,
						cityName: this.form.cityName,
						areaName: this.form.areaName,
						provinceId: this.form.provinceId,
						cityId: this.form.cityId,
						areaId: this.form.areaId
					}
					console.log(form)
					this.setMyInformaion(form);
				}
			},
			setMyInformaion(form) {
				this.$http.post('I_SCRM_WX_INTERFACE_048.action', form).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.toastText = "修改成功!";
						this.toastType = 'success';
						this.showToast = true;
						this.show2 = false;
						this.loadingData();
					}
				});
			},
			//查询
			loadingData() {
				this.show2 = true;
				this.$http.post('I_SCRM_WX_INTERFACE_027.action', {
					openId: this.token
				}).then((res) => {
					console.log(JSON.stringify(res) + "027");
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.show2 = false;
						this.myInfomaion = msg;
						this.value = [msg.provinceId, msg.cityId, msg.areaId];
						if(msg.updateFlag != "") {
							let flagArray = msg.updateFlag.split("");
							flagArray.forEach((val, index) => {
								if(val == "0") {
									this.memNameFlag = false;
								}
								if(val == "1") {
									this.sexFlag = false;
								}
								if(val == "2") {
									this.birthFlag = false;
								}
							})
						} else {
							this.memNameFlag = true;
							this.sexFlag = true;
							this.birthFlag = true;
						}
					}
				})
			},
			perfectClick() {
				this.$router.push({
					name: '完善个人资料'
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
			var month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1);
			var day = new Date().getDate() < 10 ? '0' + (new Date().getDate()) : (new Date().getDate());
			this.dateStr = new Date().getFullYear() + '-' + month + '-' + day;
			console.log(this.dateStr)
			//			const year = oDate.getFullYear();
			//			const month = oDate.getMonth()+1;   //获取系统月份，由于月份是从0开始计算，所以要加1
			//			const day = oDate.getDate(); 
			this.loadingData();
		}
	}
</script>

<style lang="less">
	.show-group {
		height: 100*@rem;
		.weui-cells {
			padding: 0;
		}
	}
	
	.myInfomaion {
		.perfectPerInfomaion {
			padding-left: 40*@rem;
			height: 80*@rem;
			line-height: 80*@rem;
			color: #1992ff;
		}
		.dsh-group {
			.weui-cell {
				padding: 0 40*@rem;
				height: 82*@rem;
				line-height: 82*@rem;
			}
			.cell-head {
				height: 130*@rem;
				img {
					width: 80*@rem;
					height: 80*@rem;
					margin-top: 30*@rem;
					border-radius: 50%;
				}
			}
			.vux-label {
				font-size: 30*@rem;
			}
			.weui-cell__ft {
				font-size: 24*@rem;
			}
			.weui-cells {
				font-size: 30*@rem;
			}
		}
	}
	
	.mobile-input {
		position: relative;
		span {
			display: block;
			font-size: 30*@rem;
			position: absolute;
			right: 20*@rem;
			top: 20*@rem;
			background: #fff;
			border: 1px solid #949494;
			border-radius: 10*@rem;
			padding: 10*@rem 15*@rem;
		}
	}
	.vux-popup-dialog .container-pop{
		width: 100%;
	}
</style>