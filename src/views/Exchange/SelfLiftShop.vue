<!--自提门店-->
<template lang="html">
	<box class="app">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="app-container" v-if="storeData">
			<div class="dsh-group"></div>
			<div class="nearby-container">
				<scroller lock-x :height="height" @on-scroll-bottom="onScrollBottomList" ref="scrollerBottomList" :scroll-bottom-offst="100">
					<div>
						<div class="nearby-item" v-for="item in exchangeItemsOne" :key="item.name" @click="handleDetailsInfo(item.storeId)">
							<div class="content-item">
								<p class="item-title">
									<span class="name">{{item.storeName}}</span>
									<img src="../../assets/more.png" alt="" />
								</p>
								<p class="item-info">
									<span>{{item.storeAdd}}</span>
									<dsh-button type="primary" size="118" class="item-btn" :disabled="false" :title="item.distance" :text="item.distance"></dsh-button>
								</p>
							</div>
						</div>
						<load-more tip="loading" v-if="loadListData"></load-more>
					</div>
				</scroller>
			</div>
		</div>
		<div class="nearby-noOrderList" v-if="storeNoData">
			<img :src="biaoqing" />
			<p>暂时没有更多自提门店哦~</p>
		</div>
		<loading :show="show2" text=""></loading>
	</box>
</template>

<script>
	import { Box, Group ,Loading,Scroller, LoadMore} from 'vux'
	import biaoqing from '@/assets/biaoqing.png'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)
	// const DetailOfNearbyStore = () => import('/@/views/ExclusiveShop/DetailOfNearbyStore.vue').then(m => m.default)
	export default {
		name: '自提门店',
		components: {
			Box,
			Group,
			DshButton,
			Scroller,
			LoadMore,
			Loading
		},
		data() {
			return {
				loadListData: true,
				biaoqing:biaoqing,
				storeData:false,
				storeNoData:false,
				show2:true,
				token: '',
				height:'',
				longitude: '',
				latitude: '',
				exchangeItemsOne: [],
				start:0,
				limit:7
			}
		},
		methods: {
			//分页列表
			onScrollBottomList() {
				if(this.onFetching) {
					// do nothing
				} else {
					this.onFetching = true
					setTimeout(() => {
						this.loadingMoreListData();
						this.$nextTick(() => {
							this.$refs.scrollerBottomList.reset()
						})
						this.onFetching = false
					}, 2000)
				}
			},
			loadingMoreListData() {
				this.start += 6;
				let params = {
					start: this.start,
					limit: this.limit
				}
				this.loadingStoreData(params);
			},
			handleDetailsInfo(storeId) {
				sessionStorage.setItem('storeDetailId', storeId);
				this.$router.push({
					name: '自提门店详情'
				});
			},
			loadingStoreData(param) {
				let params = {
					openId: this.token,
					lng: this.longitude,
					lat: this.latitude,
					id: JSON.parse(sessionStorage.getItem("goodsId")).id,
					start:param.start,
					limit:param.limit
				}
				console.log(params)
				setTimeout(function(){
					this.show2=false;
				},15000)
				this.$http.post('I_SCRM_WX_INTERFACE_024.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
//					console.log(JSON.stringify(data) + '024')
					this.show2=false;
					if(code == '0') {
						if(msg.length>0){
							this.storeData=true;
							this.storeNoData=false;
						}else{
							this.storeData=false;
							this.storeNoData=true;
						}
						msg.forEach((val, index) => {
							var distance = val.distance==""?"":parseFloat(val.distance).toFixed(2) + "km";
							this.exchangeItemsOne.push({
								id: val.id,
								storeId: val.storeId,
								storeName: val.storeName,
								storeAdd: val.storeAdd,
								distance: distance
							})	
						})
						if(msg.length < params.limit) {
							this.loadListData = false;
							this.onFetching = true;
						}
					}
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
			this.height = document.body.offsetHeight +"px";
			this.$http.post('getSignInfo.action', {
				openId: this.token,
				url: encodeURIComponent(window.location.href.split('#')[0])
			}).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg,
					that = this;
				if(code == '0') {
					wx.config({
						debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
						appId: msg.appId, // 必填，公众号的唯一标识
						timestamp: msg.timestamp, // 必填，生成签名的时间戳
						nonceStr: msg.nonceStr, // 必填，生成签名的随机串
						signature: msg.signature, // 必填，签名，见附录1
						jsApiList: ['getLocation','hideMenuItems']
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
						wx.getLocation({
							type: 'gcj02', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
							success: function(res) {
								var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
								var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
								var speed = res.speed; // 速度，以米/每秒计
								var accuracy = res.accuracy; // 位置精度
								that.latitude = latitude;
								that.longitude = longitude;
								that.$nextTick(function() {
									let param={
										start:0,
										limit:that.limit
									}
									that.loadingStoreData(param);
								})
							},
							error: function(res) {}
						});
					})
				}
			});
		}
	}
</script>

<style lang="less">
	.nearby-container {
		padding: 0 20*@rem 0 30*@rem;
		background: #FFF;
		.nearby-item {
			display: flex;
			justify-content: flex-start;
			border-bottom: 1*@rem solid #CCC;
		}
		.content-item {
			width: 100%;
			position: relative;
			.item-title {
				height: 108*@rem;
				line-height: 108*@rem;
				padding: 0 20*@rem;
				position: relative;
				span {
					font-size: 34*@rem;
				}
				img {
					right: 40*@rem;
					top: 40*@rem;
					position: absolute;
					width: 20*@rem;
					height: 28*@rem;
				}
			}
			.item-info {
				height: 88*@rem;
				line-height: 88*@rem;
				padding: 0 20*@rem;
				position: relative;
				span {
					width:80%;
					height: 88*@rem;
					display: block;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
					color: #949494;
				}
				.item-btn {
					position: absolute;
					right: 10*@rem;
					top: 20*@rem;
					width: 120*@rem;
					height: 42*@rem;
				}
			}
		}
	}
	.nearby-noOrderList {
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
</style>