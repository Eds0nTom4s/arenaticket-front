<template>
  <div class="at-layout">
    <header class="at-header">
      <div class="at-logo">ArenaTicket</div>
      <button class="at-menu-btn" aria-label="Abrir menu" @click="openMenu = true">
        <svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect y="4" width="24" height="2" rx="1" fill="currentColor"/><rect y="11" width="24" height="2" rx="1" fill="currentColor"/><rect y="18" width="24" height="2" rx="1" fill="currentColor"/></svg>
      </button>
      <aside v-if="openMenu" class="at-menu-overlay" @click.self="openMenu = false">
        <nav class="at-menu">
          <button class="at-menu-close" aria-label="Fechar menu" @click="openMenu = false">×</button>
          <ul>
            <li><a href="#">Meus Bilhetes</a></li>
            <li><a href="#">Ajuda</a></li>
          </ul>
        </nav>
      </aside>
    </header>
    <main class="at-main">
      <slot />
    </main>
    <footer class="at-footer">
      <span>© ArenaTicket 2025 – Todos os direitos reservados</span>
      <span class="at-version">v1.0.0</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const openMenu = ref(false);
</script>

<style scoped>
@import '../styles/global.css';

.at-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
.at-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-md) var(--space-lg);
  background: var(--color-neutral-100);
  box-shadow: var(--shadow-card);
  position: sticky;
  top: 0;
  z-index: 10;
}
.at-logo {
  font-family: 'Poppins', sans-serif;
  font-size: var(--font-size-xl);
  color: var(--color-primary);
  font-weight: 700;
  letter-spacing: 1px;
}
.at-menu-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-button);
  min-width: 44px;
  min-height: 44px;
  transition: var(--transition);
}
.at-menu-btn:focus {
  box-shadow: 0 0 0 2px var(--color-primary-dark);
}
.at-menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,27,51,0.25);
  animation: fade-in 0.25s;
  z-index: 100;
  display: flex;
  justify-content: flex-end;
}
.at-menu {
  background: var(--color-neutral-100);
  width: 260px;
  height: 100%;
  box-shadow: var(--shadow-card);
  padding: var(--space-lg) var(--space-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.at-menu-close {
  align-self: flex-end;
  background: none;
  border: none;
  font-size: var(--font-size-xl);
  color: var(--color-primary-dark);
  cursor: pointer;
  min-width: 44px;
  min-height: 44px;
}
.at-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}
.at-menu a {
  color: var(--color-primary-dark);
  text-decoration: none;
  font-size: var(--font-size-md);
  font-family: 'Inter', sans-serif;
  transition: color var(--transition);
}
.at-menu a:hover {
  color: var(--color-primary);
}
.at-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: var(--space-lg) var(--space-md);
  background: var(--color-secondary);
}
.at-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-md);
  background: var(--color-neutral-100);
  color: var(--color-primary-dark);
  font-size: var(--font-size-sm);
  box-shadow: var(--shadow-card);
  text-align: center;
}
.at-version {
  opacity: 0.7;
  font-size: var(--font-size-xs);
}
@media (min-width: 768px) {
  .at-footer {
    flex-direction: row;
    justify-content: center;
    gap: var(--space-md);
  }
}
</style>
