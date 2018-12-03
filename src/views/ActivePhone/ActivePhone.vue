<!--激活手机-->
<template lang="html">
  <box class="app">
    <!-- <x-header :left-options="{backText: ''}">set empty back text</x-header> -->
    <div class="app-container">
      <div class="dsh-group"></div>
      <div class="header-active-phone">
        <img :src="img.ActivePhone" alt="">
      </div>
      <dsh-br></dsh-br>
      <div class="group-form-active-phone">
        <group class="dsh-group" v-if="showInfo">
          <!-- <dsh-group :type="dshGroupType('USER_FORM_INFO_FLAG_NAME')" title="姓名" model="name" @event="handleChange"></dsh-group>
          <dsh-group :type="dshGroupType('USER_FORM_INFO_FLAG_SEX')" title="性别" model="sex" @event="handleChange"></dsh-group>
          <dsh-group :type="dshGroupType('USER_FORM_INFO_FLAG_BIRTHDAY')" title="生日" model="birthday" @event="handleChange"></dsh-group>
          <dsh-group :type="dshGroupType('USER_FORM_INFO_FLAG_MOBILE')" title="手机号码" model="phone" @event="handleChange"></dsh-group> -->
          <!--<p class="inline-loading" v-if="arrayItems.length == 0">
            <span style="vertical-align:middle;display:inline-block;font-size:14px;">加载中&nbsp;&nbsp;</span><inline-loading></inline-loading>
          </p>-->
          <div v-for="item in arrayItems">
            <div is="dsh-group" :type="dshGroupType(item.key)" :title="item.name" :model="item.model" @event="handleChange"></div>
          </div>
          <!-- <dsh-group v-for="item in arrayItems" :key="item.key"></dsh-group> -->
        </group>
        <group class="dsh-group" v-if="showInfo">
         	<check-icon class="check" :value.sync="check" type="plain">我已阅读并同意<span class="link" @click="userContent">用户激活协议</span></check-icon>
        	<dsh-button :disabled="!check" class="btn" text="提交" :size="490" type="primary" @click.native="handleSubmit"></dsh-button>
        </group>
      </div>
   		<toast v-model="show" :type="toastType" width="8rem">{{toastText}}</toast>
    </div>
  </box>
</template>

<script>
import { Box, Group, XInput, Cell, Datetime, PopupHeader, Popup,CheckIcon ,TransferDom, Radio, InlineLoading ,Toast} from 'vux'
const DshBr = () => import('@/components/DshBr/DshBr.vue').then(m => m.default)
const DshButton = () => import('@/components/DshButton/DshButton.vue').then(m => m.default)
const DshGroup = () => import('./components/DshGroup.vue').then(m => m.default)
// const DshGroup = () => import('./components/DshGroup.vue').then(m => m.default)
import ActivePhone from '@/assets/ActivePhone.png'
export default {
  name: '激活手机 ',
  directives: {
    TransferDom
  },
  components: {
    Box,
    Group,
    DshBr,
    XInput,
    Cell,
    Datetime,
    DshButton,
    PopupHeader,
    Popup,
    Radio,
    DshGroup,
    InlineLoading,
    Toast,
    CheckIcon
  },
  data () {
    return {
    	showInfo:false,
    	showInfoNo:false,
    	show:false,
    	toastType:'warn',
    	toastText:'',
    	check:false,
      img: {
        ActivePhone: ActivePhone
      },
      groupForm: {
        // USER_FORM_INFO_FLAG_MOBILE: '',
        // USER_FORM_INFO_FLAG_NAME: '',
        // USER_FORM_INFO_FLAG_IDCARD: '',
        // USER_FORM_INFO_FLAG_EMAIL: '',
        // USER_FORM_INFO_FLAG_LOCATION: '',
        // USER_FORM_INFO_FLAG_SEX: '',
        // USER_FORM_INFO_FLAG_EDUCATION_BACKGRO: '',
        // USER_FORM_INFO_FLAG_BIRTHDAY: '',
        "mobile": "", // 手机号
        "memName": "", // 会员名称
        "idNumber": "", // 身份证
        "email": "", // 邮箱
        "address": "", // 详细地址
      	"sex": "", // 性别
        "education": "", // 教育背景
      	"birthDate": "", // 生日
      },
      arrayItems: [],
			userProtocol:'',
    }
  },
  methods: {
  	userContent(){
		 	sessionStorage.setItem("userProtocol",this.userProtocol);
//		 	sessionStorage.setItem("activeData",JSON.stringify(this.groupForm));
  		this.$router.push({
				name: '用户激活协议'
			});
  	},
    handleChange (obj) {
      this.groupForm[obj.model] = obj.value;
    },
    dshGroupType (key) {
      let keyIpt = ['USER_FORM_INFO_FLAG_MOBILE', 'USER_FORM_INFO_FLAG_NAME', 'USER_FORM_INFO_FLAG_IDCARD', 'USER_FORM_INFO_FLAG_EMAIL', 'USER_FORM_INFO_FLAG_LOCATION'];
      let keyRadio = ['USER_FORM_INFO_FLAG_SEX', 'USER_FORM_INFO_FLAG_EDUCATION_BACKGRO'];
      let keyDatetime = ['USER_FORM_INFO_FLAG_BIRTHDAY'];
      if(keyIpt.indexOf(key) != -1) {
        return 'ipt'
      }else if(keyRadio.indexOf(key) != -1) {
        return 'radio'
      }else {
        return 'datetime'
      }
    },
    handleSubmit () {
    	if(!this.check){
    		return false;
    	}
			const reg = /^1[3|4|5|7|8][0-9]\d{8}$/;
			const regIdCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
			const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
    	if(this.arrayItems[0].isRequired=="是"){
    		if(this.groupForm.mobile==""){
    			this.toastText="请输入手机号";
    			this.show=true;
    			return false;
    		}
    		if(!reg.test(this.groupForm.mobile)){
    			this.toastText="请输入正确手机号";
    			this.show=true;
    			return false;
    		}
    	}else if(this.groupForm.mobile!=""){
    		if(!reg.test(this.groupForm.mobile)){
    			this.toastText="请输入正确手机号";
    			this.show=true;
    			return false;
    		}
    	}
    	if(this.arrayItems[1].isRequired=="是"){
    		if(this.groupForm.sex==""){
    			this.toastText="请选择性别";
    			this.show=true;
    			return false;
    		}
    	}
    	if(this.arrayItems[2].isRequired=="是"){
    		if(this.groupForm.memName==""){
    			this.toastText="请输入姓名";
    			this.show=true;
    			return false;
    		}
    	}
    	if(this.arrayItems[3].isRequired=="是"){
    		if(this.groupForm.birthDate==""){
    			this.toastText="请选择生日";
    			this.show=true;
    			return false;
    		}
    	}
    	if(this.arrayItems[4].isRequired=="是"){
    		if(this.groupForm.idNumber==""){
    			this.toastText="请输入身份证号";
    			this.show=true;
    			return false;
    		}
    		if(!regIdCard.test(this.groupForm.idNumber)){
    			this.toastText="请输入正确的身份证号";
    			this.show=true;
    			return false;
    		}
    	}else if(this.groupForm.idNumber!=""){
    		if(!regIdCard.test(this.groupForm.idNumber)){
    			this.toastText="请输入正确的身份证号";
    			this.show=true;
    			return false;
    		}
    	}
    	if(this.arrayItems[5].isRequired=="是"){
    		if(this.groupForm.email==""){
    			this.toastText="请输入邮箱";
    			this.show=true;
    			return false;
    		}
    		if(!regEmail.test(this.groupForm.email)){
    			this.toastText="请输入正确的邮箱";
    			this.show=true;
    			return false;
    		}
    	}else if(this.groupForm.email!=""){
    		if(!regEmail.test(this.groupForm.email)){
    			this.toastText="请输入正确的邮箱";
    			this.show=true;
    			return false;
    		}
    	}
    	if(this.arrayItems[6].isRequired=="是"){
    		if(this.groupForm.address==""){
    			this.toastText="请输入地址";
    			this.show=true;
    			return false;
    		}
    	}
      this.$http.post('I_SCRM_WX_INTERFACE_018.action', this.groupForm).then(res => {
				let data = res.data,
					code = data.returnCode,
					msg = data.returnMsg;
        if(code=="0"){
    			this.toastType="success";
    			this.toastText=msg;
    			this.show=true;
//  			sessionStorage.removeItem("activeData");
        }
      });
    }
  },
  computed: {

  },
  created () {
		this.$http.post('I_SCRM_WX_INTERFACE_006.action').then((res) => {
			let data = res.data,
				code = data.returnCode,
				msg = data.returnMsg;
			if(code == '0') {
        	 console.log(JSON.stringify(msg)+"006")
    	 	if(msg.activateOption.length>0){
	    		this.showInfo=true; 	
		 		}
    	 	this.userProtocol=msg.userProtocol;
        msg.activateOption.forEach((val, inde) => {
          if(val.key == 'USER_FORM_INFO_FLAG_MOBILE') {
            val.model = 'mobile';
          }
          if(val.key == 'USER_FORM_INFO_FLAG_NAME') {
            val.model = 'memName';
          }
          if(val.key == 'USER_FORM_INFO_FLAG_IDCARD') {
            val.model = 'idNumber';
          }
          if(val.key == 'USER_FORM_INFO_FLAG_EMAIL') {
            val.model = 'email';
          }
          if(val.key == 'USER_FORM_INFO_FLAG_LOCATION') {
            val.model = 'address';
          }
          if(val.key == 'USER_FORM_INFO_FLAG_SEX') {
            val.model = 'sex';
          }
          if(val.key == 'USER_FORM_INFO_FLAG_EDUCATION_BACKGRO') {
            val.model = 'education';
          }
          if(val.key == 'USER_FORM_INFO_FLAG_BIRTHDAY') {
            val.model = 'birthDate';
          }
        });
        this.arrayItems = msg.activateOption;
        console.log(JSON.stringify(this.arrayItems))
        console.log(JSON.stringify(this.groupForm))
			}
		});
//		this.$nextTick(function(){
//		if(sessionStorage.getItem("activeData")){
//	  		this.groupForm = JSON.parse(sessionStorage.getItem("activeData"));
////	  		console.log(JSON.stringify(this.groupForm))
//	  	}
//		})
  }
}
</script>

<style lang="less">
.header-active-phone {
  position: relative;
  width: 100%;
  height: 4.266667rem /* 320/75 */;
  background: #d2d2d2;
  img {
    width: 100%;
    height: 4.266667rem /* 320/75 */;
  }
}
.group-form-active-phone {
  margin-top: 0;
  // 去掉上边框
  .weui-cells:before {
    border-top: none!important;
  }
  .check{
  	font-size: 30*@rem;
    margin-top: 100*@rem;
    margin-left: 120*@rem;
    .weui-icon-circle,.weui-icon-success-circle,.weui-icon-success{
    	font-size: 34*@rem;
    	margin-top: 10*@rem;
    }
    .link{
    	color: #1993ff;
    	padding-left: 10*@rem;
    }
  }
  .btn {
    margin-top: 10*@rem;
    margin-bottom: 40*@rem;
  }
  .inline-loading {
    padding: 10*@rem 0;
    text-align: center;
    span {
      vertical-align:middle;
      display:inline-block;
      font-size:14px;
    }
  }
}
</style>
