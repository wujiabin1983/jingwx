<template lang="html">
  <!-- <div class="app-container"> -->
  <div class="">
    <group class="dsh-group">
      <!-- <x-input v-if="type == 'ipt'" class="dsh-input" :title="title" v-model="valString" :type="iptType()" :is-type="isType()" :placeholder="`请输入${title}`"></x-input> -->
      <cell v-if="type == 'ipt'" class="dsh-cell" :title="title" :value="!valString ? `请输入${title}` : valString" is-link @click.native="showIpt = true"></cell>
      <cell v-if="type == 'radio'" class="dsh-cell" :title="title" :value="!valString ? `请选择${title}` : valString" is-link @click.native="showRadio = true"></cell>
      <datetime v-if="type == 'datetime'" class="dsh-datetime" :title="title" v-model="valString" :min-year="1900" :end-date="dateStr" :placeholder="`请选择${title}`"></datetime>
    </group>
    <div v-transfer-dom>
      <popup v-model="showIpt" v-if="type == 'ipt'" height="100%">
        <!-- group already has a top border, so we need to hide header's bottom border-->
        <popup-header
          left-text="取消"
          right-text="确认"
          :title="`请输入${this.title}`"
          :show-bottom-border="false"
          @on-click-left="showIpt = false"
          @on-click-right="showIpt = false">
        </popup-header>
        <group class="dsh-group" gutter="0">
          <x-input v-if="type == 'ipt'" class="dsh-input" :title="title" v-model="valString" :type="iptType()" :placeholder="`请输入${title}`"></x-input>
        </group>
      </popup>
      <popup v-model="showRadio" v-if="type == 'radio'" height="40%">
        <!-- group already has a top border, so we need to hide header's bottom border-->
        <popup-header
          left-text="取消"
          right-text="确认"
          :title="`请选择${this.title}`"
          :show-bottom-border="false"
          @on-click-left="showRadio = false"
          @on-click-right="showRadio = false">
        </popup-header>
        <group class="dsh-group" gutter="0">
          <radio :options="radioItems()" v-model="valString"></radio>
        </group>
      </popup>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { Box, XInput, Cell, Datetime, PopupHeader, Popup, TransferDom, Radio, Group } from 'vux'
export default {
  directives: {
    TransferDom
  },
  components: {
    Box,
    XInput,
    Cell,
    Datetime,
    PopupHeader,
    Popup,
    Radio,
    Group
  },
  props: {
    type: {},
    title: {},
    model: {}
  },
  data () {
    return {
    	dateStr:'',
      valString: '',
      showIpt: false,
      showRadio: false
    }
  },
  methods: {
    radioItems () {
      if(this.type == 'radio') {
        if(this.model == 'sex') {
          return ['男', '女']
        }else if (this.model == 'education') {
          return ['小学', '初中', '大学']
        }
      }else {
        return false;
      }
    },
    isType () {
      if(this.type == 'ipt') {
        if(this.model == 'mobile') {
          return 'china-mobile';
        }else if (this.model == 'memName') {
          return 'china-name';
        }else if (this.model == 'email') {
          return 'email';
        }
      }else {
        return false;
      }
    },
    iptType () {
      if(this.type == 'ipt') {
        if(this.model == 'mobile') {
          return 'tel'
        }else if(this.model == 'memName') {
          return 'text'
        }else if(this.model == 'idNumber') {
          return 'number'
        }else if(this.model == 'email') {
          return 'email'
        }else if(this.model == 'address') {
          return 'text'
        }
      }else {
        return false;
      }
    }
  },
  watch: {
    valString (val) {
      this.$emit('event', {
        model: this.model,
        value: val
      });
    }
  },
  computed: {

  },
  created () {
		var month =new Date().getMonth()+1<10?'0'+(new Date().getMonth()+1):(new Date().getMonth()+1);
		this.dateStr =new Date().getFullYear()+'-'+month+'-'+new Date().getDate();
  }
}
</script>

<style lang="less">
</style>
