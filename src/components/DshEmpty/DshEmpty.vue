<template lang="html">
  <div class="dsh-empty">
    <div class="img-empty">
      <img src="../../assets/biaoqing.png" alt="">
    </div>
    <p class="p-empty">{{text}}</p>
  </div>
</template>

<script>
import { Box, XButton  } from 'vux'
export default {
  components: {
    Box
  },
  props: ['text'],
  data () {
    return {
      msg: 'Hello World!'
    }
  },
  methods: {

  },
  computed: {
    h () {
      return {
        height: `${parseInt(this.height)/75}rem!important`
      }
    }
  },
  created () {

  }
}
</script>

<style lang="less">
.dsh-empty {
  .img-empty {
		width: 348*@rem;
		height: 216*@rem;
    margin: 378*@rem auto 63*@rem;
    img {
			width: 348*@rem;
			height: 216*@rem;
    }
  }
}
.p-empty {
  text-align: center;
  font-size: 28*@rem;
  color: #aaa;
}
</style>
