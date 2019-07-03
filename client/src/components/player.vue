<template>
  <div class="container" @mouseover="mouseOver" @mouseleave="mouseLeave" @click="mouseClick">
    <img :src="player.img" v-bind:style="{ 'border-color':getcolor}" />
    <p>{{player.username}}</p>
  </div>
</template>


<script>
export default {
  name: "Player",
  props: ["player", "currentTurn", "socket"],
  computed: {
    getcolor: function() {
      if (this.player.id == this.currentTurn) return "#2A8048";
      else return "black";
    }
  },
  methods: {
    mouseClick: function() {
      if (this.player.isBot) this.socket.emit("removeBot", this.player.id);
    },
    mouseOver: function() {
      this.$bus.emit("playerHover", this.player.img);
    },
    mouseLeave: function() {
      this.$bus.emit("playerHoverLeave");
    }
  }
};
</script>


<style scoped>
.container {
  height: 100%;
  margin: 10px;
}
p {
  display: table;
  margin: auto;
  color: white;
  font: 20px Helvetica;
  letter-spacing: 3px;
}
img {
  object-fit: cover;
  height: 70%;
  border-radius: 50%;
  border: 7px solid;
  transition: 0.1s ease-in;
}
img:hover {
  transform: scale(1.2);
}
</style>
