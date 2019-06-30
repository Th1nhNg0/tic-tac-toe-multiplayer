<template>
  <div id="app">
    <div class="form" v-show="nameScene">
      <h1>Nhập tên của bạn</h1>
      <label>
        <input id="fname" v-model="username" type="text" />
        <span>Name</span>
      </label>
      <input v-on:click="joinRoom" type="submit" value="Enter" />
    </div>
    <board v-show="!nameScene" :socket="socket" v-on:playAgain="joinRoom" />
  </div>
</template>

<script>
import io from "socket.io-client";
import board from "./components/board.vue";

export default {
  name: "app",
  data() {
    return {
      nameScene: true,
      username: "Your Name",
      socket: {}
    };
  },
  created() {
    this.socket = io(window.location.hostname + process.env.PORT || 5000);
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
      this.nameScene = false;
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
.form {
  display: table;
  margin: 40px auto;
}
h1 {
  display: table;
  margin: 40px auto;
  color: #fff;
  font: 20px Helvetica;
  text-transform: uppercase;
  letter-spacing: 3px;
}

body {
  background: #35dc9b;
}
label {
  position: relative;
  display: block;
}
label input::-webkit-input-placeholder {
  transition: all 0.2s ease-in-out;
  color: #999;
  font: 18px Helvetica, Arial, sans-serif;
}
label input:-ms-input-placeholder {
  transition: all 0.2s ease-in-out;
  color: #999;
  font: 18px Helvetica, Arial, sans-serif;
}
label input::-ms-input-placeholder {
  transition: all 0.2s ease-in-out;
  color: #999;
  font: 18px Helvetica, Arial, sans-serif;
}
label input::placeholder {
  transition: all 0.2s ease-in-out;
  color: #999;
  font: 18px Helvetica, Arial, sans-serif;
}
label input:focus,
label input.populated {
  padding-top: 28px;
  padding-bottom: 12px;
}
label input:focus::-webkit-input-placeholder,
label input.populated::-webkit-input-placeholder {
  color: transparent;
}
label input:focus:-ms-input-placeholder,
label input.populated:-ms-input-placeholder {
  color: transparent;
}
label input:focus::-ms-input-placeholder,
label input.populated::-ms-input-placeholder {
  color: transparent;
}
label input:focus::placeholder,
label input.populated::placeholder {
  color: transparent;
}
label input:focus + span,
label input.populated + span {
  opacity: 1;
  top: 10px;
}
label span {
  color: #35dc9b;
  font: 13px Helvetica, Arial, sans-serif;
  position: absolute;
  top: 0px;
  left: 20px;
  opacity: 0;
  transition: all 0.2s ease-in-out;
}
input[type="submit"] {
  transition: all 0.2s ease-in-out;
  font: 18px Helvetica, Arial, sans-serif;
  border: none;
  background: #1aaf75;
  color: #fff;
  padding: 16px 40px;
}
input[type="submit"]:hover {
  background: #109f67;
}

label input {
  font: 18px Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  display: block;
  border: none;
  padding: 20px;
  width: 300px;
  margin-bottom: 20px;
  font-size: 18px;
  outline: none;
  transition: all 0.2s ease-in-out;
}
</style>
