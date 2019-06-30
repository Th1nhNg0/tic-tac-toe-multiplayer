<template>
  <div>
    <h1>Room Name: {{roomID}}</h1>
    <div class="playersList">
      <player
        v-for="player in players"
        :key="player.id"
        :player="player"
        :currentTurn="currentTurn"
      />
    </div>
    <div id="board" v-show="isStart">
      <div v-show="winnerImg!=''" class="overlay">
        <img :src="winnerImg" />
        <p class="myButton" v-on:click="playAgain">CLICK HERE TO PLAY AGAIN</p>
      </div>
      <cell
        v-for="cell in cells"
        :key="cell.id"
        :img="cell.img"
        v-on:change="move(cell.id)"
        :canClick="cell.canClick"
      />
    </div>

    <p v-show="!isStart" v-on:click="startGame" class="myButton">Start</p>
  </div>
</template>

<script>
import cell from "./cell.vue";
import player from "./player.vue";

export default {
  name: "board",
  props: ["socket"],

  data() {
    return {
      roomID: "",
      players: [],
      cells: [],
      currentTurn: "",
      isStart: false,
      winnerImg: null
    };
  },

  created() {
    this.socket.on("update", data => {
      this.roomID = data.roomID;
      this.cells = data.cells;
      this.currentTurn = data.currentTurn;
      this.winnerImg = data.winner.img;
      this.players = data.players;
      this.isStart = data.isStart;
    });
  },

  methods: {
    move: function(id) {
      this.socket.emit("move", id);
    },
    startGame: function() {
      this.isStart = true;
      this.socket.emit("startGame");
    },
    playAgain: function() {
      this.socket.emit("leaveGame");
      this.$emit("playAgain");
    }
  },

  components: {
    cell,
    player
  }
};
</script>

<style scoped>
.myButton {
  background-color: #109f67;
  -moz-border-radius: 32px;
  -webkit-border-radius: 32px;
  border-radius: 32px;
  display: inline-block;
  cursor: pointer;
  color: #ffffff;
  font-family: Arial;
  font-size: 19px;
  font-weight: bold;
  padding: 24px 40px;
  text-decoration: none;
}
.myButton:hover {
  transform: scale(1.06);
}
.playersList {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: auto;
  margin-bottom: 20px;
  height: 100px;
}
img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  opacity: 0.7;
}
.overlay {
  position: fixed;
  width: inherit;
  height: inherit;
  background-color: rgba(0, 0, 0, 0.2);
}

#board {
  margin: auto;
  width: 350px;
  height: 350px;

  display: flex;
  flex-wrap: wrap;

  border-style: solid;
  border-width: 1px;
  border-color: black;
}
</style>
