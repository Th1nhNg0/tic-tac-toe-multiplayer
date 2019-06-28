<template>
  <div class="cell" v-on:click="check">
    <img :src="img">
  </div>
</template>


<script>
export default {
  name: "Cell",
  props: ["img"],
  data() {
    return {
      canClick: true
    };
  },
  methods: {
    check: function() {
      if (this.canClick) {
        this.$emit("change");
        this.canClick = false;
      }
    }
  }
};
</script>


<style scoped>
img {
  object-fit: cover;
  width: 80%;
  height: 80%;
  border-radius: 50%;
}

.cell {
  width: 33.33%;
  height: 33.33%;

  display: flex;
  justify-content: center;
  align-items: center;

  box-sizing: border-box;
  border-style: solid;
  border-width: 1px;
  border-color: black;

  user-select: none;

  transition: 0.1s ease-in-out;
}
.cell:hover {
  background: rgba(0, 0, 0, 0.1);
}
</style>
