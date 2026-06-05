// main.js
// Orquestrador central: importa todos os módulos e controla o loop do jogo.
// Este arquivo NÃO contém lógica de física, colisão ou pontuação —
// apenas coordena as chamadas entre os módulos.

import { GAME_STATE, getState, changeState, getGameConfig, initGameConfig, tickDifficulty } from './gameState.js';
import { updateBird, jumpBird, resetBird }                                                  from './bird.js';
import { updatePipes, getAllPipes, resetPipes }                                              from './pipes.js';
import { checkCollision }                                                                    from './collision.js';
import { addPoint, loseLife, resetScore, finalizeScore }                                    from './score.js';
import { setupInput }                                                                        from './input.js';
import { saveDifficulty }                                                                    from './storage.js';
import { updatePowerups, checkPickup, isShieldActive, resetPowerups }                       from './powerup.js';

// ─── Referências ao DOM ───────────────────────────────────────────────────────

const birdEl           = document.getElementById('bird');
const btnPlay          = document.getElementById('btn-play');
const btnRestart       = document.getElementById('btn-restart');
const btnPause         = document.getElementById('btn-pause');
const btnResume        = document.getElementById('btn-resume');
const difficultyBtns   = document.querySelectorAll('[data-difficulty]');
const finalScoreEl     = document.getElementById('final-score');
const finalHighScoreEl = document.getElementById('final-highscore');
const newRecordEl      = document.getElementById('new-record');

// ─── Configuração de input ────────────────────────────────────────────────────

// Passa a função de pulo para o módulo de input
// O input.js chama onJump() sempre que o jogador pressiona espaço ou clica
setupInput({
  onJump: () => {
    if (getState() === GAME_STATE.PLAYING) jumpBird();
  },
});

// ─── Listeners de UI ──────────────────────────────────────────────────────────

btnPlay?.addEventListener('click', _startGame);
btnRestart?.addEventListener('click', _startGame);

btnPause?.addEventListener('click', () => {
  if (getState() === GAME_STATE.PLAYING) changeState(GAME_STATE.PAUSED);
});

btnResume?.addEventListener('click', () => {
  if (getState() === GAME_STATE.PAUSED) {
    changeState(GAME_STATE.PLAYING);
    _loop(); // retoma o loop
  }
});

// Botões de dificuldade no menu: ex: <button data-difficulty="hard">Difícil</button>
difficultyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    saveDifficulty(btn.dataset.difficulty);
    difficultyBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
  });
});

// ─── Loop principal ───────────────────────────────────────────────────────────

let animFrameId = null; // guarda o id do requestAnimationFrame para poder cancelar

/**
 * Um frame do jogo. Chamado via requestAnimationFrame enquanto PLAYING.
 */
function _loop() {
  if (getState() !== GAME_STATE.PLAYING) return; // interrompe se pausou ou game over

  // 1. Aumenta dificuldade gradualmente
  tickDifficulty();

  // 2. Atualiza física do pássaro
  updateBird();

  // 3. Atualiza power-ups (spawn, movimento) e verifica coleta
  updatePowerups();
  checkPickup(birdEl);

  // 4. Atualiza canos (spawn, movimento, remoção) e verifica passagem
  const { scored } = updatePipes();
  if (scored) addPoint();

  // 5. Verifica colisão — ignora se escudo estiver ativo
  const { hit } = checkCollision(birdEl, getAllPipes());
  if (hit && !isShieldActive()) {
    _handleHit();
    return; // encerra o frame atual
  }

  // 6. Agenda o próximo frame
  animFrameId = requestAnimationFrame(_loop);
}

// ─── Funções privadas ─────────────────────────────────────────────────────────

/**
 * Inicia ou reinicia uma partida do zero.
 */
function _startGame() {
  // Cancela loop anterior se houver
  if (animFrameId) cancelAnimationFrame(animFrameId);

  // Reseta todos os módulos
  initGameConfig();
  resetBird();
  resetPipes();
  resetPowerups();
  resetScore();

  // Muda estado e inicia o loop
  changeState(GAME_STATE.PLAYING);
  animFrameId = requestAnimationFrame(_loop);
}

/**
 * Chamado quando checkCollision detecta uma colisão.
 * Deduz uma vida e decide se o jogo continua ou acaba.
 */
function _handleHit() {
  const gameOver = loseLife();

  if (gameOver) {
    _endGame();
  } else {
    // Ainda tem vidas: reposiciona o pássaro e continua
    resetBird();
    animFrameId = requestAnimationFrame(_loop);
  }
}

/**
 * Encerra a partida: salva o score, exibe a tela de game over.
 */
function _endGame() {
  const { score, highScore, isNewRecord } = finalizeScore();

  // Preenche os valores na tela de game over
  if (finalScoreEl)     finalScoreEl.textContent     = score;
  if (finalHighScoreEl) finalHighScoreEl.textContent = highScore;
  if (newRecordEl)      newRecordEl.style.display    = isNewRecord ? 'block' : 'none';

  changeState(GAME_STATE.GAME_OVER);
}
