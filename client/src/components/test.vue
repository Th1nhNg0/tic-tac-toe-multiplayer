<template>
  <div>
    <h3 v-for="text in texts" :key="text.id">{{ text.text }}</h3>
    <input type="text" v-model="sendMess" v-on:keyup.enter="sendMessToServer">
    <button v-on:click="sendMessToServer">Send</button>
  </div>
</template>

<script>
import io from "socket.io-client";
export default {
  name: "HelloWorld",
  data() {
    return {
      socket: {},
      texts: [],
      sendMess: ""
    };
  },
  created() {
    this.socket = io("http://localhost:3000");
    this.socket.on("chat", data => {
      this.texts.push({ text: data, id: this.texts.length });
    });
  },
  methods: {
    sendMessToServer: function() {
      this.socket.emit("send", this.sendMess);
      this.sendMess = "";
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
