// dom.js
// Cache de referencias ao DOM que sao usadas em varios modulos.
// Centraliza o lookup inicial para evitar chamadas repetidas a getElementById
// espalhadas pelo codigo.

// Container principal do jogo: tudo (passaro, canos, power-ups, HUD) vive aqui dentro
export const containerEl = document.getElementById("game-container");
