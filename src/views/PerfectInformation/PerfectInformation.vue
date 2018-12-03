<!--完善资料-->
<template lang="html">
	<box class="app">
		<div class="app-container">
			<div class="perfectInfo-container" v-if="data">
				<img :src="ActivePhone" />
				<dsh-br></dsh-br>
				<group class="dsh-group" v-for="item in perfectOption" :key="item.name">
					<cell :title="item.name" :isRequired="item.isRequired" :value="item.values" style="background: #fff;" is-link @click.native="clickFn(item.type,item.name,item.values,item.defaultDesc,item.length)"></cell>
				</group>
				<dsh-button type="primary" size="490" class="perfectInfo-button" @click.native="clickInfo" :disabled="false" title="提交" text="提交"></dsh-button>
			</div>

			<div class="perfectInfo-noList" v-if="noData">
				<img :src="biaoqing" />
				<p>没有设置更多可完善的资料</p>
			</div>
			<popup v-model="show1" height="40%">
				<div class="container-pop">
					<popup-header title="" left-text="取消" @on-click-left="show1 = false" @on-click-right="enterSelectEnter" right-text="确定">
					</popup-header>
					<group gutter="0">
						<radio :options="roleData" v-model="roleRadio"></radio>
					</group>
				</div>
			</popup>
			<popup v-model="show" height="100%">
				<div class="container-pop">
					<popup-header title="" left-text="取消" @on-click-left="show = false" @on-click-right="enterMemberEnter" right-text="确定">
					</popup-header>
					<group gutter="0">
						<x-input class="dsh-input" :title="title" v-model="valString" :placeholder="placeholder"></x-input>
					</group>
				</div>
			</popup>
			<toast v-model="showToast" :type="toastType" width="8rem">{{toastText}}</toast>
		</div>
	</box>
</template>

<script>
	import biaoqing from '@/assets/biaoqing.png'
	import ActivePhone from '@/assets/ActivePhone.png'
	import { Cell, Group, Confirm, PopupHeader, Radio, Popup, Box, XInput, Datetime, Toast } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)
	export default {
		name: '完善个人资料',
		components: {
			DshBr,
			Cell,
			Group,
			DshButton,
			Confirm,
			Radio,
			Box,
			PopupHeader,
			Popup,
			XInput,
			Datetime,
			Toast
		},
		data() {
			return {
				token: '',
				showToast: false,
				toastText: '',
				toastType: 'warn',
				biaoqing: biaoqing,
				placeholder: '',
				title: '',
				valString: '',
				dateString: '',
				roleData: [],
				value: '12',
				expectedMember: '',
				role: '',
				roleRadio: '',
				show: false,
				show1: false,
				form: {},
				ActivePhone: '',
				perfectOption: [],
				clickType: '',
				clickName: '',
				defaultDesc:'',
				length:'',
				data: false,
				noData: false,
				dataInfo:[]//布局查询返回值
			}
		},
		methods: {
			//提交
			clickInfo() {
//								console.log(JSON.stringify(this.perfectOption))
				let count = 0;
				let flag = 0;
				this.perfectOption.forEach((val, index) => {
					if(val.isRequired) {
						if(val.values == "") {
							if(val.type == "文本(选择)" || val.type == "日期") {
								this.showToast = true;
								this.toastText = '请选择' + val.name;
								this.toastType = 'warn';
								return false;
							}
							if(val.type == "文本(录入)" || val.type == "数值") {
								this.showToast = true;
								this.toastText = '请输入' + val.name;
								this.toastType = 'warn';
								return false;
							}
						}
					}
				})
				if(flag == count) {
//					console.log(JSON.stringify(this.form));
					this.$http.post('I_SCRM_WX_INTERFACE_039.action', {
						openId: this.token,
						...this.form
					}).then((res) => {
						let data = res.data,
							code = data.returnCode,
							msg = data.returnMsg;
//						console.log(JSON.stringify(data) + '039')
						if(code == '0') {
							this.showToast = true;
							this.toastText = msg;
							this.toastType = 'success';
							this.loadingData(this.form);
						}
					});
				}
				//				console.log(flag,count)
			},
			change(value) {
				this.perfectOption.forEach((val, index) => {
					if(value == val.name) {
						console.log(val)
						this.perfectOption[index].values = this.dateString;
						this.form[this.perfectOption[index].value] = this.dateString;
					}
				})
//				console.log(JSON.stringify(this.form))
			},
			//下拉框点击确定
			enterSelectEnter(value) {
//				console.log(this.roleRadio);
				if(this.roleRadio == "") {
					this.showToast = true;
					this.toastText = '请选择' + this.clickName;
					this.toastType = 'warn';
					return false;
				}
				this.perfectOption.forEach((val, index) => {
					if(this.clickName == val.name) {
						this.perfectOption[index].values = this.roleRadio;
						this.form[this.perfectOption[index].value] = this.roleRadio;
					}
				})
				this.role = this.roleRadio;
				this.show1 = false;
//				console.log(JSON.stringify(this.form))
			},
			//输入框点击确定
			enterMemberEnter(value) {
				const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
				const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
				const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
				const regDouble = /^\d+(\.\d+)?$/;
//				console.log(this.valString);
				if(this.valString == "") {
					this.showToast = true;
					this.toastText = '请输入' + this.clickName;
					this.toastType = 'warn';
					return false;
				}
				if(this.clickName == "手机号码"&&!reg.test(this.valString)) {
					this.toastText = "请输入正确手机号";
					this.showToast = true;
					this.toastType = 'warn';
					return false;
				}
				if(this.clickName == "邮箱"&&!regEmail.test(this.valString)) {
					this.toastText = "请输入正确邮箱";
					this.showToast = true;
					this.toastType = 'warn';
					return false;
				}
				if(this.clickName == "证件号码"&&!regIdCard.test(this.valString)) {
					this.toastText = "请输入正确身份证号";
					this.showToast = true;
					this.toastType = 'warn';
					return false;
				}
				if(this.clickType == "数值"&&!regDouble.test(this.valString)) {
					this.toastText = this.clickName+'请输入有效数字';
					this.showToast = true;
					this.toastType = 'warn';
					return false;
				}
				if(this.valString.length>this.length){
					this.showToast = true;
					this.toastText = this.clickName+'的最大长度是' + this.length;
					this.toastType = 'warn';
					return false;
				}
				this.perfectOption.forEach((val, index) => {
					if(this.clickName == val.name) {
						this.perfectOption[index].values = this.valString;
						this.form[this.perfectOption[index].value] = this.valString;
					}
				})
				this.valString = '';
				this.title = '';
				this.placeholder = '';
				this.show = false;
//				console.log(JSON.stringify(this.form))
			},
			loadingSelect(type) {
				this.$http.post('I_SCRM_WX_INTERFACE_003.action', {
					openId: this.token,
					type: type
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
//					console.log(JSON.stringify(data) + '003')
					if(code == '0') {
						this.roleData = msg;
					}
				});
			},
			clickFn(type, name, value,defaultDesc,length) {
				this.clickType = type;
				this.clickName = name;
				this.defaultDesc = defaultDesc;
				this.length = length;
//				console.log(defaultDesc)
				if(type == "文本(录入)" || type == "数值") {
					this.show = true;
					this.title = name + "：";
					this.valString = value;
					this.placeholder =defaultDesc;
				}
				if(type == "文本(选择)") {
					this.show1 = true;
					this.loadingSelectData(name);
//					if(name == "证件类型") {
//						this.roleData = ['身份证'];
//					} else if(name == "婚姻状况") {
//						this.roleData = ['已婚', '未婚'];
//					} else if(name == "学历") {
//						this.roleData = ['小学', '初中', '高中', '大专', '本科', '研究生', '其他'];
//					} else if(name == "身高") {
//						this.roleData = ['150cm以下', '150cm~155cm', '155cm~160cm', '160cm~165cm', '165cm~170cm', '170cm~175cm', '175cm~180cm', '180cm~185cm', '185cm以上'];
//					} else {
//						this.roleData = [];
//					}
//					console.log(type,name,value)
					
					this.roleRadio = value;
					//					this.loadingSelect(name);
				}
				if(type == "日期") {
					let that = this;
					this.$vux.datetime.show({
						cancelText: '取消',
						confirmText: '确定',
						format: 'YYYY-MM-DD',
						value: '1990-01-01',
						minYear: "1900",
						endDate: this.dateStr,
						onConfirm(values) {
							that.perfectOption.forEach((val, index) => {
								if(that.clickName == val.name) {
									that.perfectOption[index].values = values;
									that.form[that.perfectOption[index].value] = values;
								}
							})
						},
						onShow() {},
						onHide(val) {}
					})
				}
			},
			loadingSelectData(name){
				this.$http.post('I_SCRM_WX_INTERFACE_064.action', {
					openId: this.token,
					name:name
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
//					console.log(JSON.stringify(data) + '064')
					if(code == '0') {
						this.roleData=[];
						msg.forEach((val,index)=>{
							this.roleData.push(val.name)
						})
					}
				})
				
			},
			loadingData(obj) {
				this.$http.post('I_SCRM_WX_INTERFACE_050.action', {
					openId: this.token,
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
//					console.log(JSON.stringify(data) + '050')
					if(code == '0') {
						for(var key in msg) {
							for(var formKey in obj) {
								if(key == formKey) {
									obj[key] = msg[key];
								}
							}
							this.perfectOption.forEach((val, index) => {
								if(val.value == key) {
									this.perfectOption[index].values = msg[key];
								}
							})
						}
					}
				})
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
			this.$http.post('I_SCRM_WX_INTERFACE_003.action', {
				openId: this.token,
			}).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg;
				console.log(JSON.stringify(data) + '003')
				if(code == '0') {
					this.dataInfo=msg.pageContent;
					if(JSON.stringify(msg) != "{}" && msg.pageContent.length > 0) {
						this.data = true;
						let obj = "{";
						msg.pageContent.forEach((val, index) => {
							this.perfectOption.push({
								values: '',
								placeholder: '',
								value: val.value,
								...val
							})
							obj += "\"" + val.value + "\":\"" + '' + "\",";
						})
						obj = obj.substr(0, obj.length - 1);
						obj += "}";
						this.form = JSON.parse(obj);
						this.loadingData(this.form);
						//						console.log(JSON.parse(obj))
						if(msg.bgUrl != "") {
							this.ActivePhone = msg.bgUrl;
						} else {
							this.ActivePhone = ActivePhone;
						}
					} else {
						this.noData = true;
					}
				}
			});
		}
	}
</script>

<style lang="less">
	.perfectInfo-container {
		img {
			width: 100%;
		}
		.perfectInfo-button {
			margin-top: 110*@rem;
			margin-bottom: 20*@rem;
		}
		.dsh-group {
			border-bottom: 1px solid #D9D9D9
		}
		.dsh-group .vux-label {
			font-size: 34*@rem;
		}
		.dsh-group .weui-cells {
			font-size: 30*@rem;
			p {
				font-size: 34*@rem;
			}
		}
		.weui-cells::before {
			border: none;
			height: 0;
		}
		.weui-cells::after {
			border: none;
			height: 0;
		}
	}
	
	.container-pop {
		height: 100%;
		.weui-cells {
			padding-top: 0;
			font-size: 30*@rem;
		}
		.vux-popup-header {
			font-size: 34*@rem;
		}
	}
	
	.perfectInfo-noList {
		padding-top: 378*@rem;
		img {
			width: 348*@rem;
			height: 216*@rem;
			display: block;
			margin: 0 auto;
		}
		p {
			text-align: center;
			margin-top: 56*@rem;
			color: #aaa;
		}
	}
	.vux-popup-dialog .container-pop{
		width: 100%;
	}
</style>