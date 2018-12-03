<!--附件门店-->
<template lang="html">
	<box class="app dsh-box">
		<div class="app-container">
			<!--<div class="dsh-group"></div>-->
			<div class="location">
				<div class="nearby-position">
					<img class="location-icon" :src="location" />
					<div class="location-text" @click="cutCityFn">
						<span class="selectInfo">{{cityName}}</span>
						<img class="location-icon1" :src="xiala" />
					</div>
				</div>
				<div class="nearby-search">
					<input type="text" v-model="storeName" placeholder="请输入门店名称" />
					<img class="location-search" @click="searchFn" :src="seach" />
				</div>
			</div>
			<dsh-br></dsh-br>
			<div class="nearby-container" v-if="storeData">
				<scroller lock-x :height="height" @on-scroll-bottom="onScrollBottomList" ref="scrollerBottomList" :scroll-bottom-offst="100">
					<div>
						<div class="nearby-item" v-for="item in exchangeItemsOne" :key="item.name" @click="stroeInfoFn(item)">
							<div class="content-item">
								<p class="item-title">
									<span class="name">{{item.storeName}}</span>
									<img :src="more" alt="" />
								</p>
								<p class="item-info"><span>{{item.storeAdd}}</span>
									<dsh-button type="primary" size="118" class="item-btn" :disabled="false" :title="item.distance" :text="item.distance"></dsh-button>
								</p>
							</div>
						</div>
						<load-more tip="loading" v-if="loadListData"></load-more>
					</div>
				</scroller>
			</div>
			<div class="nearby-noOrderList" v-if="storeNoData">
				<img :src="biaoqing" />
				<p>暂时没有更多门店哦~</p>
			</div>
			<toast v-model="show" type="warn" width="5rem">定位地址获取失败</toast>
			<toast v-model="showNoData" type="warn" width="6rem">暂无其他地区门店信息</toast>
			<actionsheet v-model="showActionsheet" :menus="actionsheetOption" theme="android" @on-click-menu="click" @on-after-hide="log('after hide')" @on-after-show="log('after show')">
			</actionsheet>
			<loading :show="show2" text=""></loading>
		</div>
	</box>
</template>

<script>
	import biaoqing from '@/assets/biaoqing.png'
	import location from '@/assets/location.png'
	import xiala from '@/assets/xiala.png'
	import more from '@/assets/more.png'
	import seach from '@/assets/seach.png'
	import { Group, Box, Search, Toast, Actionsheet, Loading, Scroller, LoadMore, } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)
	export default {
		name: '附近门店',
		components: {
			DshButton,
			DshBr,
			Group,
			Box,
			Search,
			Toast,
			Actionsheet,
			Loading,
			Scroller,
			LoadMore,
		},
		data() {
			return {
				token: '',
				loadListData: true,
				show2: true,
				storeData: false,
				storeNoData: false,
				showActionsheet: false,
				actionsheetOption: [],
				actionsheetData: [],
				biaoqing: biaoqing,
				show: false,
				areaId: '',
				showNoData: false,
				xiala: xiala,
				more: more,
				seach: seach,
				location: location,
				cityName: '',
				exchangeItemsOne: [],
				longitude: '',
				latitude: '',
				storeName: '',
				start: 0,
				limit: 6,
				height: ''
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
				this.loadingData(params);
			},
			//城市列表选择
			click(value) {
				this.areaId = this.actionsheetData[value].areaId;
				this.cityName = this.actionsheetData[value].areaName;
				this.exchangeItemsOne = [];
				this.start=0;
				let params = {
					start: this.start,
					limit: this.limit
				}
				this.loadingData(params);
			},
			log(str) {
				//		      console.log(str)
				//		      console.log(this.areaId);
			},
			//点击查看城市列表
			cutCityFn() {
				if(this.actionsheetOption.length > 0) {
					this.showActionsheet = true;
				} else {
					this.showNoData = true;
				}
			},
			//查看详情
			stroeInfoFn(data) {
				sessionStorage.setItem('storeDetailId', data.storeId);
				this.$router.push({
					name: '附近门店详情'
				});
			},
			//请求数据
			loadingData(params) {
				this.$http.post('I_SCRM_WX_INTERFACE_009.action', {
					"openId": this.token,
					"longitude": this.longitude,
					"latitude": this.latitude,
					"storeName": this.storeName, //可为空
					"areaId": this.areaId,
					...params
				}).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
					if(code == '0') {
						this.show2 = false;
						if(msg.length > 0) {
							this.storeNoData = false;
							this.storeData = true;
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
						} else {
							this.storeNoData = true;
							this.storeData = false;
							this.exchangeItemsOne = [];
						}
						if(msg.length < params.limit) {
							this.loadListData = false;
							this.onFetching = true;
						}
					}
				});
			},
			//查询列表
			searchFn() {
				this.start=0;
				let params = {
					start: this.start,
					limit: this.limit
				}
				this.exchangeItemsOne = [];
				this.loadingData(params);
			},
			//根据经纬度获取城市名称
			loadingAddr(lng, lat) {
				let that = this;
				let geocoder = null;
				geocoder = new qq.maps.Geocoder();
				var latLng = new qq.maps.LatLng(lat, lng);
				geocoder.getAddress(latLng);
				geocoder.setComplete(function(result) {
					let addComp = result.detail.addressComponents;
					that.cityName = addComp.district;
				});
				geocoder.setError(function(data) {
					that.show = true;
				})
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
			this.height = document.body.offsetHeight - 44 - $(".location").height() + "px";
//			this.$nextTick(function() {
//				this.loadingAddr(this.longitude,this.latitude);
//				let params={
//					start:0,
//					limit:this.limit
//				}
//				this.loadingData(params);
//			})
			
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
									that.loadingAddr(longitude, latitude);
									let params = {
										openId: that.token,
										start: 0,
										limit: that.limit
									}
									that.loadingData(params);
								})
							},
							error: function(res) {}
						});
						setTimeout(() => {
							that.show2 = false;
						}, 15000)
					})
				}
			});
						setTimeout(() => {
							this.show2 = false;
						}, 15000)
			this.$http.post('I_SCRM_WX_INTERFACE_038.action', {
				openId: this.token
			}).then((res) => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg;
				if(code == '0') {
					//					console.log(JSON.stringify(data)+"038");
					this.actionsheetData = msg;
					msg.forEach((val, index) => {
						this.actionsheetOption.push(val.areaName);
					})
				}
			})
		}
	}
</script>

<style lang="less">
	.weui-actionsheet__menu{
		height: 300px;
		overflow: auto;
	}
	.location {
		padding: 0 45*@rem 0 50*@rem;
		overflow: hidden;
		.nearby-position {
			width: 30%;
			height: 90*@rem;
			line-height: 90*@rem;
			float: left;
			background: #fff;
			position: relative;
			box-sizing: border-box;
			padding-left: 25*@rem;
			.location-icon {
				position: absolute;
				left: 0*@rem;
				top: 24*@rem;
				width: 24*@rem;
				height: 34*@rem;
			}
			.location-text {
				display: inline-block;
				min-width: 160*@rem;
				height: 90*@rem;
				position: relative;
				.location-icon1 {
					position: absolute;
					top: 40*@rem;
					width: 18*@rem;
					height: 10*@rem;
				}
				.selectInfo {
					margin: 0 10*@rem;
					height: 90*@rem;
					display: inline-block;
				}
			}
		}
		.nearby-search {
			width: 70%;
			height: 90*@rem;
			line-height: 90*@rem;
			background: #fff;
			float: left;
			position: relative;
			padding-right: 5*@rem;
			box-sizing: border-box;
			input {
				width: 100%;
				padding-left: 25*@rem;
				padding-right: 40*@rem;
				font-size: 22*@rem;
				height: 50*@rem;
				line-height: 50*@rem;
				border: none;
				outline: none;
				border: 1px solid #dcdcdc;
				border-radius: 10*@rem;
				box-sizing: border-box;
			}
			.location-search {
				position: absolute;
				right: 12*@rem;
				top: 24*@rem;
				width: 40*@rem;
				height: 40*@rem;
			}
		}
	}
	
	.nearby-container {
		padding: 0 30*@rem;
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
					display: block;
					font-size: 34*@rem;
					padding-right: 60*@rem;
					box-sizing: border-box;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
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
					display: block;
					color: #949494;
					padding-right: 120*@rem;
					box-sizing: border-box;
					overflow: hidden;
					text-overflow: ellipsis;
					white-space: nowrap;
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