import Vue from 'vue'
import Router from 'vue-router'
import store from '@/vuex/store'

// import HelloWorld from '@/components/HelloWorld'
// import Home from '@/components/HelloFromVux'
const HelloWorld = () => import('@/components/HelloWorld.vue').then(m => m.default)
const HelloFromVux = () => import('@/components/HelloFromVux.vue').then(m => m.default)
const Home = () => import('@/views/Home/Home.vue').then(m => m.default)
const getCardSuccess = () => import('@/views/Home/getCardSuccess.vue').then(m => m.default)
const setInfo = () => import('@/views/Home/setInfo.vue').then(m => m.default)
const MyInformaion = () => import('@/views/MyInformaion/MyInformaion.vue').then(m => m.default)
const MyCard = () => import('@/views/MyCard/MyCard.vue').then(m => m.default)
const MyCardInfo = () => import('@/views/MyCard/MyCardInfo.vue').then(m => m.default)
const Invitations = () => import('@/views/Invitations/Invitations.vue').then(m => m.default)
const ViewInvitationRecord = () => import('@/views/Invitations/ViewInvitationRecord.vue').then(m => m.default)
const ActivePhone = () => import('@/views/ActivePhone/ActivePhone.vue').then(m => m.default)
const userActiveContent = () => import('@/views/ActivePhone/userActiveContent.vue').then(m => m.default)
const BindingCard = () => import('@/views/BindingCard/BindingCard.vue').then(m => m.default)
const bindingCardSuccess = () => import('@/views/BindingCard/bindingCardSuccess.vue').then(m => m.default)
const bindingCardhistory = () => import('@/views/BindingCard/bindingCardhistory.vue').then(m => m.default)
const PerfectInformation = () => import('@/views/PerfectInformation/PerfectInformation.vue').then(m => m.default)
const MyAddress = () => import('@/views/MyAddress/MyAddress.vue').then(m => m.default)
const MyAddressAdd = () => import('@/views/MyAddress/Add.vue').then(m => m.default)
const MyAddressSet = () => import('@/views/MyAddress/set.vue').then(m => m.default)
const ShopActivities = () => import('@/views/ShopActivities/ShopActivities.vue').then(m => m.default)
const activitiesInfo = () => import('@/views/ShopActivities/activitiesInfo.vue').then(m => m.default)
const ExclusiveShop = () => import('@/views/ExclusiveShop/ExclusiveShop.vue').then(m => m.default)
const DetailOfNearbyStore = () => import('@/views/ExclusiveShop/DetailOfNearbyStore.vue').then(m => m.default)
const ApplicationService = () => import('@/views/ExclusiveShop/ApplicationService.vue').then(m => m.default)
const ApplicationServiceList = () => import('@/views/ExclusiveShop/ApplicationServiceList.vue').then(m => m.default)
const ApplicationServiceListInfo = () => import('@/views/ExclusiveShop/ApplicationServiceListInfo.vue').then(m => m.default)
const MyOrder = () => import('@/views/MyOrder/MyOrder.vue').then(m => m.default)
const orderInfo = () => import('@/views/MyOrder/orderInfo.vue').then(m => m.default)
const Exchange = () => import('@/views/Exchange/Exchange.vue').then(m => m.default)
const CommodityDetails = () => import('@/views/Exchange/CommodityDetails.vue').then(m => m.default)
const SelfLiftShop = () => import('@/views/Exchange/SelfLiftShop.vue').then(m => m.default)
const MyPoints = () => import('@/views/MyPoints/MyPoints.vue').then(m => m.default)
const MyVoucher = () => import('@/views/MyVoucher/MyVoucher.vue').then(m => m.default)
const MyVoucherDetails = () => import('@/views/MyVoucher/MyVoucherDetails.vue').then(m => m.default)
const ApplicationStore = () => import('@/views/MyVoucher/ApplicationStore.vue').then(m => m.default)
const ReceiveCoupon = () => import('@/views/MyVoucher/ReceiveCoupon.vue').then(m => m.default)
const ReceiveCoupon1 = () => import('@/views/MyVoucher/ReceiveCoupon1.vue').then(m => m.default)
const ReceiveCoupon2 = () => import('@/views/MyVoucher/ReceiveCoupon2.vue').then(m => m.default)
const ReceiveCoupon3 = () => import('@/views/MyVoucher/ReceiveCoupon3.vue').then(m => m.default)
const AttentionPublic = () => import('@/views/MyVoucher/AttentionPublic.vue').then(m => m.default)
const graphicMaterial = () => import('@/views/MyVoucher/graphicMaterial.vue').then(m => m.default)
const NoSign = () => import('@/views/MyVoucher/NoSign.vue').then(m => m.default)
const NearbyStore = () => import('@/views/NearbyStore/NearbyStore.vue').then(m => m.default)
const integralRule = () => import('@/views/MyPoints/integralRule.vue').then(m => m.default)
const MyPrivilege = () => import('@/views/MyPrivilege/MyPrivilege.vue').then(m => m.default)
const shake = () => import('@/views/shake/shake.vue').then(m => m.default)

const RedirectAddress = () => import('@/views/RedirectAddress/RedirectAddress.vue').then(m => m.default)


Vue.use(Router)

const routes = [
  {
    path: 'test',
    name: 'test',
    component: HelloWorld
  },
  {
    path: '/',
    name: '会员中心首页',
    component: Home,
    meta:{
        title:''
    }
  },
  {
    path: '/MyPrivilege',
    name: '我的特权',
    component: MyPrivilege,
    meta:{
        title:'我的特权'
    }
  },
  {
    path: '/shake',
    name: '摇一摇',
    component: shake,
    meta:{
        title:'摇一摇'
    }
  },
  {
    path: '/getCardSuccess',
    name: '领卡成功',
    component: getCardSuccess,
    meta:{
        title:'领卡成功'
    }
  },
  {
    path: '/MyInformaion',
    name: '我的资料',
    component: MyInformaion,
    meta:{
        title:'我的资料'
    }
  },
  {
    path: '/MyCard',
    name: '我的会员卡',
    component: MyCard,
    meta:{
        title:'我的会员卡'
    }
  },
  {
    path: '/MyCardInfo',
    name: '会员卡详情',
    component: MyCardInfo,
    meta:{
        title:'会员卡详情'
    }
  },
  {
    path: '/Invitations',
    name: '会员邀请',
    component: Invitations,
    meta:{
        title:'会员邀请'
    }
  },
  {
    path: '/ViewInvitationRecord',
    name: '查看邀请记录',
    component: ViewInvitationRecord,
    meta:{
        title:'查看邀请记录'
    }
  },
  {
    path: '/ActivePhone',
    name: '激活手机',
    component: ActivePhone,
    meta:{
        title:'激活手机'
    }
  },
  {
    path: '/userProtocol',
    name: '用户激活协议',
    component: userActiveContent,
    meta:{
        title:'用户激活协议'
    }
  },
  {
    path: '/BindingCard',
    name: '绑定会员卡',
    component: BindingCard,
    meta:{
        title:'绑定会员卡'
    }
  },
  {
    path: '/bindingCardSuccess',
    name: '绑定会员卡成功',
    component: bindingCardSuccess,
    meta:{
        title:'绑定会员卡成功'
    }
  },
  {
    path: '/bindingCardhistory',
    name: '绑定会员卡历史',
    component: bindingCardhistory,
    meta:{
        title:'绑定会员卡历史'
    }
  },
  {
    path: '/PerfectInformation',
    name: '完善个人资料',
    component: PerfectInformation,
    meta:{
        title:'完善个人资料'
    }
  },
  {
    path: '/setInfo',
    name: '修改个人资料',
    component: setInfo,
    meta:{
        title:'修改个人资料'
    }
  },
  {
    path: '/MyAddress',
    name: '我的地址',
    component: MyAddress,
    meta:{
        title:'我的地址'
    }
  },
  {
    path: '/MyAddress/Add',
    name: '添加新地址',
    component: MyAddressAdd,
    meta:{
        title:'添加新地址'
    }
  },
  {
    path: '/MyAddress/set',
    name: '修改地址',
    component: MyAddressSet,
    meta:{
        title:'修改地址'
    }
  },
  {
    path: '/ShopActivities',
    name: '门店活动',
    component: ShopActivities,
    meta:{
        title:'门店活动'
    }
  },
  {
    path: '/activitiesInfo',
    name: '门店活动详情',
    component: activitiesInfo,
    meta:{
        title:'门店活动详情'
    }
  },
  {
    path: '/ExclusiveShop',
    name: '专属导购',
    component: ExclusiveShop,
    meta:{
        title:'专属导购'
    }
  },
  {
    path: '/DetailOfNearbyStore',
    name: '附近门店详情',
    component: DetailOfNearbyStore,
    meta:{
        title:'附近门店详情'
    }
  },
  {
    path: '/graphicMaterial',
    name: '图文信息详情',
    component: graphicMaterial,
    meta:{
        title:'图文信息详情'
    }
  },
  {
    path: '/ApplicationService',
    name: '申请服务',
    component: ApplicationService,
    meta:{
        title:'申请服务'
    }
  },
  {
    path: '/ApplicationServiceList',
    name: '申请记录',
    component: ApplicationServiceList,
    meta:{
        title:'申请记录'
    }
  },
  {
    path: '/ApplicationServiceListInfo',
    name: '申请记录详情',
    component: ApplicationServiceListInfo,
    meta:{
        title:'申请记录详情'
    }
  },
  {
    path: '/MyOrder',
    name: '我的订单',
    component: MyOrder,
    meta:{
        title:'我的订单'
    }
  },
  {
    path: '/orderInfo',
    name: '订单详情',
    component: orderInfo,
    meta:{
        title:'订单详情'
    }
  },
  {
    path: '/Exchange',
    name: '积分兑换',
    component: Exchange,
    meta:{
        title:'积分兑换'
    }
  },
  {
    path: '/CommodityDetails',
    name: '商品详情',
    component: CommodityDetails,
    meta:{
        title:'商品详情'
    }
  },
  {
    path: '/SelfLiftShop',
    name: '自提门店',
    component: SelfLiftShop,
    meta:{
        title:'自提门店'
    }
  },
  {
    path: '/DetailOfNearbyStore',
    name: '自提门店详情',
    component: DetailOfNearbyStore,
    meta:{
        title:'自提门店详情'
    }
  },
  {
    path: '/MyPoints',
    name: '我的积分',
    component: MyPoints,
    meta:{
        title:'我的积分'
    }
  },
  {
    path: '/integralRule',
    name: '积分规则',
    component: integralRule,
    meta:{
        title:'积分规则'
    }
  },
  {
    path: '/MyVoucher',
    name: '我的券',
    component: MyVoucher,
    meta:{
        title:'我的券'
    }
  },
  {
    path: '/MyVoucherDetails',
    name: '券详情',
    component: MyVoucherDetails,
    meta:{
        title:'券详情'
    }
  },
  {
    path: '/ApplicationStore',
    name: '适用门店',
    component: ApplicationStore,
    meta:{
        title:'适用门店'
    }
  },
  {
    path: '/ReceiveCoupon',
    name: '优惠券-扫码',
    component: ReceiveCoupon,
    meta:{
        title:'领取优惠券'
    }
  },
  {
    path: '/ReceiveCoupon1',
    name: '优惠券-分享',
    component: ReceiveCoupon1,
    meta:{
        title:'领取优惠券'
    }
  },
  {
    path: '/ReceiveCoupon2',
    name: '优惠券-摇一摇',
    component: ReceiveCoupon2,
    meta:{
        title:'领取优惠券'
    }
  },
  {
    path: '/ReceiveCoupon3',
    name: '活动详情',
    component: ReceiveCoupon3,
    meta:{
        title:'活动详情'
    }
  },
  {
    path: '/AttentionPublic',
    name: '关注公众号',
    component: AttentionPublic,
    meta:{
        title:'关注公众号'
    }
  },
  {
    path: '/NoSign',
    name: '注册',
    component: NoSign,
    meta:{
        title:'注册'
    }
  },
  {
    path: '/NearbyStore',
    name: '附近门店',
    component: NearbyStore,
    meta:{
        title:'附近门店'
    }
  },
  {
    path: '/RedirectAddress',
    name: '领取优惠券',
    component: RedirectAddress,
    meta:{
        title:'领取优惠券'
    }
  },
]

const router = new Router({
  routes
})

router.beforeEach(function (to, from, next) {
  store.commit('updateLoadingStatus', {isLoading: true})
  // 设置title的值
  document.title = !to.params.title ? to.meta.title : to.params.title;
  // 获取token
  // Vue.http.post('nearbyStore').then((res) => {
  // }).catch((err) => {
  // });
  // store.commit('setToken', window.location.href.split('=')[1]);
  // console.log(window.location.href + 'href');


  next()
})

router.afterEach(function (to) {
  store.commit('updateLoadingStatus', {isLoading: false})
})

export default router
