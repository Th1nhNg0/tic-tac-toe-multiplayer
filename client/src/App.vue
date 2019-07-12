<template>
  <div id="app">
    <transition mode="out-in" name="fade">
      <form class="form" v-if="nameScene" v-on:submit.prevent="joinRoom">
        <h1>TICTACMUL</h1>
        <input v-model="username" type="text" placeholder="YourName" />
        <select v-model="maxPlayers">
          <option v-for="i in 6" :key="i" :value="i">{{i}} players</option>
        </select>
        <button class="btn" type="submit">Play</button>
      </form>

      <board v-else :socket="socket" />
    </transition>
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
      username: null,
      socket: {},
      maxPlayers: 2
    };
  },
  created() {
    this.socket = io(); //production
    // this.socket = io("localhost:5000"); //develop
    this.$bus.on("back", () => {
      this.socket.emit("leaveGame");
      this.nameScene = true;
    });
  },
  components: {
    board
  },
  methods: {
    joinRoom: function() {
      this.socket.emit("join", {
        username: this.username || "anonymous",
        img: "https://api.adorable.io/avatars/" + this.username,
        maxPlayers: this.maxPlayers
      });
      this.nameScene = false;
    }
  }
};
</script>

<style>
html {
  margin: 0;
  padding: 0;
  height: 100%;
  color: #f7fff7;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
}
body {
  margin: 0;
  padding: 0;
  height: 100%;
  max-height: 100%;
  float: left;
  width: 100%;
  overflow: hidden;
  background: #1a535c;

  display: flex;
  justify-content: center;
  align-items: center;
}

.fade-enter-active,
.fade-leave-to {
  transition: opacity 0.25s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

p {
  margin: 0;
  margin-top: 20px;
}
form {
  width: 500px;
}
input[type="text"],
select {
  text-align: center;
  width: 51%;
  height: 60px;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border-radius: 10px;
  border: none;
  box-sizing: border-box;
  transition: 0.3s ease-in-out;
  box-shadow: 0 3px 4px #ffe66d;

  font-weight: bold;
  font-size: large;
}
select {
  text-align-last: center;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

option {
  padding: 12px 20px;
}
input:focus {
  width: 70%;
  outline: none;
}
select:focus {
  outline: none;
  border-radius: 10px 10px 0 0;
}
.btn {
  width: 50%;
  height: 60px;
  background-color: #4ecdc4;
  padding: 14px 20px;
  margin: 8px 0;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 3px 4px #ffe66d;
  font-weight: bold;
  font-size: large;
  transition: 0.1s ease-in-out;
}
.btn:hover {
  transform: scale(1.1);
  background-color: #66a7a4;
}
</style>
