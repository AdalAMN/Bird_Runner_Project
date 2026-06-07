// score.js
// Responsável por: controlar pontos, vidas e atualizar o DOM com esses valores

import { saveHighScore, getHighScore } from "./storage.js";

// Estado interno do modulo

let currentScore = 0;
let currentLives = 3;

const MAX_LIVES = 3;

// Configuração dos elementos do DOM
// Esses IDs precisam existir no index.html

const scoreEl = document.getElementById("score-display");
const livesEl = document.getElementById("lives-display");

// Funcoes publicas

/**
 * Reinicia pontuação e vidas para uma nova partida.
 * Chame junto com resetPipes() e resetBird() no início do jogo.
 */
export function resetScore() {
  currentScore = 0;
  currentLives = MAX_LIVES;
  _render();
}

/**
 * Incrementa a pontuação em 1 ponto.
 * Chamado pelo main.js quando updatePipes() retorna { scored: true }.
 */
export function addPoint() {
  currentScore++;
  _render();
}

/**
 * Adiciona uma vida extra (usado por power-up).
 * Respeita o limite máximo de vidas.
 */
export function addLife() {
  if (currentLives < MAX_LIVES) {
    currentLives++;
    _render();
  }
}

/**
 * Remove uma vida. Retorna true se o jogo deve terminar (vidas = 0).
 * @returns {boolean} gameOver
 */
export function loseLife() {
  currentLives = Math.max(0, currentLives - 1);
  _render();
  return currentLives === 0;
}

/**
 * Finaliza a partida: salva o high score se necessário.
 * Retorna um objeto com o score final e o melhor score historico.
 * @returns {{ score: number, highScore: number, isNewRecord: boolean }}
 */
export function finalizeScore() {
  const previous = getHighScore();
  const isNewRecord = currentScore > previous;

  if (isNewRecord) {
    saveHighScore(currentScore);
  }

  return {
    score: currentScore,
    highScore: isNewRecord ? currentScore : previous,
    isNewRecord,
  };
}

// Funcoes privadas

/**
 * Atualiza os elementos do DOM com os valores atuais.
 * Chamada internamente sempre que score ou vidas mudam.
 */
function _render() {
  if (scoreEl) scoreEl.textContent = currentScore;

  if (livesEl) {
    livesEl.textContent =
      "❤️".repeat(currentLives) + "🖤".repeat(MAX_LIVES - currentLives);
  }
}
