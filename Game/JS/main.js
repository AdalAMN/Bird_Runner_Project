// main.js
// Orquestrador central: importa todos os modulos e controla o loop do jogo.
// Este arquivo NAO contem lógica de física, colisão ou pontuacao -
// apenas coordena as chamadas entre os modulos.

import {
  GAME_STATE,
  getState,
  changeState,
  getGameConfig,
  initGameConfig,
  tickDifficulty,
} from "./gameState.js";
import { updateBird, jumpBird, resetBird, birdEl } from "./bird.js";
import { updatePipes, getAllPipes, resetPipes } from "./pipes.js";
import { checkCollision } from "./collision.js";
import { addPoint, loseLife, resetScore, finalizeScore } from "./score.js";
import { setupInput } from "./input.js";
import { saveDifficulty } from "./storage.js";
import {
  updatePowerups,
  checkPickup,
  isShieldActive,
  resetPowerups,
} from "./powerup.js";

// Referencias ao DOM

const btnPlay = document.getElementById("btn-play");
const btnRestart = document.getElementById("btn-restart");
const btnPause = document.getElementById("btn-pause");
const btnResume = document.getElementById("btn-resume");
const btnQuit = document.getElementById("btn-quit");
const btnMenu = document.getElementById("btn-menu");
const difficultyBtns = document.querySelectorAll("[data-difficulty]");
const finalScoreEl = document.getElementById("final-score");
const finalHighScoreEl = document.getElementById("final-highscore");
const newRecordEl = document.getElementById("new-record");

// Configuração de input

// Passa a funcao de pulo para o módulo de input
// O input.js chama onJump() sempre que o jogador pressiona espaço ou clica
setupInput({
  onJump: () => {
    if (getState() === GAME_STATE.PLAYING) jumpBird();
  },
});

// Listeners de UI

btnPlay?.addEventListener("click", _startGame);
btnRestart?.addEventListener("click", _startGame);

btnPause?.addEventListener("click", () => {
  if (getState() === GAME_STATE.PLAYING) changeState(GAME_STATE.PAUSED);
});

btnResume?.addEventListener("click", () => {
  if (getState() === GAME_STATE.PAUSED) {
    changeState(GAME_STATE.PLAYING);
    _loop(); // retoma o loop
  }
});

btnQuit?.addEventListener("click", _quitToMenu);
btnMenu?.addEventListener("click", _quitToMenu);

// Botoes de dificuldade no menu: ex: <button data-difficulty="hard">Difícil</button>
difficultyBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    saveDifficulty(btn.dataset.difficulty);
    difficultyBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// Loop principal

let animFrameId = null; // guarda o id do requestAnimationFrame para poder cancelar

/**
 * Um frame do jogo. Chamado via requestAnimationFrame enquanto PLAYING.
 */
function _loop() {
  if (getState() !== GAME_STATE.PLAYING) return;

  tickDifficulty();
  updateBird();
  updatePowerups();
  checkPickup(birdEl);

  const { scored } = updatePipes();
  if (scored) addPoint();

  const { hit } = checkCollision(birdEl, getAllPipes());
  if (hit && !isShieldActive()) {
    _handleHit();
    return;
  }

  animFrameId = requestAnimationFrame(_loop);
}

// Funcoes privadas

/**
 * Inicia ou reinicia uma partida do zero.
 */
function _startGame() {
  console.log("[debug] _startGame: estado antes =", getState());
  if (animFrameId) cancelAnimationFrame(animFrameId);

  initGameConfig();
  resetBird();
  resetPipes();
  resetPowerups();
  resetScore();

  changeState(GAME_STATE.PLAYING);
  console.log("[debug] _startGame: estado depois =", getState());
  animFrameId = requestAnimationFrame(_loop);
}

/**
 * Encerra a partida atual e volta ao menu principal.
 * Usado pelo botao "Menu" da tela de pause e da tela de game over.
 */
function _quitToMenu() {
  console.log("[debug] _quitToMenu: estado antes =", getState());
  if (animFrameId) {
    cancelAnimationFrame(animFrameId);
    animFrameId = null;
  }
  changeState(GAME_STATE.MENU);
  console.log("[debug] _quitToMenu: estado depois =", getState());
}

/**
 * Chamado quando checkCollision detecta uma colisao.
 * Deduz uma vida e decide se o jogo continua ou acaba.
 */
function _handleHit() {
  const gameOver = loseLife();

  if (gameOver) {
    _endGame();
  } else {
    resetBird();
    animFrameId = requestAnimationFrame(_loop);
  }
}

/**
 * Encerra a partida: salva o score, exibe a tela de game over.
 */
function _endGame() {
  const { score, highScore, isNewRecord } = finalizeScore();

  if (finalScoreEl) finalScoreEl.textContent = score;
  if (finalHighScoreEl) finalHighScoreEl.textContent = highScore;
  if (newRecordEl) newRecordEl.style.display = isNewRecord ? "block" : "none";

  changeState(GAME_STATE.GAME_OVER);
}
