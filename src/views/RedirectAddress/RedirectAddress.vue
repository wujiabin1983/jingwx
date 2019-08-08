<template lang="html">
  <box class="app">
    <div class="app-container">

    </div>
  </box>
</template>

<script>
import { Box } from 'vux'
export default {
  name: '跳转中。。。',
  components: {
		Box
  },
  data () {
    return {
    	token:''
    }
  },
  methods: {

  },
  computed: {
  },
  created () {
    let flag = window.location.href.split('flag=')[1];
    if(flag.length > 0) {
      let params = {
        flag: flag
      }
      this.$http.post('selectRedirectAddressInfo.action', params).then((res) => {
        let data = res.data,
			code = data.returnCode,
			msg = data.returnMsg;
        if(code == 0) {
          window.location.href = msg;
        }
      });
    }else {
      console.log('无效flag');
    }
  }
}
</script>

<style lang="less">

</style>
