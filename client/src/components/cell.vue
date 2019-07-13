<template>
  <div class="cell" v-on:click="check" :style="{  width: sizeCalc,
  height: sizeCalc}">
    <transition name="playerImg">
      <img v-if="img!=''" :src="img" :style="{width:imgSize, height:imgSize,opacity:imgOpacity}" />
    </transition>
  </div>
</template>


<script>
export default {
  name: "Cell",
  props: ["img", "canClick", "size", "id"],
  data() {
    return {
      imgSize: 80 + "%",
      imgOpacity: 1
    };
  },
  created() {
    this.$bus.on("playerHover", id => {
      if (id == this.id) {
        this.imgSize = 90 + "%";
        this.imgOpacity = 1;
      } else {
        this.imgSize = 70 + "%";
        this.imgOpacity = 0.5;
      }
    });
    this.$bus.on("playerHoverLeave", () => {
      this.imgOpacity = 1;
      this.imgSize = 80 + "%";
    });
  },
  methods: {
    check: function() {
      if (this.canClick) {
        this.$emit("change");
      }
    }
  },
  computed: {
    sizeCalc: function() {
      return 100 / this.size + "%";
    }
  }
};
</script>


<style scoped>
.playerImg-enter-active {
  transition: all 0.2s;
}
.playerImg-enter {
  opacity: 0;
  transform: scale(0);
}
img {
  object-fit: cover;
  border-radius: 50%;
  transition: 0.1s ease-in;
}

.cell {
  width: calc(100% / 3);
  height: calc(100% / 3);

  display: flex;
  justify-content: center;
  align-items: center;

  box-sizing: border-box;
  border-style: solid;
  border-width: 1px;
  border-color: black;

  user-select: none;
}
.cell:hover {
  background: rgba(0, 0, 0, 0.2);
}
</style>
