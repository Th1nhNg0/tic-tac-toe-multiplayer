class Player {
  constructor(id, username, img, isBot) {
    this.username = username;
    this.id = id;
    this.img = img;
    this.isBot = isBot;
  }
}

module.exports = Player;
