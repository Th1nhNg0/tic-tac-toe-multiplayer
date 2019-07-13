<template>
  <div id="app">
    <transition name="modal" appear>
      <div class="errorMsg" v-if="modalMess.length>0">
        <span class="xbtn" @click="closeModal()">&times;</span>
        <h1>Thông báo</h1>
        <p v-for="(mess,index) in modalMess" :key="index">{{mess}}</p>
      </div>
    </transition>

    <transition mode="out-in" name="fade">
      <form class="form" v-if="nameScene" v-on:submit.prevent="joinRoom" :style="getStyle">
        <h1>TICTACMUL</h1>
        <input v-model="username" type="text" placeholder="YourName" />
        <select v-model="maxPlayers">
          <option v-for="i in 6" :key="i" :value="i">{{i}} players</option>
        </select>
        <button class="btn" type="submit">Play</button>
      </form>

      <board v-else :socket="socket" />
    </transition>

    <p id="totalPlayers">Online: {{totalPlayers}} players</p>
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
      maxPlayers: 2,
      modalMess: [],
      totalPlayers: 0
    };
  },
  created() {
    this.socket = io(); //production
    // this.socket = io("localhost:5000"); //develop

    //totalplayer online
    this.socket.on("totalPlayers", data => (this.totalPlayers = data));

    //is server send message
    this.socket.on("message", data => this.modalMess.push(data));
    //go back
    this.$bus.on("back", () => {
      this.socket.emit("leaveGame");
      this.nameScene = true;
    });
  },
  components: {
    board
  },
  methods: {
    closeModal: function() {
      this.modalMess = [];
    },
    joinRoom: function() {
      if (this.username.length > 9) {
        this.modalMess.push("Xin lỗi, tên bạn quá dài");
        return;
      }
      this.socket.emit("joinGame", {
        username: this.username || "MeowMeow",
        img: "https://api.adorable.io/avatars/" + this.username,
        maxPlayers: this.maxPlayers
      });
      this.nameScene = false;
    }
  },
  computed: {
    getStyle: function() {
      if (this.modalMess.length > 0)
        return { filter: "blur(5px)", "pointer-events": "none" };
      return {};
    }
  }
};
</script>

<style>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.5s ease-in-out;
}
.modal-enter, .modal-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: scale(0);
}
.xbtn {
  position: absolute;
  border: none;
  margin: 0;
  font-size: 80px;
  font-weight: bold;
  top: -12px;
  color: #ff6b6b;
  right: 10px;
  transition: 0.1s ease-in;
}
.xbtn:hover {
  transform: scale(1.2);
}
.errorMsg {
  position: fixed;
  color: black;
  right: 0;
  left: 0;
  margin-right: auto;
  margin-left: auto;
  min-height: 10em;
  width: 350px;
  height: 250px;
  background: #ffe66d;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.8);
  z-index: 1;
}
html {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  color: #f7fff7;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
}
body {
  margin: 0;
  padding: 0;
  min-height: 100%;
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
@media only screen and (max-width: 600px) {
  form {
    width: 350px;
  }
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
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.8);

  font-weight: bold;
  font-size: large;

  transition: 0.3s ease-in-out;
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
  margin: 20px 0px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  box-shadow: 0 3px 4px rgba(0, 0, 0, 0.8);
  font-weight: bold;
  font-size: large;
  transition: 0.1s ease-in-out;
}
.btn:hover {
  transform: scale(1.1);
  background-color: #66a7a4;
}
#totalPlayers {
  right: 20px;
  bottom: 20px;
  position: fixed;
  font-weight: bold;
  font-size: larger;
}
</style>
