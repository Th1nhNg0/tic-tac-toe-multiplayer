<template>
  <div class="container" @mouseover="mouseOver" @mouseleave="mouseLeave">
    <img
      @load="imgLoaded=true"
      v-show="imgLoaded"
      :src="player.img"
      v-bind:style="{ 'border-color':getcolor}"
    />
    <img v-if="!imgLoaded" src="loading.svg" style="border-color:red" />

    <p>{{player.username}}</p>

    <transition name="msg">
      <div v-if="showChat" class="msg">
        <div class="content">
          <p>{{getMess}}</p>
        </div>
      </div>
    </transition>
  </div>
</template>


<script>
export default {
  name: "Player",
  props: ["player", "currentTurn", "socket"],
  data() {
    return {
      imgLoaded: false,
      msgText: "",
      showChat: false,
      timeout: null
    };
  },
  created() {
    this.$bus.on("chat", (id, text) => {
      if (id != this.player.id) return;
      this.msgText = text;
      this.showChat = true;
      if (this.timeout) clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.msgText = "";
        this.showChat = false;
        this.timeout = null;
      }, 5000);
    });
  },
  computed: {
    getcolor: function() {
      if (this.player.id == this.currentTurn) return "#4ECDC4";
      else return "#2B706B";
    },
    getMess: function() {
      if (this.msgText.length >= 30)
        return this.msgText.substring(0, 30) + "...";
      return this.msgText;
    }
  },
  methods: {
    mouseOver: function() {
      this.$bus.emit("playerHover", this.player.id);
    },
    mouseLeave: function() {
      this.$bus.emit("playerHoverLeave");
    }
  }
};
</script>


<style scoped>
.msg .content {
  overflow: hidden;
  width: 100%;
}
.msg p {
  letter-spacing: 0px;
}
.msg {
  overflow-wrap: break-word;
  word-wrap: break-word;
  width: 100px;
  background: #4ecdc4;
  margin: auto;
  box-sizing: border-box;
  border-radius: 0.4em;
  padding: 10px;
  color: #4ecdc4;
  z-index: 99;
  position: relative;
  top: -20%;
}

.msg:after {
  content: "";
  position: absolute;
  top: 0;
  left: 50%;
  width: 0;
  height: 0;
  border: 0.4em solid transparent;
  border-bottom-color: #4ecdc4;
  border-top: 0;
  margin-left: -0.4em;
  margin-top: -0.4em;
}

.msg-enter-active,
.msg-leave-active {
  transition: all 0.3s ease-in-out;
}
.msg-enter,
.msg-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}

.container {
  height: 100px;
  width: 100px;
  margin: 10px;
}

p {
  display: table;
  margin: auto;
  color: white;
  font: 17px Helvetica;
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
