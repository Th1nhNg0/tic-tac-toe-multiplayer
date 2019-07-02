<template>
  <div class="cell" v-on:click="check" v-bind:style="{  width: sizeCalc,
  height: sizeCalc}">
    <img :src="img" />
  </div>
</template>


<script>
export default {
  name: "Cell",
  props: ["img", "canClick", "size"],
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
img {
  object-fit: cover;
  width: 80%;
  height: 80%;
  border-radius: 50%;
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
  background: rgba(0, 0, 0, 0.1);
}
</style>
