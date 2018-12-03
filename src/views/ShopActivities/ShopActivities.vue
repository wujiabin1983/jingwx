<!--门店活动列表-->
<template lang="html">
	<box class="app">
		<div class="app-container">
			<div class="activity-container">
				<div class="activity-item" v-if="data" v-for="item in activityList" :key="item.name">
					<div class="activity-date">{{item.pushDate}}</div>
					<div class="activity-info">
						<div class="activity-img">
							<img :src="item.coverUrl" />
							<div class="activity-title">{{item.activityTitle}}</div>
						</div>
						<div class="activity-summary"><span>{{item.summary}}</span></div>
						<div class="activity-btn" @click="clickInfo(item)">
							阅读全文
							<img :src="more" />
						</div>
					</div>
				</div>
				<div class="shopActivities" v-if="noData">
					<img :src="biaoqing" />
					<p>暂时还没有更多的活动</p>
				</div>
			</div>
		</div>
	</box>
</template>

<script>
	import biaoqing from '@/assets/biaoqing.png'
	import more from '@/assets/more.png'
	import { Box } from 'vux'
	export default {
		name: '门店活动',
		components: {
			Box
		},
		data() {
			return {
				token: '',
				biaoqing: biaoqing,
				data: false,
				noData: false,
				more: more,
				activityList: [],
				//				{
				//					id: "1",
				//					activityDate: "2018年12月20日  18:32",
				//					activityTitle: "标题",
				//					summary: "摘要",
				//					coverUrl: "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1527746186&di=44ca8c16ebc2f259cce34724b0cc7d91&src=http://img.redocn.com/sheji/20141227/taobaoyifufuzhuangguanggaobeijing_3784203.jpg"
				//				}, {
				//					id: "2",
				//					activityDate: "2018年12月20日  18:32",
				//					activityTitle: "标题",
				//					summary: "摘要",
				//					coverUrl: "https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1527746186&di=44ca8c16ebc2f259cce34724b0cc7d91&src=http://img.redocn.com/sheji/20141227/taobaoyifufuzhuangguanggaobeijing_3784203.jpg"
				//				}
			}
		},
		methods: {
			clickInfo(data) {
				sessionStorage.setItem("formData", JSON.stringify(data));
				sessionStorage.setItem("storeId", this.getPageData);
				this.$router.push({
					name: '门店活动详情'
				});
			},
		},
		computed: {
			getPageData() {
				return this.$route.params.formData;
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
			this.$http.post('I_SCRM_WX_INTERFACE_011.action', {
				openId: this.token,
				"storeId": this.getPageData
			}).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg;
				console.log(JSON.stringify(data))
				if(code == '0') {
					this.activityList = msg;
					if(msg.length > 0) {
						this.data = true;
					} else {
						this.noData = true;
					}
					//					this.storeActivity.params.formData = msg.storeId;
				}
			});
		}
	}
</script>

<style lang="less">
	.activity-container {
		padding: 0 24*@rem;
		.activity-item {
			padding-top: 40*@rem;
			margin-bottom: 20*@rem;
			.activity-date {
				width: 240*@rem;
				height: 48*@rem;
				line-height: 48*@rem;
				border-radius: 6*@rem;
				background: #d3d3d3;
				color: #fff;
				text-align: center;
				font-size: 20*@rem;
				display: block;
				margin: 0 auto;
			}
			.activity-info {
				width: 700*@rem;
				height: 520*@rem;
				border-radius: 10*@rem;
				box-shadow: 3px 3px 12px #b8b8b8;
				margin: 0 auto;
				margin-top: 40*@rem;
				background: #fff;
				.activity-img {
					position: relative;
					height: 354*@rem;
					img {
						width: 100%;
						height: 100%;
					}
					.activity-title {
						width: 100%;
						height: 70*@rem;
						line-height: 70*@rem;
						font-size: 30*@rem;
						color: #fff;
						background: rgba(0, 0, 0, 0.2);
						padding-left: 30*@rem;
						position: absolute;
						bottom: 0;
						left: 0;
						box-sizing: border-box;
					}
				}
				.activity-summary {
					height: 86*@rem;
					line-height: 86*@rem;
					padding: 0 15*@rem;
					span {
						width: 100%;
						padding: 0 15*@rem;
						font-size: 28*@rem;
						color: #3b3b3b;
						display: block;
						border-bottom: 1*@rem solid #e5e5e5;
						box-sizing: border-box;
					}
				}
				.activity-btn {
					width: 100%;
					height: 80*@rem;
					line-height: 80*@rem;
					color: #929292;
					font-size: 24*@rem;
					padding: 0 30*@rem;
					position: relative;
					box-sizing: border-box;
					img {
						width: 14*@rem;
						height: 24*@rem;
						display: block;
						position: absolute;
						top: 28*@rem;
						right: 30*@rem;
					}
				}
			}
		}
		.shopActivities {
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
	}
</style>