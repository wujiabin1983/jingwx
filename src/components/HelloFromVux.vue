<template>
  <div>
    <x-header :left-options="{backText: ''}">set empty back text</x-header>
    <div class="vux-demo">
      <img class="logo" src="../assets/vux_logo.png">
      <h1> </h1>
    </div>
    <group title="cell demo">
      <cell title="VUX" value="cool" is-link @click.native="onClick"></cell>
      <cell title="test" value="test" :link="{name: 'test'}">{{author}}</cell>
    </group>
  </div>
</template>

<script>
import { Group, Cell, Icon, XHeader  } from 'vux'

export default {
  components: {
    Group,
    Cell,
    Icon,
    XHeader
  },
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!'
    }
  },
  methods: {
    onClick () {
      this.$http.post('/api').then().catch((err) => {
        console.log(err)
      })
      this.$store.commit('newAuthor', 'aaa');
    }
  },
  computed: {
    author () {
      return this.$store.state.author
    }
  },
  created () {

  }
}
</script>

<style>
.vux-demo {
  text-align: center;
}
.logo {
  width: 100px;
  height: 100px
}
</style>
