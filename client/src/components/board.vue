<template>
  <div id="app">
    <cell v-for="cell in cells" :key="cell.id" :img="cell.img" v-on:change="changeImg(cell.id)"/>
  </div>
</template>

<script>
const defaultCellImg =
  "data:image/gif;base64,R0lGODlhAQABAPAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==";
import io from "socket.io-client";
import cell from "./cell.vue";

export default {
  name: "board",
  data() {
    return {
      socket: {},
      cells: [
        { id: 0, img: defaultCellImg },
        { id: 1, img: defaultCellImg },
        { id: 2, img: defaultCellImg },
        { id: 3, img: defaultCellImg },
        { id: 4, img: defaultCellImg },
        { id: 5, img: defaultCellImg },
        { id: 6, img: defaultCellImg },
        { id: 7, img: defaultCellImg },
        { id: 8, img: defaultCellImg }
      ],
      currentTurn: 0,
      img: [
        "https://scontent.fsgn5-5.fna.fbcdn.net/v/t1.0-1/65124331_2375464486110466_6109340156764880896_n.jpg?_nc_cat=100&_nc_oc=AQlh0aT4Qv_2hvVys2_srahDoZkzWYBzf1R4q8N8L7EJBddybqtXqCaW_R2YFasuYDsYRkZigWbFNtAoL0b2vhQ2&_nc_ht=scontent.fsgn5-5.fna&oh=302d42c3482b56996fdfa90a7d731426&oe=5DC17451",
        "https://scontent.fsgn5-6.fna.fbcdn.net/v/t1.0-9/57113146_2651147064902460_4439177428622901248_n.jpg?_nc_cat=109&_nc_oc=AQkJv85SI-MhUzKBQm05RGEPo0O9r2ZUT3BU2i56wcTE7B_8pXGvJo2NfMN3lw4Vd9AuLG-epi0CvpjG1kC0XFIX&_nc_ht=scontent.fsgn5-6.fna&oh=c963201beb3fe1734e18d822f0b3ef13&oe=5D862FC1"
      ]
    };
  },
  created() {
    this.socket = io("http://localhost:3000");
  },
  methods: {
    changeImg: function(id) {
      this.cells[id].img = this.img[this.currentTurn];
      this.currentTurn = (this.currentTurn + 1) % 2;
    }
  },
  components: {
    cell
  }
};
</script>

<style scoped>
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
