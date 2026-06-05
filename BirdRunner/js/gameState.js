// gameState.js
// Responsável por: controlar o estado atual do jogo e as configurações de dificuldade

import { getDifficulty } from './storage.js';

// ─── Enum de estados ──────────────────────────────────────────────────────────

export const GAME_STATE = {
  MENU:      'menu',
  PLAYING:   'playing',
  PAUSED:    'paused',
  GAME_OVER: 'game_over',
};

// ─── Estado interno ───────────────────────────────────────────────────────────

let currentState = GAME_STATE.MENU;

// ─── Configurações por dificuldade ────────────────────────────────────────────

const DIFFICULTY_CONFIGS = {
  easy: {
    pipeSpeed:     2,
    pipeGap:       190,
    spawnInterval: 110,
    speedIncrement:  0.0015,  // quanto a velocidade cresce por frame
    minPipeGap:    150,       // gap mínimo mesmo no nível mais alto
  },
  normal: {
    pipeSpeed:     3,
    pipeGap:       160,
    spawnInterval: 90,
    speedIncrement:  0.002,
    minPipeGap:    120,
  },
  hard: {
    pipeSpeed:     4,
    pipeGap:       130,
    spawnInterval: 70,
    speedIncrement:  0.003,
    minPipeGap:    100,
  },
};

// Config "viva" que vai sendo ajustada ao longo da partida
let activeConfig = { ...DIFFICULTY_CONFIGS.normal };

// ─── Funções públicas ─────────────────────────────────────────────────────────

/**
 * Retorna o estado atual do jogo.
 * @returns {string} Um dos valores de GAME_STATE
 */
export function getState() {
  return currentState;
}

/**
 * Muda o estado do jogo e atualiza a visibilidade das telas no DOM.
 * @param {string} newState - Um dos valores de GAME_STATE
 */
export function changeState(newState) {
  currentState = newState;
  _updateScreenVisibility(newState);
}

/**
 * Retorna a configuração de dificuldade ativa no momento.
 * Chamado pelo pipes.js a cada frame para obter velocidade e gap atuais.
 * @returns {{ pipeSpeed, pipeGap, spawnInterval }}
 */
export function getGameConfig() {
  return activeConfig;
}

/**
 * Inicializa a config de dificuldade com base no que está salvo no localStorage.
 * Chame ao iniciar uma nova partida (antes do loop começar).
 */
export function initGameConfig() {
  const difficulty = getDifficulty(); // 'easy' | 'normal' | 'hard'
  activeConfig = { ...DIFFICULTY_CONFIGS[difficulty] };
}

/**
 * Aumenta a dificuldade progressivamente a cada frame.
 * Deve ser chamado pelo main.js enquanto o estado for PLAYING.
 */
export function tickDifficulty() {
  // Aumenta a velocidade gradualmente até um teto
  activeConfig.pipeSpeed = Math.min(
    activeConfig.pipeSpeed + activeConfig.speedIncrement,
    10
  );

  // Reduz o gap entre os canos conforme o score sobe
  activeConfig.pipeGap = Math.max(
    activeConfig.pipeGap - activeConfig.speedIncrement * 5,
    activeConfig.minPipeGap
  );
}

// ─── Funções privadas ─────────────────────────────────────────────────────────

/**
 * Mostra a tela correspondente ao estado e esconde as demais.
 * Cada tela no HTML deve ter a classe 'screen' e um id como 'screen-menu'.
 * @param {string} state
 */
function _updateScreenVisibility(state) {
  const screens = document.querySelectorAll('.screen');
  screens.forEach(screen => {
    screen.classList.remove('screen--active');
  });

  const target = document.getElementById(`screen-${state}`);
  if (target) target.classList.add('screen--active');
}

