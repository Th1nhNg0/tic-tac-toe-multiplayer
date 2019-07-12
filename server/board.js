class Board {
  constructor(size) {
    this.cells = [];
    this.size = size;
    for (var i = 0; i < this.size * this.size; i++) {
      this.cells.push({
        id: i,
        img: "",
        canClick: true,
        mark: ""
      });
    }
  }

  move(player, cellID) {
    this.cells[cellID].img = player.img;
    this.cells[cellID].canClick = false;
    this.cells[cellID].mark = player.id;
  }

  tie() {
    for (var i = 0; i < this.size * this.size; i++) {
      if (this.cells[i].mark == "") return false;
    }
    return true;
  }

  win(id) {
    var cells2D = [];
    var cells = [...this.cells];
    while (cells.length) cells2D.push(cells.splice(0, this.size));
    //horizontal
    for (var i = 0; i < this.size; i++)
      for (var j = 1; j < this.size - 1; j++)
        if (
          cells2D[i][j].mark == cells2D[i][j - 1].mark &&
          cells2D[i][j].mark == cells2D[i][j + 1].mark &&
          cells2D[i][j].mark == id
        )
          return true;

    // vertical
    for (var j = 0; j < this.size; j++)
      for (var i = 1; i < this.size - 1; i++)
        if (
          cells2D[i][j].mark == cells2D[i - 1][j].mark &&
          cells2D[i][j].mark == cells2D[i + 1][j].mark &&
          cells2D[i][j].mark == id
        )
          return true;

    //diagonal
    for (var i = 0; i < this.size - 2; i++)
      for (var j = 0; j < this.size - 2; j++)
        if (
          cells2D[i][j].mark == cells2D[i + 1][j + 1].mark &&
          cells2D[i][j].mark == cells2D[i + 2][j + 2].mark &&
          cells2D[i][j].mark == id
        )
          return true;

    //other diagonal
    for (var i = 0; i < this.size - 2; i++)
      for (var j = 2; j < this.size; j++)
        if (
          cells2D[i][j].mark == cells2D[i + 1][j - 1].mark &&
          cells2D[i][j].mark == cells2D[i + 2][j - 2].mark &&
          cells2D[i][j].mark == id
        )
          return true;

    // otherwise
    return false;
  }
}

module.exports = Board;