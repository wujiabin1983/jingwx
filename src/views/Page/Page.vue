<!--外部跳转中间页-->
<template>
	<div id="page-box" class="pageContent">
		<loading :show="show2" text="跳转中..."></loading>
	</div>
</template>
<script>
	import { Loading } from 'vux'
	export default {
		name: '会员邀请',
		components: {
			Loading
		},
		data() {
			return {
				show2: false,
				token: ''
			}
		},
		methods: {
			// 获取 openId及参数
			GetRequest() {
				let url = window.location.href // 获取url中"?"符后的字串
				// let url = 'http://dsh.nat200.top/scrmwxweb/#/ActivePhone?openId=153009308784600069&reqOpenId=oHJ6q06AWJ3zLjoPuEU9vmPLqUdM&activityId=null'
				let theRequest = {}
				if(url.indexOf('?') >= 0) {
					let strArr = url.split('?')[1].split('&')
					// console.log(strArr, 'aaaa');
					strArr.forEach(val => {
						let str = val.split('=')
						// console.log(str, 'ddddddd')
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
				//或者return false;
				e.preventDefault();
			};
			if(window.location.href.split('=')[1]) {
				this.token = window.location.href.split('=')[1];
				localStorage.setItem("token", this.token);
			} else if(localStorage.getItem("token")) {
				this.token = localStorage.getItem("token");
			}
//			this.$http.post('getSignInfo.action', {
//				openId: this.token,
//				url: encodeURIComponent(window.location.href.split('#')[0])
//			}).then((res) => {
//				let data = res.data,
//					code = data.returnCode,
//					msg = data.returnMsg,
//					that = this;
//				if(code == '0') {
//					this.show2 = false;
//					wx.config({
//						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
//						appId: msg.appId, // 必填，公众号的唯一标识
//						timestamp: msg.timestamp, // 必填，生成签名的时间戳
//						nonceStr: msg.nonceStr, // 必填，生成签名的随机串
//						signature: msg.signature, // 必填，签名，见附录1
//						jsApiList: ['hideMenuItems']
//						// 必填，需要使用的JS接口列表，所有JS接口列表见附录2
//					});
//					wx.ready(function() {
//						wx.hideMenuItems({
//							menuList: ["menuItem:share:timeline", //分享到朋友圈
//								"menuItem:share:appMessage", //发送给朋友
//								"menuItem:share:qq", //分享到QQ
//								"menuItem:share:weiboApp", //分享到Weibo
//								"menuItem:favorite", //收藏
//								"menuItem:share:facebook", //分享到FB
//								"menuItem:share:QZone", //分享到 QQ 空间
//								"menuItem:editTag", //编辑标签
//								"menuItem:delete", //删除
//								"menuItem:copyUrl", //复制链接
//								"menuItem:originPage", //原网页
//								"menuItem:readMode", //阅读模式
//								"menuItem:openWithQQBrowser", //在QQ浏览器中打开
//								"menuItem:openWithSafari", //在Safari中打开
//								"menuItem:share:email", //邮件
//								"menuItem:share:brand"
//							] //一些特殊公众号
//							// 要隐藏的菜单项，只能隐藏“传播类”和“保护类”按钮
//						})
//					})
//				}
//			});
			let url = window.location.href;
			let params = url.split("?")[0];
			if(params) {
				let param2 = url.substr(params.length + 8, url.length);
				let array = param2.split("&");
				let length = array[array.length - 1].length;
				param2 = param2.substr(0, param2.length - length - 1);
				if(param2.length > 200) {
					window.location.href = param2;
				}
				//				this.$http.post(param2).then((res) => {
				//					let data = res.data,
				//						code = data.returnCode,
				//						msg = data.returnMsg;
				//				});
			}
		}
	}
</script>
<style lang="less">

</style>