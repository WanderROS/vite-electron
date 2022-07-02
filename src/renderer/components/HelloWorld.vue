<template>
  <h1>{{ msg }}</h1>
  <button @click="countLog">count is: {{ count }}</button>
  <p>Edit <code>components/HelloWorld.vue</code> to test hot module replacement.</p>
</template>

<script>
  import logger from "../../utils/logger"
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  data() {
    return {
      count: 0
    }
  },
  methods: {
    countLog: function () {
      this.count++;
      logger.info("test Console");
    }
  }
}
</script>
