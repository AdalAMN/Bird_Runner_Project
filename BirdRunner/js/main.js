// Configuracao do canvas
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 600;

// loop principal
function gameLoop() {
  // limpar canvas
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Atualizar e renderizar passaro
  bird.update();
  bird.draw(ctx);

  // Continuar o loop
  requestAnimationFrame(gameLoop);
}

// Controles
document.addEventListener("keydown", (event) => {
  if (event.key === " " || event.key === "ArrowUp") {
    event.preventDefault();
    bird.jump();
  }
});

// Da o start no jogo
gameState.start();
gameLoop();
