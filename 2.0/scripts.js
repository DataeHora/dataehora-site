/* scripts.js - Inteligência Centralizada */

// 1. Garantia do Horário Oficial de Brasília
function getBrasiliaDate() {
    return new Date();
}

// 2. Sistema de Temas (Dark/Light/Auto)
function applyTheme() {
    const saved = localStorage.getItem('theme-pref') || 'default';
    let isDark = false;

    if (saved === 'default') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else if (saved === 'auto') {
        const now = getBrasiliaDate();
        // Get hour in São Paulo timezone
        const h = parseInt(now.toLocaleTimeString('pt-BR', { 
            hour: 'numeric', 
            hour12: false,
            timeZone: 'America/Sao_Paulo' 
        }), 10);
        isDark = (h < 6 || h >= 18);
    } else {
        isDark = (saved === 'dark');
    }

    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
}

// 3. Atualização Universal de Relógios (Se houver na página)
function updateInterface() {
    const clockEl = document.getElementById('clock');
    const dateEl = document.getElementById('date');
    const now = getBrasiliaDate();

    if (clockEl) {
        clockEl.textContent = now.toLocaleTimeString('pt-BR', { 
            hour: '2-digit', minute: '2-digit', second: '2-digit',
            timeZone: 'America/Sao_Paulo'
        });
    }

    if (dateEl) {
        dateEl.textContent = now.toLocaleDateString('pt-BR', { 
            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
            timeZone: 'America/Sao_Paulo'
        });
    }

    // Auto-tema a cada minuto
    const seconds = parseInt(now.toLocaleTimeString('pt-BR', { 
        second: 'numeric',
        timeZone: 'America/Sao_Paulo'
    }), 10);
    if (seconds === 0) applyTheme();
}

// 4. Inicialização de todas as páginas do Sitemap
document.addEventListener('DOMContentLoaded', () => {
    applyTheme();
    
    // Inicia relógio se os IDs existirem
    if (document.getElementById('clock')) {
        updateInterface();
        setInterval(updateInterface, 1000);
    }

    // Lógica específica para a página de Feriados (se estiver nela)
    if (document.getElementById('holiday-display')) {
        // A função de feriados que criamos anteriormente entraria aqui
    }
});