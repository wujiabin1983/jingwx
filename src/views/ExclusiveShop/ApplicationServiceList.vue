<!--申请服务列表-->
<template lang="html">
	<box class="app">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="app-container">
			<div class="dsh-group"></div>
			<scroller lock-x :height="height" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="100">
				<div class="box2">
					<x-table class="dsh-table" :cell-bordered="false" :full-bordered="false" :content-bordered="false" style="background-color:#fff;">
						<thead>
							<tr>
								<th>服务类型</th>
								<th>申请时间</th>
								<th>状态</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="item in applicationServiceList" :key="item.time" @click="handleListInfo(item)">
								<td>{{item.questionType}}</td>
								<td>{{item.questionDate}}</td>
								<td>{{item.status}}</td>
							</tr>
						</tbody>
					</x-table>
					<load-more tip="loading" v-if="loadMore"></load-more>
				</div>
			</scroller>
		</div>
	</box>
</template>

<script>
	import { Box, Group, XTable, Scroller, LoadMore } from 'vux'
	// const ToggleText = () => import('./ToggleText.vue').then(m => m.default)
	// const DshButton = () => import('@/components/DshButton/DshButton.vue').then(m => m.default)
	// const DshBr = () => import('@/components/DshBr/DshBr.vue').then(m => m.default)
	export default {
		name: '申请记录',
		components: {
			Box,
			Group,
			XTable,
			Scroller,
			LoadMore,
		},
		data() {
			return {
				token:'',
				height: '',
				loadMore:true,
				bottomCount: 0,
				applicationServiceList: []
			}
		},
		methods: {
			handleListInfo(item) {
				sessionStorage.setItem("pageDataService",JSON.stringify(item));
				this.$router.push({
					name: '申请记录详情'
				});
			},
			onScrollBottom() {
				if(this.onFetching) {
					// do nothing
				} else {
					this.onFetching = true
					setTimeout(() => {
						this.bottomCount += 5
						this.loadingMoreData(this.bottomCount);
						this.$nextTick(() => {
							this.$refs.scrollerBottom.reset()
						})
						this.onFetching = false
					}, 2000)
				}
			},
			loadingMoreData(start) {
				let params = {
					openId:this.token,
					start: start,
					limit: 6
				}
				this.$http.post('I_SCRM_WX_INTERFACE_031.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.applicationServiceList = msg;
						if(msg.length<params.limit){
							this.loadMore=false;
							this.onFetching = true;
						}
						console.log(JSON.stringify(msg))
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
			this.height = document.body.offsetHeight + "px";
			this.loadingMoreData(this.bottomCount);
		}
	}
</script>

<style lang="less">
	.dsh-table tr {
		border-bottom: 1*@rem solid #D5D5D6;
	}
</style>