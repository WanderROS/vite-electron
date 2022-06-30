<template>
  <img alt="Vue logo" src="./assets/logo.png" />
  <router-link to="/HelloWorld">To HelloWorld</router-link>
  <router-view></router-view>
</template>

<script>

  const { ipcRenderer} = require("electron");

  ipcRenderer.on('serialport', (_ev, args) => {
    let ports =  JSON.parse(args)
    console.log(ports)
  })

export default {
  name: 'App',
  components: {
  }
}
</script>
