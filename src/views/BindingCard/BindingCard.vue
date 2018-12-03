<!--绑定会员卡-->
<template lang="html">
	<box class="app">
		<div class="app-container">
			<div class="bindingCard-container">
				<group class="dsh-group mobile-input" v-if="formShow.mobile">
					<x-input class="dsh-input" title="手机号" v-model="form.mobile" type="text" placeholder="请输入手机号"></x-input>
					<span @click="getCode" v-if="showCode&&formShow.verificationCode">获取验证码</span>
					<span v-if="!showCode&&formShow.verificationCode">{{count}}</span>
				</group>
				<group class="dsh-group" v-if="formShow.verificationCode">
					<x-input class="dsh-input" title="验证码" v-model="form.number" type="text" placeholder="请输入验证码"></x-input>
				</group>
				<group class="dsh-group" v-if="formShow.birthday">
					<x-input class="dsh-input" title="生日" v-model="form.birthday" @click.native="birClick" type="text" placeholder="请选择生日"></x-input>
				</group>
				<group class="dsh-group" v-if="formShow.cardNo">
					<x-input class="dsh-input" title="会员卡号" v-model="form.cardNo" type="text" placeholder="请输入会员卡号"></x-input>
				</group>
				<group class="dsh-group" v-if="formShow.password">
					<x-input class="dsh-input" title="密码" v-model="form.password" type="password" placeholder="请输入密码"></x-input>
				</group>
				<dsh-button type="primary" @click.native="bindingCardFn" class="bindingCard-btn" size="490" :disabled="false" title="立即绑定" text="立即绑定"></dsh-button>
				<span class="bindingCard-history" @click="historyFn">查看绑卡历史</span>
			</div>
			<toast v-model="show" :type="toastType" width="20em">{{toastText}}</toast>
			<loading :show="show2" text=""></loading>
		</div>
	</box>
</template>

<script>
	import { Box, Group, XInput, Toast, Loading } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const TIME_COUNT = 60;
	export default {
		name: '绑定会员卡',
		components: {
			Box,
			DshButton,
			Group,
			XInput,
			Toast,
			Loading
		},
		data() {
			return {
				token:'',
				dateStr:'',
				show2:false,
				toastText: '',
				toastType: 'warn',
				show: false,
				showCode: true,
		        count: '',
		        timer: null,
				form: {
					mobile: '',
					birthday: '',
					number: '',
					cardNo: '',
					password: '',
				},
				formShow: {
					mobile: false,
					verificationCode:false,
					birthday: false,
					cardNo: false,
					password: false,
				},
			}
		},
		methods: {
			birClick(){
				let that = this;
				this.$vux.datetime.show({
			        cancelText: '取消',
			        confirmText: '确定',
			        format: 'YYYY-MM-DD',
			        value: '1990-01-01',
			        minYear:"1900",
			        endDate:this.dateStr,
			        onConfirm (val) {
		        		that.form.birthday=val;
			        },
			        onShow () {
			        },
			        onHide (val) {
			        }
			      })
			},
			//获取验证码
			getCode() {
				const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
				if(this.form.mobile == "") {
					this.toastText = "请输入手机号";
					this.toastType = 'warn';
					this.show = true;
					return false;
				}
				if(!reg.test(this.form.mobile)) {
					this.toastText = "请输入正确手机号";
					this.toastType = 'warn';
					this.show = true;
					return false;
				}
				this.show2 = true;
				setTimeout(() => {
					this.show2 = false;
				}, 3000)
				this.$http.post('I_SCRM_WX_INTERFACE_047.action', {
	    			openId:this.token,
					mobile: this.form.mobile
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.toastText = "发送成功!";
						this.toastType = 'success';
						this.showCode = true;
						this.show2 = false;
						if (!this.timer) {
				            this.count = TIME_COUNT;
				            this.showCode = false;
				            this.timer = setInterval(() => {
				              	if (this.count > 0 && this.count <= TIME_COUNT) {
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
			bindingCardFn(value, $event) {
				if(this.form.mobile == ""&&this.formShow.mobile) {
					this.toastText = '请输入手机号';
					this.toastType = 'warn';
					this.show = true;
					return false;
				}
				let reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
				console.log(reg.test(this.mobile))
				if(!reg.test(this.form.mobile)&&this.formShow.mobile) {
					this.toastText = '请输入正确的手机号';
					this.toastType = 'warn';
					this.show = true;
					return false;
				}
				if(this.form.number == ""&&this.formShow.verificationCode) {
					this.toastText = '请输入验证码';
					this.toastType = 'warn';
					this.show = true;
					return false;
				}
				if(this.form.birthday == ""&&this.formShow.birthday) {
					this.toastText = '请选择生日';
					this.toastType = 'warn';
					this.show = true;
					return false;
				}
				if(this.form.cardNo == ""&&this.formShow.cardNo) {
					this.toastText = '请输入会员卡号';
					this.toastType = 'warn';
					this.show = true;
					return false;
				}
				if(this.form.password == ""&&this.formShow.password) {
					this.toastText = '请输入密码';
					this.toastType = 'warn';
					this.show = true;
					return false;
				}
				this.show2 = true;
				setTimeout(() => {
					this.show2 = false;
				}, 3000)
				this.$http.post('I_SCRM_WX_INTERFACE_043.action', {
	    			openId:this.token,
	    			...this.form
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.toastText = msg;
						this.toastType = 'success';
						this.show = true;
						this.show2 = false;
						setTimeout(() => {
							this.$router.push({
								name: '绑定会员卡成功',
							});
						}, 2000)
					}
				})
			},
			historyFn() {
				this.$router.push({
					name: '绑定会员卡历史',
				});
			}
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
				openId:this.token,
				url: encodeURIComponent(window.location.href.split('#')[0])
			}).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg,
					that = this;
				if(code == '0') {
					this.show2=false;
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
			                menuList: ["menuItem:share:timeline",//分享到朋友圈
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
			                	"menuItem:share:brand"] //一些特殊公众号
			                	// 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
			            })
					})
				}
			});
			var month =new Date().getMonth()+1<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1);
			var day =new Date().getDate()<10?'0'+(new Date().getDate()):(new Date().getDate());
			this.dateStr =new Date().getFullYear()+'-'+month+'-'+day;
			this.$http.post('I_SCRM_WX_INTERFACE_005.action',{
    			openId:this.token
			}).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg;
				if(code == '0') {
					this.formShow = msg.bindOption;
					console.log(JSON.stringify(msg) + "005")
				}
			});
		}
	}
</script>

<style lang="less">
	.bindingCard-container {
		padding-top: 24*@rem;
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
		/*.bindingCard{
			background: #FFFFFF;
			padding: 0 20*@rem;
			p{
				padding: 0 30*@rem;
				border-bottom:1*@rem solid #bcbcbc;
			}
			span{
				display: inline-block;
				width: 172*@rem;
				height: 86*@rem;
				line-height: 86*@rem;
				color: 3b3b3b;
				font-size: 30*@rem;
			}
			input{
				border: none;
				outline: none;
			}
		}*/
		.dsh-group .weui-cells {
			padding: 0;
		}
		.bindingCard-btn {
			margin-top: 300*@rem;
		}
		.bindingCard-history {
			width: 100%;
			height: 30*@rem;
			line-height: 30*@rem;
			display: block;
			margin: 0 auto;
			margin-top: 38*@rem;
			text-align: center;
			color: #5486dd;
		}
	}
</style>