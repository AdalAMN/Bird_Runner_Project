// storage.js
// Responsável por: salvar e recuperar dados persistentes via localStorage

const KEYS = {
  HIGH_SCORE: "flappybird_highscore",
  DIFFICULTY: "flappybird_difficulty",
};

// High Score

/**
 * Salva o high score no localStorage.
 * @param {number} score
 */
export function saveHighScore(score) {
  localStorage.setItem(KEYS.HIGH_SCORE, String(score));
}

/**
 * Le o high score salvo. Retorna 0 se não houver nenhum.
 * @returns {number}
 */
export function getHighScore() {
  return parseInt(localStorage.getItem(KEYS.HIGH_SCORE) ?? "0", 10);
}

// Dificuldade

/**
 * Salva a dificuldade escolhida no menu.
 * @param {'easy' | 'normal' | 'hard'} difficulty
 */
export function saveDifficulty(difficulty) {
  localStorage.setItem(KEYS.DIFFICULTY, difficulty);
}

/**
 * Le a dificuldade salva. Retorna 'normal' como padrão.
 * @returns {'easy' | 'normal' | 'hard'}
 */
export function getDifficulty() {
  return localStorage.getItem(KEYS.DIFFICULTY) ?? "normal";
}

/**
 * Apaga todos os dados salvos do jogo (útil para botão "Resetar dados").
 */
export function clearAll() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}

