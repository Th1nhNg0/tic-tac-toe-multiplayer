<template>
  <div id="app">
    <div v-show="winnerImg!=''" class="overlay">
      <img :src="winnerImg" />
    </div>
    <cell
      v-for="cell in cells"
      :key="cell.id"
      :img="cell.img"
      v-on:change="move(cell.id)"
      :canClick="cell.canClick"
    />
  </div>
</template>

<script>
import cell from "./cell.vue";

export default {
  name: "board",
  props: ["socket", "username"],
  data() {
    return {
      cells: [],
      winnerImg: null
    };
  },
  created() {
    this.socket.on("update", data => {
      this.cells = data.cells;
      this.currentTurn = data.currentTurn;
      this.winnerImg = data.winner.img;
    });
  },
  methods: {
    move: function(id) {
      this.socket.emit("move", id);
    }
  },
  components: {
    cell
  }
};
</script>

<style scoped>
img {
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 50%;
}
.overlay {
  position: fixed;
  width: inherit;
  height: inherit;
  background-color: rgba(0, 0, 0, 0.2);
}

#app {
  margin: auto;
  width: 400px;
  height: 400px;

  display: flex;
  flex-wrap: wrap;

  border-style: solid;
  border-width: 1px;
  border-color: black;
}
</style>
