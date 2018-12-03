<!--申请服务-->
<template lang="html">
	<box class="app">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="app-container">
			<!-- <div class="dsh-group"></div> -->
			<div class="group-application-service">
				<group class="dsh-group-no-border dsh-group">
					<dsh-br></dsh-br>
					<cell title="服务类型" :value="form.tempName" style="background: #fff;" is-link @click.native="clickFn"></cell>
				</group>
				<group class="dsh-group-no-border dsh-group" v-for="item in tempOption" :key="item.name">
					<cell :title="item.name" :value="formSub[item.key]" style="background: #fff;" is-link @click.native="clickInfo(item)"></cell>
					<!--<x-input class="dsh-input" :title="item.name" v-model="formSub[item.key]" type="text" placeholder="请输入"></x-input>-->
				</group>
				<group class="dsh-group-no-border dsh-group">
				 	<x-textarea :max="20" placeholder="备注：" v-model="remark" @on-focus="onEvent('focus')" @on-blur="onEvent('blur')"></x-textarea>
				</group>
				<dsh-button class="btn-register" type="primary" :size="490" text="提交" @click.native="submitFn"></dsh-button>
				<div class="a-application-recard">
					<span @click="handleApplicationRecard">查看申请记录</span>
				</div>
			</div>
		</div>
		<popup v-model="show" height="40%">
			<div class="container-pop">
				<popup-header title="" left-text="取消" @on-click-left="show = false" @on-click-right="enterSelectEnter" right-text="确定">
				</popup-header>
				<group gutter="0" class="dsh-group">
					<radio :options="typeItems" v-model="roleRadio"></radio>
				</group>
			</div>
		</popup>
		<popup v-model="showText" height="100%">
			<div class="container-pop">
				<popup-header title="" left-text="取消" @on-click-left="showText = false" @on-click-right="enterMemberEnter" right-text="确定">
				</popup-header>
				<group gutter="0" class="dsh-group">
					<x-input class="dsh-input" :title="title" v-model="valString" :placeholder="placeholder"></x-input>
    			</group>
			</div>
		</popup>
		<loading :show="show2" text=""></loading>
		<toast v-model="showToast" :type="toastType" width="8rem">{{toastText}}</toast>
	</box>
</template>

<script>
	import { Box, Group, Cell, PopupPicker, Datetime,  PopupHeader, XTextarea,Radio, Popup, XInput, Loading,Toast} from 'vux'
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
			PopupPicker,
			Datetime,
			XTextarea,
			PopupHeader,
			Radio,
			Popup,
			XInput,
			Loading,
			Toast
		},
		data() {
			return {
				remark:'',
				token:'',
				toastType:'success',
				toastText:'',
				showToast:false,
				show2:false,
				placeholder:'',
				valString:'',
				title:'',
				showText:false,//输入弹出
				show:false,//选择弹出
				data:[],//存放服务类型数据
				tempOption:[],//动态项数组
				roleRadio:'',//选中的服务类型
				typeItems: [],//服务类型选择数组
				form: {
					tempName:'',
					tempId:'',
				},
				formData:{
					
				},
				formSub:{},
				clickType:'',
				clickName:'',
			}
		},
		methods: {
			onEvent(){
				
			},
			//提交
			submitFn(){
				if(this.form.tempId==""){
					this.showToast=true;
					this.toastText="请选择服务类型";
					this.toastType="warn";
					return false;
				}
				this.formData.remarks='备注:'+this.remark;
				let params={
					openId:this.token,
					tempId: this.form.tempId,
					tempType:this.form.tempName,
					tempApply:this.formData
				}
				console.log(JSON.stringify(params));
//				return false;
				this.$http.post('I_SCRM_WX_INTERFACE_030.action',params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.showToast=true;
						this.toastText=msg;
						this.toastType="success";
						this.tempOption=[];
						this.formSub={};
						this.form={
							tempName:'',
							tempId:''
						};
					}
				})
			},
			//动态项点击事件
			clickInfo(data){
				this.placeholder='请输入'+data.name;
				this.valString='';
				this.title=data.name;
				this.clickType=data.key;
				this.clickName=data.name;
				this.showText=true;
			},
			//文本弹窗确认
			enterMemberEnter(){
				console.log(this.valString)
				if(this.valString!=""){
					this.formSub[this.clickType]=this.valString;
					this.formData[this.clickType]=this.clickName+":"+this.valString;
					this.showText=false;
				}else{
					this.showToast=true;
					this.toastText="请输入"+this.clickName;
					this.toastType="warn";
				}
			},
			//服务类型点击事件
			clickFn(){
				this.show=true;
			},
			//选择服务类型
			enterSelectEnter(){
				console.log(this.roleRadio);
				if(this.roleRadio!=""){
					this.data.forEach((val,index)=>{
						if(val.tempType==this.roleRadio){
							this.show=false;
							this.form.tempId=val.tempId;
							this.form.tempName=val.tempType;
							let params={
								openId:this.token,
								tempId:val.tempId
							}
							this.show2=true;
					    	setTimeout(() => {
								this.show2=false;
					      	}, 3000)
							this.selectTempInfo(params);
						}
					})
				}else{
					this.showToast=true;
					this.toastText="请选择服务类型";
					this.toastType="warn";
				}
			},
			//查看申请记录
			handleApplicationRecard() {
				this.$router.push({
					name: '申请记录'
				});
			},
			//选择服务类型之后生成动态项
			selectTempInfo(params){
				this.$http.post('I_SCRM_WX_INTERFACE_029.action',params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.show=false;
						let tempData=msg.tempApply;
						this.tempOption=[];
						this.formSub={};
						console.log(JSON.stringify(msg))
						tempData.forEach((val,index)=>{
							this.tempOption.push({
								name:val.value.name,
								key:val.value.key
							})
							this.formSub[val.value.key]='';
						})
						this.show2=false;
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
			//请求服务类型
			this.$http.post('I_SCRM_WX_INTERFACE_028.action',{
				openId:this.token
			}).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg;
				if(code == '0') {
					console.log(JSON.stringify(msg)+"028")
					msg.forEach((val,index)=>{
						this.typeItems.push(val.tempType);
					})
					this.data=msg;
				}
			})
		}
	}
</script>

<style lang="less">
	.group-application-service {
		.dsh-group .vux-label{
			font-size: 34*@rem;
		}
		.dsh-group .weui-cells{
			font-size: 30*@rem;
			padding: 0;
			p{
				font-size: 34*@rem;
			}
		}
		.vux-cell-box:not(:first-child)::before {
			border-top: none;
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
		.a-application-recard {
			margin-top: 42*@rem;
			font-size: 30*@rem;
			color: #5486dd;
			text-align: center;
		}
	}
	.vux-popup-dialog .container-pop{
		width: 100%;
	}
</style>