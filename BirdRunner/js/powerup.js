// powerup.js
// Responsável por: spawnar, mover, verificar coleta e aplicar efeitos de power-ups

import { addLife } from './score.js';

// ─── Tipos de power-up disponíveis ───────────────────────────────────────────

const POWERUP_TYPES = {
  SHIELD: {
    id:       'shield',
    emoji:    '🛡️',
    label:    'Escudo',
    color:    '#4FC3F7',
    duration: 3000,   // ms de invencibilidade
  },
  EXTRA_LIFE: {
    id:       'extra_life',
    emoji:    '❤️',
    label:    'Vida Extra',
    color:    '#EF5350',
    duration: 0,      // efeito instantâneo, sem duração
  },
  SLOW_MO: {
    id:       'slow_mo',
    emoji:    '⏳',
    label:    'Câmera Lenta',
    color:    '#FFD54F',
    duration: 4000,   // ms com gravidade reduzida
  },
};

// ─── Estado interno ───────────────────────────────────────────────────────────

/** @type {HTMLElement[]} Power-ups ativos no DOM */
const activePowerups = [];

/** @type {{ type: object, expiresAt: number }|null} Efeito ativo no momento */
let activeEffect = null;

let spawnTimer = 0;

const SPAWN_INTERVAL = 300;   // frames entre tentativas de spawn
const SPAWN_CHANCE   = 0.4;   // 40% de chance a cada tentativa
const SIZE           = 36;    // px — tamanho do elemento no DOM
const SPEED          = 2;     // px por frame (mais lento que os canos)

// ─── Funções públicas ─────────────────────────────────────────────────────────

/**
 * Reinicia o estado dos power-ups para uma nova partida.
 */
export function resetPowerups() {
  activePowerups.forEach(el => el.remove());
  activePowerups.length = 0;
  activeEffect = null;
  spawnTimer   = 0;
}

/**
 * Atualiza power-ups a cada frame: tenta spawnar, move os existentes,
 * remove os que saíram da tela e verifica se efeitos expiraram.
 * Deve ser chamado pelo main.js enquanto o estado for PLAYING.
 */
export function updatePowerups() {
  // 1. Tenta spawnar um novo power-up
  spawnTimer++;
  if (spawnTimer >= SPAWN_INTERVAL) {
    spawnTimer = 0;
    if (Math.random() < SPAWN_CHANCE) _spawnRandom();
  }

  // 2. Move e remove power-ups que saíram da tela
  for (let i = activePowerups.length - 1; i >= 0; i--) {
    const el = activePowerups[i];
    const newLeft = parseFloat(el.style.left) - SPEED;
    el.style.left = newLeft + 'px';

    if (newLeft + SIZE < 0) {
      el.remove();
      activePowerups.splice(i, 1);
    }
  }

  // 3. Verifica se o efeito ativo expirou
  if (activeEffect && Date.now() >= activeEffect.expiresAt) {
    _removeEffect(activeEffect.type);
    activeEffect = null;
  }
}

/**
 * Verifica se o pássaro coletou algum power-up.
 * Deve ser chamado pelo main.js após updatePowerups(), passando o elemento do pássaro.
 * @param {HTMLElement} birdEl
 */
export function checkPickup(birdEl) {
  const birdRect = birdEl.getBoundingClientRect();

  for (let i = activePowerups.length - 1; i >= 0; i--) {
    const el       = activePowerups[i];
    const powerRect = el.getBoundingClientRect();

    if (_rectsOverlap(birdRect, powerRect)) {
      const typeId = el.dataset.typeId;
      const type   = Object.values(POWERUP_TYPES).find(t => t.id === typeId);

      _applyEffect(type);

      // Animação de coleta antes de remover
      _playCollectAnimation(el);

      activePowerups.splice(i, 1);
    }
  }
}

/**
 * Retorna true se o escudo estiver ativo no momento.
 * Usado pelo main.js para ignorar colisões enquanto o escudo estiver ativo.
 * @returns {boolean}
 */
export function isShieldActive() {
  return activeEffect?.type?.id === 'shield';
}

/**
 * Retorna true se o slow motion estiver ativo.
 * Pode ser consultado pelo bird.js para reduzir a gravidade.
 * @returns {boolean}
 */
export function isSlowMoActive() {
  return activeEffect?.type?.id === 'slow_mo';
}

// ─── Funções privadas ─────────────────────────────────────────────────────────

/**
 * Spawna um power-up aleatório no lado direito da tela.
 */
function _spawnRandom() {
  const container  = document.getElementById('game-container');
  const gameHeight = container.offsetHeight;
  const gameWidth  = container.offsetWidth;

  // Escolhe tipo aleatoriamente
  const types = Object.values(POWERUP_TYPES);
  const type  = types[Math.floor(Math.random() * types.length)];

  // Posição Y aleatória (evita aparecer nas bordas)
  const topMin = 40;
  const topMax = gameHeight - SIZE - 40;
  const top    = topMin + Math.random() * (topMax - topMin);

  const el = document.createElement('div');
  el.classList.add('powerup');
  el.dataset.typeId = type.id;
  el.textContent    = type.emoji;

  el.style.cssText = `
    position:    absolute;
    left:        ${gameWidth}px;
    top:         ${top}px;
    width:       ${SIZE}px;
    height:      ${SIZE}px;
    font-size:   22px;
    line-height: ${SIZE}px;
    text-align:  center;
    border-radius: 50%;
    background:  ${type.color}44;
    border:      2px solid ${type.color};
    cursor:      default;
    user-select: none;
    animation:   powerup-float 1s ease-in-out infinite alternate;
  `;

  container.appendChild(el);
  activePowerups.push(el);
}

/**
 * Aplica o efeito do power-up coletado.
 * @param {object} type - Um dos valores de POWERUP_TYPES
 */
function _applyEffect(type) {
  if (!type) return;

  // Remove efeito anterior se houver
  if (activeEffect) {
    _removeEffect(activeEffect.type);
  }

  switch (type.id) {
    case 'extra_life':
      addLife(); // efeito instantâneo — não guarda estado
      break;

    case 'shield':
    case 'slow_mo':
      activeEffect = {
        type,
        expiresAt: Date.now() + type.duration,
      };
      _showEffectIndicator(type);
      break;
  }
}

/**
 * Remove o efeito visual do indicador de power-up ativo.
 * @param {object} type
 */
function _removeEffect(type) {
  const indicator = document.getElementById('powerup-indicator');
  if (indicator) indicator.style.display = 'none';
}

/**
 * Exibe o indicador de power-up ativo na HUD com um timer visual.
 * Requer um elemento <div id="powerup-indicator"> no HTML.
 * @param {object} type
 */
function _showEffectIndicator(type) {
  const indicator = document.getElementById('powerup-indicator');
  if (!indicator) return;

  indicator.textContent  = `${type.emoji} ${type.label}`;
  indicator.style.display = 'block';

  // Remove automaticamente quando o efeito expirar
  setTimeout(() => {
    indicator.style.display = 'none';
  }, type.duration);
}

/**
 * Anima e remove o elemento do power-up coletado do DOM.
 * @param {HTMLElement} el
 */
function _playCollectAnimation(el) {
  el.style.transition = 'transform 0.2s ease, opacity 0.2s ease';
  el.style.transform  = 'scale(1.8)';
  el.style.opacity    = '0';

  setTimeout(() => el.remove(), 200);
}

/**
 * Verifica sobreposição entre dois DOMRects.
 * @param {DOMRect} a
 * @param {DOMRect} b
 * @returns {boolean}
 */
function _rectsOverlap(a, b) {
  return (
    a.left   < b.right  &&
    a.right  > b.left   &&
    a.top    < b.bottom &&
    a.bottom > b.top
  );
}
