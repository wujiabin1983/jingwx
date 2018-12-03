<!--图文信息详情-->
<template lang="html">
	<box class="app dsh-box">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="attention-public">
			<p class="imageTextTitle">{{msg.imageTextTitle}}</p>
			<div class="otherContent"><span class="author">{{msg.author}}</span><span class="updateDate">{{msg.updateDate}}</span></div>
			<div v-html="msg.mainBody.mb01" class="mainBody"></div>
		</div>
	</box>
</template>

<script>
	import { Box } from 'vux'
	export default {
		name: '图文信息详情',
		components: {
			Box
		},
		data() {
			return {
				token: '',
				id:'',
				msg:{
					"imageTextTitle":"",
					"author":"",
					"coverUrl":"",
					"summary":"",
					"mainBody":{
						"mb01":"",
						"mb02":""
					}
				}
			}
		},
		methods: {
			// 获取 openId及参数
			GetRequest() {
				let url = window.location.href // 获取url中"?"符后的字串
				let theRequest = {}
				if(url.indexOf('?') >= 0) {
					let strArr = url.split('?')[1].split('&')
					strArr.forEach(val => {
						let str = val.split('=')
						theRequest[str[0]] = str[1]
					})
				}
				return theRequest
			}
		},
		computed: {

		},
		created() {
			document.oncontextmenu = function(e) {
				e.preventDefault();
			};
//			http://dsh.nat200.top/scrmwxweb/#/graphicMaterial?openId=153673960652700014&id=S84EPxiZx3JLvJbJtCeWqUMTTaNFr_AL4WdfDDty5oc
//			if(window.location.href.split('=')[1]) {
//				this.token = window.location.href.split('=')[1];
//				localStorage.setItem("token", this.token);
//			} else if(localStorage.getItem("token")) {
//				this.token = localStorage.getItem("token");
//			}
			let getRequest = this.GetRequest();
			if(getRequest.openId) {
				this.token = getRequest.openId;
				this.id=getRequest.id;
				let params={
					openId: this.token,
					id:this.id
				}
				this.$http.post('I_SCRM_WX_INTERFACE_062.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					this.show2 = false;
						console.log(msg)
					if(code == '0') {
						this.msg = msg;
					}
				});
				this.$nextTick(function(){
					this.$http.post('getSignInfo.action', {
						openId: this.token,
						url: encodeURIComponent(window.location.href.split('#')[0])
					}).then((res) => {
						let data = res.data,
							code = data.returnCode,
							msg = data.returnMsg,
							that = this;
							console.log(msg)
						if(code == '0') {
							this.show2 = false;
							wx.config({
								debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
								appId: msg.appId, // 必填，公众号的唯一标识
								timestamp: msg.timestamp, // 必填，生成签名的时间戳
								nonceStr: msg.nonceStr, // 必填，生成签名的随机串
								signature: msg.signature, // 必填，签名，见附录1
								jsApiList: ['hideMenuItems','onMenuShareAppMessage']
								// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
							});
							wx.ready(function() {
								let urlAddr = window.location.href.split("#")[0] + "Page.html?params=" + that.msg.link;
								// 用户点击了分享后执行的回调函数
								wx.onMenuShareAppMessage({
									title: that.msg.imageTextTitle, // 分享标题
									desc: that.msg.summary, // 分享描述
									link: urlAddr, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
									imgUrl: that.msg.imgurl, // 分享图标
									type: '', // 分享类型,music、video或link，不填默认为link
									dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
									success: function() {
										that.$http.post('I_SCRM_WX_INTERFACE_063.action', {
											openId: that.token,
											id:that.id
										}).then((res) => {
											let data = res.data,
												code = data.returnCode,
												msg = data.returnMsg;
											if(code == '0') {
											}
										});
									}
								});
								wx.hideMenuItems({
									menuList: [
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
				})
				
			}
		}
	}
</script>

<style lang="less">
	.attention-public {
		padding: 20*@rem 30*@rem;
		box-sizing: border-box;
		.imageTextTitle{
			line-height: 50*@rem;
			font-size: 40*@rem;
		}
		.otherContent{
			margin-bottom: 40*@rem;
		}
		.author {
			color: #ccc;
			margin-right: 30*@rem;
		}
		.mainBody{
			
		}
		.updateDate{
			color: #ccc;
		}
		p{
			width: 100%;
			overflow: hidden;
			line-height: 20px;
			word-wrap: break-word;
		}
	}
</style>