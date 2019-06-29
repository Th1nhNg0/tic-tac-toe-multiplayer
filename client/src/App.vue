<template>
  <div id="app">
    <img
      style="width:30%;"
      src="https://1.bp.blogspot.com/-_LyXsTDd61U/Ur4JZz6wNoI/AAAAAAAAAr8/NRB8nE4pAcA/s1600/tictactoe.gif"
    />
    <br />
    <input v-show="ifShow" v-model="username" placeholder="your name" />
    <button v-show="ifShow" v-on:click="joinRoom">Click Me</button>
    <board v-show="!ifShow" :socket="socket" />
    <button v-show="!ifShow" v-on:click="startGame">Start</button>
  </div>
</template>

<script>
import io from "socket.io-client";
import board from "./components/board.vue";

export default {
  name: "app",
  data() {
    return {
      ifShow: true,
      username: "",
      socket: {}
    };
  },
  created() {
    this.socket = io("http://localhost:3000");
  },
  components: {
    board
  },
  methods: {
    joinRoom: function() {
      this.socket.emit("join", {
        username: this.username,
        img: "https://api.adorable.io/avatars/" + this.username
      });
      this.ifShow = false;
    },
    startGame: function() {
      this.socket.emit("startGame");
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
