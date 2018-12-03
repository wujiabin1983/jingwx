<!--申请服务详情-->
<template lang="html">
	<box class="app">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="app-container">
			<div class="dsh-group"></div>
			<div class="group-application-service-info">
				<group class="dsh-group-no-border dsh-group">
					<cell title="申请类型" :value="tempType" style="background: #fff;"></cell>
				</group>
				<group class="dsh-group-no-border dsh-group" v-for="item in tempOption" :key="item.name">
					<cell :title="item.name" :value="formSub[item.key]" style="background: #fff;"></cell>
				</group>
				<dsh-button class="btn-register" v-if="status=='待处理'" type="primary" @click.native="closeApply" :size="490" text="取消申请"></dsh-button>
			</div>
		</div>
		<toast v-model="show" type="success" width="20em">{{toastText}}</toast>
		<loading :show="show2" text=""></loading>
	</box>
</template>

<script>
	import { Box, Group, Cell,Toast, Loading } from 'vux'
	// const ToggleText = () => import('./ToggleText.vue').then(m => m.default)
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)
	export default {
		name: '申请服务',
		components: {
			Box,
			Group,
			DshBr,
			Cell,
			DshButton,
			Toast,
			Loading
		},
		data() {
			return {
				token:'',
				show:false,
				show2:false,
				toastText:'',
				tempType:'',
				tempOption: [],
				formSub: {},
				status:'',
			}
		},
		methods: {
			handleApplicationRecard() {
				this.$router.push({
					name: '申请记录'
				});
			},
			closeApply(){
				this.show2 = true;
				setTimeout(() => {
					this.show2 = false;
				}, 3000)
				let params = {
					openId:this.token,
					id: JSON.parse(sessionStorage.getItem("pageDataService")).id
				}
				this.$http.post('I_SCRM_WX_INTERFACE_051.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.show2 = false;
						this.show=true;
						this.toastText=msg;
						this.status="已取消";
					}
				})
			},
		},
		computed: {
			getPageType() {
				return this.$route.params.pageType
			},
			getPageData() {
				return this.$route.params.pageData
			}
		},
		created() {
			document.oncontextmenu = function(e) {
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
			this.status=JSON.parse(sessionStorage.getItem("pageDataService")).status;
			let params = {
				openId:this.token,
				id: JSON.parse(sessionStorage.getItem("pageDataService")).id
			}
			this.$http.post('I_SCRM_WX_INTERFACE_032.action', params).then((res) => {
				let data1 = res.data,
					code1 = data1.returnCode,
					msg1 = data1.returnMsg;
				if(code1 == '0') {
//					console.log(JSON.stringify(msg1))
					this.tempType=msg1.tempType;
					this.formSub = msg1.tempApply;
					for(var key in this.formSub){
						this.formSub[key]=this.formSub[key].split(":")[1];
					}
					this.$http.post('I_SCRM_WX_INTERFACE_029.action', {
						openId:this.token,
						tempId: msg1.tempId
					}).then((res) => {
						let data = res.data,
							code = data.returnCode,
							msg = data.returnMsg;
//					console.log(JSON.stringify(msg))
						if(code == '0') {
							let tempData = msg.tempApply;
							this.tempOption = [];
							tempData.forEach((val, index) => {
								this.tempOption.push({
									name: val.value.name,
									key: val.value.key
								})
							})
						}
					})
				}
			})
		}
	}
</script>

<style lang="less">
	.group-application-service-info {
		.vux-cell-box:not(:first-child)::before {
			border-top: none;
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
		// 服务类型
		.dsh-picker .weui-label {
			font-size: 26*@rem;
		}
		// 预约时间
		.dsh-datetime p {
			font-size: 26*@rem;
		}
		// 备注
		.dsh-textarea {
			height: auto!important;
			.weui-textarea {
				font-size: 26*@rem!important;
			}
		}
		.btn-register {
			padding-top: (394 * 0.6)*@rem;
		}
	}
</style>