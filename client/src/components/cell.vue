<template>
  <div class="cell" v-on:click="check">
    <img :src="img" />
  </div>
</template>


<script>
export default {
  name: "Cell",
  props: ["img", "canClick"],
  methods: {
    check: function() {
      if (this.canClick) {
        this.$emit("change");
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
  width: 33.333333333333336%;
  height: 33.333333333333336%;

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
  background: rgba(0, 0, 0, 0.1);
}
</style>
