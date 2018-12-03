<!--积分兑换商城-->
<template lang="html">
	<box class="dsh-box">
		<!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
		<div class="app-container">
			<div class="dsh-group"></div>
			<view-box>
				<div class="tab-top-exchange" slot="header" body-padding-top="50">
					<tab>
						<tab-item selected @on-item-click="handleTabClick">积分兑换</tab-item>
						<tab-item @on-item-click="handleTabClick">兑换记录</tab-item>
					</tab>
				</div>
				<div class="tab-container-exchange">
					<div class="tab-one" v-if="exchangeItemName == '积分兑换'">
						<div v-if="exchangeItemsOneLength">
							<dsh-empty text="暂无兑换活动~"></dsh-empty>
						</div>
						<scroller v-else lock-x :height="height" @on-scroll-bottom="onScrollBottomList" ref="scrollerBottomList" :scroll-bottom-offst="100">
							<div>
								<div class="tab-header-one-exchange">
									<div class="dsh-select-user" @click="handleTypeSearch">
										<span>{{typeName}}</span>
										<x-icon type="ios-arrow-down" size="20"></x-icon>
									</div>
									<div class="dsh-input-user">
										<input class="vux-1px" type="text" v-model="searchForm.searchContent" placeholder="请输入兑换商品名称" name="" value="">
										<img src="../../assets/seach.png" alt="search" @click="handleSearch">
									</div>
								</div>
								<dsh-br></dsh-br>
								<div class="items-exchange">
									<div class="item-exchange" v-for="item in exchangeItemsOne" :data-id="item.id" :key="item.id" @click="handleDetails(item.id,item.type)">
										<div class="img-item">
											<img :src="item.iconUrl" alt="">
										</div>
										<div class="content-item">
											<span class="name">{{item.exchangeName}}</span>
											<span class="num">剩余数量: {{item.surplusQty}}</span>
											<span class="time">截止时间: {{item.endDate}}</span>
											<span class="amount" v-if="item.amount!=''">兑换金额: <i class="inte-num-orange">{{item.amount}}元</i></span>
											<span class="inte" v-if="item.integralValue!=''">兑换积分: <i class="inte-num-orange">{{item.integralValue}}</i></span>
											<span class="btn-acitve">
                      <dsh-button type="primary" :size="130" :text="item.btnText" :disabled="item.btnDis" @click.native.stop="handleActive(item)"></dsh-button>
                    </span>
										</div>
									</div>
								</div>
								<load-more tip="loading" v-if="loadListData"></load-more>
							</div>
						</scroller>
					</div>
					<div class="tab-two" v-if="exchangeItemName == '兑换记录'">
						<div v-if="exchangeItemsTwoLength">
							<dsh-empty text="暂无兑换记录~"></dsh-empty>
						</div>
						<scroller v-else lock-x :height="height" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="100">
							<div>
								<div class="items-exchange">
									<div class="item-exchange" v-for="item in exchangeItemsTwo">
										<div class="img-item">
											<img :src="item.iconUrl" alt="">
										</div>
										<div class="content-item">
											<span class="name">{{item.exchangeName}}</span>
											<span class="num">剩余数量: {{item.surplusQty}}</span>
											<span class="time">截止时间: {{item.endDate}}</span>
											<span class="inte">兑换积分: <i class="inte-num-orange">{{item.integralValue}}</i></span>
											<span class="btn-acitve">
                      <dsh-button type="primary" :size="130" text="已兑换"></dsh-button>
                    </span>
										</div>
									</div>
								</div>
								<load-more tip="loading" v-if="loadListInfoData"></load-more>
							</div>
						</scroller>
					</div>
					<div>
						<confirm v-model="showInte" :close-on-confirm="false" title="" @on-confirm="onConfirm">
							<p style="text-align:center;">您确定要兑换吗？</p>
						</confirm>
					</div>
					<actionsheet v-model="showActionsheet" :menus="actionsheetOption" theme="android" @on-click-menu="click" @on-after-hide="log('after hide')" @on-after-show="log('after show')">
					</actionsheet>
				</div>
				<loading :show="show2" text=""></loading>
				<toast v-model="show" type="success" width="20em">{{toastText}}</toast>
			</view-box>
		</div>
	</box>
</template>

<script>
	import { Box, Group, Scroller, LoadMore, Toast, Tab, Actionsheet, TabItem, Loading,ViewBox, Confirm, TransferDomDirective as TransferDom } from 'vux'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	const DshBr = () =>
		import('@/components/DshBr/DshBr.vue').then(m => m.default)
	const DshEmpty = () =>
		import('@/components/DshEmpty/DshEmpty.vue').then(m => m.default)

	import imgExchange1 from '@/assets/imgExchange1.png'
	export default {
		name: '积分兑换',
		directives: {
			TransferDom
		},
		components: {
			Scroller,
			LoadMore,
			Box,
			Group,
			Toast,
			Tab,
			TabItem,
			DshBr,
			DshButton,
			ViewBox,
			DshEmpty,
			Confirm,
			Loading,
			Actionsheet
		},
		data() {
			return {
				show2:false,
				token:'',
				btnDis:false,//兑换按钮disabeled
				btnText:'立即兑换',//兑换按钮名称
				loadListData:true,//兑换列表加载更多
				loadListInfoData:true,//兑换记录加载更多
				typeName: '全部分类',//兑换类型
				toastText: '',//提示窗信息
				show: false,//提示窗显隐
				height: '200px',//上拉加载高度
				showActionsheet: false,//兑换类型弹窗
				actionsheetOption: ['全部分类', '积分兑礼', '积分兑券'],//兑换列表查询条件-兑换类型
//				img: {
//					imgExchange1: imgExchange1
//				},
				exchangeItemsOneLength: false,//兑换列表空页面
				exchangeItemsTwoLength: false,//兑换记录空页面
				listInfoCount: 0,
				listCount: 0,//积分兑换列表limit
				searchForm: {//积分兑换查询条件
					type: '',//积分兑换类型
					searchContent: '',//积分兑换名称
				},
				changeData: '',//兑换数据容器
				exchangeItemName: '积分兑换', // tabs页签
				exchangeItemsOne: [],//积分兑换列表
				exchangeItemsTwo: [],//兑换记录列表
				showInte: false,//兑换弹窗
				textInte: ''
			}
		},
		methods: {
			//兑换记录
			onScrollBottom() {
				if(this.onFetchingInfo) {
					// do nothing
				} else {
					this.onFetchingInfo = true
					setTimeout(() => {
						this.loadingMoreData();
						this.$nextTick(() => {
							this.$refs.scrollerBottom.reset()
						})
						this.onFetchingInfo = false
					}, 2000)
				}
			},
			loadingMoreData() {
				this.listInfoCount += 5;
				let params = {
					openId:this.token,
					start: this.listInfoCount,
					limit: 6,
					...this.searchForm
				}
//				console.log(JSON.stringify(params))
				this.loadingListInfo(params);
			},
			//兑换列表
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
				this.listCount += 5;
				let params = {
					openId:this.token,
					start: this.listCount,
					limit: 6,
					...this.searchForm
				}
				this.loadingListChange(params);
			},
			//点击兑换列表类型，显示弹窗
			handleTypeSearch() {
				this.showActionsheet = true;
			},
			log() {

			},
			//选择兑换列表类型，加载数据
			click(value) {
				if(value == 0) {
					this.searchForm.type = '';
				} else {
					this.searchForm.type = value - 1;
				}
				this.typeName = this.actionsheetOption[value];
				let params = {
					openId:this.token,
					start: 0,
					limit: 6,
					...this.searchForm
				}
				this.loadingListChange(params);
			},
			// 查询
			handleSearch() {
				let params = {
					openId:this.token,
					start: 0,
					limit: 6,
					...this.searchForm
				}
				this.loadingListChange(params);
			},
			// 选项卡切换
			handleTabClick(i) {
				this.showActionsheet = false;
				if(i == 0) {
					this.listCount=0;
					this.exchangeItemName = '积分兑换';
					let params = {
						openId:this.token,
						start: this.listCount,
						limit: 6,
						...this.searchForm
					}
					this.loadingListChange(params);
				} else {
					this.listInfoCount=0;
					this.exchangeItemName = '兑换记录';
					let params = {
						openId:this.token,
						start: this.listInfoCount,
						limit: 6
					}
					this.loadingListInfo(params);
				}
			},
			// 按钮兑换操作
			handleActive(inte) {
				this.showInte = true;
				this.changeData = inte;
			},
			// 确认兑换
			onConfirm() {
				this.show2=true;
				let params = {
					openId:this.token,
					id: this.changeData.id,
					type: this.changeData.type
				}
				this.$http.post('I_SCRM_WX_INTERFACE_055.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
//					console.log(JSON.stringify(data) + '055')
					if(code == '0') {
						this.show2=false;
						this.toastText = msg;
						this.show = true;
						let params = {
							openId:this.token,
							start: this.listCount,
							limit: 6,
							...this.searchForm
						}
						this.loadingListChange(params);
					}else{
						this.show2=false;
					}
				});
				this.showInte = false;
			},
			// 查看详情
			handleDetails(id, type) {
				let params = {
					openId:this.token,
					id: id,
					type: type
				}
				sessionStorage.setItem("goodsId", JSON.stringify(params));
				this.$router.push({
					name: '商品详情'
				});
			},
			//请求积分兑换列表
			loadingListChange(params) {
				this.show2=true;
				this.$http.post('I_SCRM_WX_INTERFACE_021.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
//					console.log(JSON.stringify(data) + '021')
					this.show2=false;
					if(code == '0') {
						this.exchangeItemsOne=[];
						msg.forEach((val,index)=>{
							this.exchangeItemsOne.push({
								...val
							});
							if(val.buttonInfo=='立即兑换'){
								this.exchangeItemsOne[index].btnText='立即兑换';
								this.exchangeItemsOne[index].btnDis=false;
							}else{
								this.exchangeItemsOne[index].btnText=val.buttonInfo;
								this.exchangeItemsOne[index].btnDis=true;
							}
						})
						console.log(JSON.stringify(this.exchangeItemsOne))
						//当类型是全部分类的时候且没有数据时，显示没有数据的空页面
						if(msg.length == 0 && params.type.length == 0&&params.searchContent=="") {
							console.log(params.type)
							this.exchangeItemsOneLength = true;
						}
						if(msg.length<params.limit){
							this.loadListData=false;
							this.onFetching = true;
						}
					}
				});
			},
			//请求积分兑换记录列表
			loadingListInfo(params) {
				this.show2=true;
				this.$http.post('I_SCRM_WX_INTERFACE_022.action', params).then((res) => {
					let data = res.data,
						code = data.returnCode,
						msg = data.returnMsg;
//					console.log(JSON.stringify(data) + '022')
					this.show2=false;
					if(code == '0') {
						this.exchangeItemsTwo = msg;
						if(msg.length == 0) {
							this.exchangeItemsTwoLength = true;
						}
						if(msg.length<params.limit){
							this.loadListInfoData = false;
							this.onFetchingInfo=true;
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
			this.height = document.body.offsetHeight - 44 + "px";
			let params = {
				openId:this.token,
				start: 0,
				limit: 6,
				...this.searchForm
			}
			this.loadingListChange(params);
		}
	}
</script>

<style lang="less">
	.tab-top-exchange {
		width: 100%;
		position: absolute;
		left: 0;
		top: 0;
		background: #FFF;
		z-index: 2;
		.vux-tab-ink-bar {
			width: 25%;
			margin: 0 auto;
		}
	}
	
	.tab-container-exchange {
		padding-top: 44px;
	}
	
	.tab-one,
	.tab-two {
		// padding-top: 70*@rem;
	}
	
	.tab-header-one-exchange {
		height: 88*@rem;
		align-items: center;
		background: #FFF;
		.dsh-select-user {
			display: inline-block;
			display: flex;
			align-items: center;
			height: 88*@rem;
			margin-left: 54*@rem;
			float: left;
		}
		.dsh-input-user {
			position: relative;
			margin-right: 53*@rem;
			width: 470*@rem;
			height: 50*@rem;
			border: 3*@rem solid #dcdcdc;
			border-radius: 7*@rem;
			float: right;
			margin-top: 19*@rem;
			input {
				width: 375*@rem;
				height: 50*@rem;
				border: none;
				outline: none;
				// text-indent: 26*@rem;
				margin-left: 26*@rem;
			}
			img {
				position: absolute;
				right: 24*@rem;
				top: 50%;
				margin-top: -15*@rem;
				width: 31*@rem;
				height: 30*@rem;
			}
		}
	}
	
	.items-exchange {
		padding: 0 20*@rem 0 30*@rem;
		background: #FFF;
		.item-exchange {
			display: flex;
			justify-content: flex-start;
			border-bottom: 1*@rem solid #CCC;
		}
		.img-item {
			width: 200*@rem;
			height: 170*@rem;
			border-radius: 5*@rem;
			background: #CCC;
			margin: 30*@rem 33*@rem 24*@rem 0;
			overflow: hidden;
			img {
				width: 200*@rem;
				height: 170*@rem;
			}
		}
		.content-item {
			width: 470*@rem;
			position: relative;
			span {
				display: block;
			}
			.name {
				width:60%;
				margin-top: (40 * 0.6)*@rem;
				font-size: 30*@rem;
				font-weight: normal;
				color: #3b3b3b;
				overflow: hidden;
				height: 40*@rem;
				white-space: nowrap;
				text-overflow: ellipsis;
			}
			.num,
			.time {
				margin-top: (40 * 0.6)*@rem;
				font-size: 24*@rem;
				color: #949494;
			}
			.amount,
			.num{
				white-space: nowrap;
				text-overflow: ellipsis;
				display: inline-block;
			}
			.amount{
				position: absolute;
				right: 20*@rem;
				top: (128 * 0.6)*@rem;
				.inte-num-orange {
					font-style: normal;
					font-size: 24*@rem;
					color: #f79628;
				}
			}
			.inte {
				position: absolute;
				right: 20*@rem;
				top: (48 * 0.6)*@rem;
				.inte-num-orange {
					font-style: normal;
					font-size: 24*@rem;
					color: #f79628;
				}
			}
			.btn-acitve {
				position: absolute;
				right: 20*@rem;
				top: 150*@rem;
			}
		}
	}
</style>