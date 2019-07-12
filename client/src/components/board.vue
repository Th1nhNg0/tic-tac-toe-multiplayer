<template>
  <div>
    <h1>Room Name: {{roomID}}</h1>

    <div class="playersList">
      <player
        v-for="player in players"
        :key="player.id"
        :player="player"
        :currentTurn="currentTurn"
        :socket="socket"
      />
    </div>

    <div id="board" v-show="isStart">
      <div v-show="winnerImg!=''" class="overlay">
        <img :src="winnerImg" />
      </div>
      <cell
        v-for="cell in cells"
        :key="cell.id"
        :img="cell.img"
        v-on:change="move(cell.id)"
        :canClick="cell.canClick"
        :size="size"
      />
    </div>
    <button v-show="!isStart||winnerImg!=''" v-on:click="$bus.emit('back')" class="btn bbtn">BACK</button>
    <button v-show="winnerImg!=''" class="btn bbtn" v-on:click="playAgain">PLAY AGAIN</button>
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
      winnerImg: null,
      size: null
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
      this.size = data.size;
    });
  },

  methods: {
    move: function(id) {
      this.socket.emit("move", id);
    },
    playAgain: function() {
      this.socket.emit("playAgain");
    }
  },

  components: {
    cell,
    player
  }
};
</script>

<style scoped>
.bbtn {
  width: 40%;
  margin: 0px 10px;
  padding: 0;
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
  background: rgba(0, 0, 0, 0.1);
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
