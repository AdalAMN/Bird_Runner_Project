// input.js
// Responsável por: capturar entradas do usuário (teclado, mouse e touch)
// e notificar o main.js via callback — não conhece nenhum outro módulo.

// ─── Variável de controle ─────────────────────────────────────────────────────

/** Guarda os callbacks registrados pelo main.js */
let _callbacks = {
    onJump: null,
  };
  
  // ─── Função pública ───────────────────────────────────────────────────────────
  
  /**
   * Registra os listeners de input e armazena os callbacks.
   * Deve ser chamado uma única vez pelo main.js na inicialização.
   *
   * @param {{ onJump: Function }} callbacks
   *   onJump — chamado quando o jogador pressiona Espaço, ArrowUp, clica ou toca a tela
   */
  export function setupInput({ onJump }) {
    _callbacks.onJump = onJump;
  
    // Teclado: Espaço ou seta para cima
    document.addEventListener('keydown', _handleKeydown);
  
    // Mouse: clique no container do jogo
    document.getElementById('game-container')
      ?.addEventListener('click', _handleClick);
  
    // Touch: toque na tela (mobile)
    document.getElementById('game-container')
      ?.addEventListener('touchstart', _handleTouch, { passive: true });
  }
  
  /**
   * Remove todos os listeners registrados.
   * Útil para limpeza caso o jogo seja desmontado.
   */
  export function teardownInput() {
    document.removeEventListener('keydown', _handleKeydown);
  
    document.getElementById('game-container')
      ?.removeEventListener('click', _handleClick);
  
    document.getElementById('game-container')
      ?.removeEventListener('touchstart', _handleTouch);
  }
  
  // ─── Handlers privados ────────────────────────────────────────────────────────
  
  function _handleKeydown(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
      e.preventDefault(); // evita scroll da página com espaço/seta
      _callbacks.onJump?.();
    }
  }
  
  function _handleClick(e) {
    // Ignora cliques em botões da HUD (pause, etc.)
    if (e.target.closest('button')) return;
    _callbacks.onJump?.();
  }
  
  function _handleTouch(e) {
    // Ignora toques em botões da HUD
    if (e.target.closest('button')) return;
    _callbacks.onJump?.();
  }
  