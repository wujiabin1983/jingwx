<template lang="html">
	<div>
		<div class="dsh-voucher" :style="url" v-if="type == '代金券'||type == '邀请券'">
			<div class="dsh-voucher-wrap">
				<div class="price-type">
					<span class="price"><i>￥</i>{{price}}</span>
					<span class="type">{{type}}</span>
				</div>
				<div class="info-subInfo-btnAct">
					<div class="info-subInfo">
						<span class="info">{{info}}</span>
						<span class="sub-info">满{{subInfo}}元可用</span>
					</div>
					<div class="btnAct" v-if="isShowBtn">
						<dsh-button v-if="tabType == '可使用' && !disabled" class="btn-act" :size="144" type="default" text="立即使用" @click.native="handleShowInfo"></dsh-button>
					</div>
				</div>
			</div>
			<div class="time-showInfo" :style="{'background-image': `url(${img.voucherBG})`}">
				<span class="time" v-if="time==''">券有效期：{{time}}</span>
				<span class="time" v-else>{{time}}</span>
				<span class="show-info" v-if="tabType != '可使用' && !disabled&&this.tabType!='已过期'" @click="handleShowInfo">查看详情</span>
			</div>
		</div>
		<div class="dsh-voucher" :style="url" v-if="type == '折扣券'">
			<div class="dsh-voucher-wrap">
				<div class="price-type">
					<span class="price">{{price}}<i>折</i></span>
					<span class="type">{{type}}</span>
				</div>
				<div class="info-subInfo-btnAct">
					<div class="info-subInfo">
						<span class="info">{{info}}</span>
						<span class="sub-info">满{{subInfo}}元可用</span>
					</div>
					<div class="btnAct" v-if="isShowBtn">
						<dsh-button v-if="tabType == '可使用' && !disabled" class="btn-act" :size="144" type="default" text="立即使用" @click.native="handleShowInfo"></dsh-button>
					</div>
				</div>
			</div>
			<div class="time-showInfo" :style="{'background-image': `url(${img.voucherBG})`}">
				<span class="time" v-if="time==''">券有效期：{{time}}</span>
				<span class="time" v-else>{{time}}</span>
				<span class="show-info" v-if="tabType != '可使用' && !disabled&&this.tabType!='已过期'" @click="handleShowInfo">查看详情</span>
			</div>
		</div>
		<div class="dsh-voucher" :style="url" v-if="type == '礼品券'">
			<div class="dsh-voucher-wrap">
				<div class="price-type" :style="tabType != '可使用' ? {} : {'background-image': `url(${img.voucherYQYL})`}">
					<span class="price"></span>
					<span class="type">{{type}}</span>
				</div>
				<div class="info-subInfo-btnAct">
					<div class="info-subInfo">
						<span class="info">{{info}}</span>
						<span class="sub-info">{{subInfo}}</span>
					</div>
					<div class="btnAct" v-if="isShowBtn">
						<dsh-button v-if="tabType == '可使用' && !disabled" class="btn-act" :size="144" type="default" text="立即使用" @click.native="handleShowInfo"></dsh-button>
					</div>
				</div>
			</div>
			<div class="time-showInfo" :style="{'background-image': `url(${img.voucherBG})`}">
				<span class="time" v-if="time==''">券有效期：{{time}}</span>
				<span class="time" v-else>{{time}}</span>
				<span class="show-info" v-if="tabType != '可使用' && !disabled&&this.tabType!='已过期'" @click="handleShowInfo">查看详情</span>
			</div>
		</div>
	</div>
</template>

<script>
	import { Box } from 'vux'
	import daijinquan from '@/assets/daijinquan.png'
	import zhekouquan from '@/assets/zhekouquan.png'
	import lipinquan from '@/assets/lipinquan.png'
	import daijinquanYishiyong from '@/assets/daijinquan-yishiyong.png'
	import zhekouquanYishiyong from '@/assets/zhekouquan-yishiyong.png'
	import lipinquanYishiyong from '@/assets/lipinquan-yishiyong.png'
	import daijinquanYiguoqi from '@/assets/daijinquan-yiguoqi.png'
	import zhekouquanYiguoqi from '@/assets/zhekouquan-yiguoqi.png'
	import lipinquanYiguoqi from '@/assets/lipinquan-yiguoqi.png'
	import voucherBG from '@/assets/voucher_bg.png'
	import voucherYQYL from '@/assets/voucher_yqyl.png'
	const DshButton = () =>
		import('@/components/DshButton/DshButton.vue').then(m => m.default)
	export default {
		components: {
			Box,
			DshButton
		},
		// props: ['tabType', 'price', 'type', 'info', 'subInfo', 'time'],
		props: {
			'tabType': {},
			'price': {},
			'type': {},
			'info': {},
			'subInfo': {},
			'isBtn': {},
			'time': {},
			'disabled': {
				default: false
			},
			'bgColor': {},
			'activityId': {},
			'coupId': {}
		},
		data() {
			return {
				isShowBtn: true,
				token:'',
				msg: 'Hello World!',
				img: {
					voucherBG: voucherBG,
					voucherYQYL: voucherYQYL
				}
			}
		},
		methods: {
			handleShowInfo() {
				localStorage.setItem('myVoucheActivityId', this.activityId);
				localStorage.setItem('myVoucheCoupId', this.coupId);
				this.$router.push({
					name: '券详情'
				});
			}
		},
		computed: {
			url() {
				if(this.tabType == '可使用') {
					if(this.type == '代金券' || this.type == '邀请券') {
						return {
							'background-color': this.bgColor,
							'background-image': !this.bgColor ? `url(${daijinquan})` : ''
						}
					} else if(this.type == '折扣券') {
						return {
							'background-color': this.bgColor,
							'background-image': !this.bgColor ? `url(${zhekouquan})` : ''
						}
					} else if(this.type == '礼品券') {
						return {
							'background-color': this.bgColor,
							'background-image': !this.bgColor ? `url(${lipinquan})` : ''
						}
					}
				} else if(this.tabType == '已使用'||this.tabType == '已转赠') {
					if(this.type == '代金券' || this.type == '邀请券') {
						return {
							'background-image': `url(${daijinquanYishiyong})`
						}
					} else if(this.type == '折扣券') {
						return {
							'background-image': `url(${zhekouquanYishiyong})`
						}
					} else if(this.type == '礼品券') {
						return {
							'background-image': `url(${lipinquanYishiyong})`
						}
					}
				} else if(this.tabType == '已过期') {
					if(this.type == '代金券' || this.type == '邀请券') {
						return {
							'background-image': `url(${daijinquanYiguoqi})`
						}
					} else if(this.type == '折扣券') {
						return {
							'background-image': `url(${zhekouquanYiguoqi})`
						}
					} else if(this.type == '礼品券') {
						return {
							'background-image': `url(${lipinquanYiguoqi})`
						}
					}
				}
			},
		},
		created() {
			if(window.location.href.split('=')[1]){
				this.token=window.location.href.split('=')[1];
				localStorage.setItem("token",this.token);
			}else if(localStorage.getItem("token")){
				this.token=localStorage.getItem("token");
			}
			this.isShowBtn = this.isBtn;
//			console.log(this.bgColor, 'bg');
			console.log(this.tabType, 'tabType');
		}
	}
</script>

<style lang="less">
	.dsh-voucher {
		position: relative;
		// display: flex;
		// justify-content: space-between;
		width: 700*@rem;
		height: 260*@rem;
		padding: 2*@rem 3*@rem;
		margin-bottom: 40*@rem;
		background-size: 715*@rem 280*@rem;
		background-repeat: no-repeat;
		background-color: transparent;
		color: #FFF;
		border-radius: 10px;
		overflow: hidden;
		background-color: coral!important;
		.dsh-voucher-wrap {
			width: 700*@rem;
			height: 180*@rem;
			display: flex;
		}
		.price-type {
			box-sizing: border-box;
			display: flex;
			flex-direction: column;
			// justify-content: space-around;
			align-items: center;
			width: 223*@rem;
			height: 188*@rem;
			padding-top: 55*@rem;
			background-repeat: no-repeat;
			background-size: 70*@rem 70*@rem;
			background-position: center 40*@rem;
			.price {
				font-size: 60*@rem;
				height: 45*@rem;
				line-height: 45*@rem;
				i {
					font-size: 36*@rem;
					font-style: normal;
				}
			}
			.type {
				font-size: 24*@rem;
				height: 23*@rem;
				line-height: 23*@rem;
				margin-top: 30*@rem;
			}
		}
		.info-subInfo-btnAct {
			box-sizing: border-box;
			display: flex;
			justify-content: space-around;
			// align-items: center;
			width: 476*@rem;
			height: 188*@rem;
			padding-top: 62*@rem;
			.btnAct {
				width: 144*@rem;
			}
			.info {
				display: block;
				font-size: 30*@rem;
				height: 28*@rem;
				line-height: 28*@rem;
			    overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.sub-info {
				display: block;
				font-size: 22*@rem;
				height: 21*@rem;
				line-height: 21*@rem;
				margin-top: 26*@rem;
			}
			.btn-act {
				padding-top: (75 - 62)*@rem;
				display: inline-block;
			}
		}
		.time-showInfo {
			display: flex;
			justify-content: space-between;
			position: absolute;
			left: 0;
			width: 101%;
			height: 90*@rem;
			line-height: 68*@rem;
			font-size: 22*@rem;
			color: #9c9c9c;
			border-bottom-left-radius: 10px;
			border-bottom-right-radius: 10px;
			background-size: cover;
			background-repeat: no-repeat;
			.time {
				// display: block;
				width: 470*@rem;
				height: 80*@rem;
				line-height: 78*@rem;
				margin-left: 74*@rem;
				text-align: left;
				white-space: nowrap;
				// text-overflow: ellipsis;
				overflow: hidden;
			}
			.show-info {
				height: 72*@rem;
				line-height: 68*@rem;
				margin-right: 54*@rem;
			}
		}
	}
</style>