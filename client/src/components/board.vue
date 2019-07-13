<template>
  <div>
    <h1>Room Name: {{roomID}}</h1>
    <h3 v-if="!isStart&&countDown==0">Waiting for players...</h3>
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
      <transition name="overlay">
        <div v-if="winnerImg!=''" class="overlay">
          <img :src="winnerImg" />
        </div>
      </transition>
      <cell
        v-for="cell in cells"
        :key="cell.id"
        :img="cell.img"
        v-on:change="move(cell.id)"
        :canClick="cell.canClick"
        :size="size"
        :id="cell.mark"
      />
    </div>

    <transition name="countDown" mode="out-in">
      <h1 v-if="countDown>0" :key="countDown" id="countDown">{{countDown}}</h1>
    </transition>

    <button
      v-show="(!isStart||winnerImg!='')&&countDown==0"
      v-on:click="$bus.emit('back')"
      class="btn bbtn"
    >BACK</button>
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
      size: null,
      countDown: 0
    };
  },

  created() {
    this.socket.on("waiting", time => {
      this.countDown = time;
    });
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
#countDown {
  font-size: 200px;
  margin: 0;
  user-select: none;
}

.overlay-enter-active {
  transition: all 0.3s ease-in-out;
  transition-delay: 1s;
}
.overlay-enter {
  opacity: 0;
  position: absolute;
  transform: scale(0);
  transform: rotate(90deg);
}

.countDown-enter-active {
  transition: all 0.35s ease-in-out;
}
.countDown-enter {
  opacity: 0;
  transform: rotate3d(0, 1, 0, -180deg);
}
.bbtn {
  width: 40%;
  margin: 20px 10px;
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
  z-index: 1;
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

h3 {
  overflow: hidden;
  background: linear-gradient(90deg, #1a535c, #4ecdc4, #1a535c);
  background-repeat: no-repeat;
  background-size: 85%;
  animation: textAnimate 2s linear infinite;
  -webkit-background-clip: text;
  -webkit-text-fill-color: rgba(255, 255, 255, 0.2);
}
@keyframes textAnimate {
  0% {
    background-position: -500%;
  }
  100% {
    background-position: 500%;
  }
}
</style>
