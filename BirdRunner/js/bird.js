// Objeto do passaro
const bird = {
  x: 100,
  y: 300,
  width: 34,
  height: 24,
  velocity: 0,
  gravity: 0.6,
  jumpForce: -12,

  update() {
    if (!gameState.isActive()) return;

    // Vai aplicar gravidade
    this.velocity += this.gravity;
    this.y += this.velocity;

    // Isso limita movimento na tela
    if (this.y + this.height > 600) {
      this.y = 600 - this.height;
      this.velocity = 0;
    }

    if (this.y < 0) {
      this.y = 0;
      this.velocity = 0;
    }
  },

  jump() {
    this.velocity = this.jumpForce;
  },

  draw(ctx) {
    // Para desenhar passaro como um retangulo amarelo
    ctx.fillStyle = "#ffde00";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Para Desenhar olho
    ctx.fillStyle = "#000";
    ctx.fillRect(this.x + 20, this.y + 6, 5, 5);
  },

  reset() {
    this.x = 100;
    this.y = 300;
    this.velocity = 0;
  },
};
