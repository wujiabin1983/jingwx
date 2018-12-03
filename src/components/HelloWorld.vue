<template>
  <div>
    <x-header :left-options="{backText: ''}">set empty back text</x-header>

  </div>
</template>

<script>
import { Group, Cell, Icon, XHeader  } from 'vux'
export default {
  name: 'HelloWorld',
  components: {
    Group,
    Cell,
    Icon,
    XHeader
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
