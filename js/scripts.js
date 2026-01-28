/**
 * Data e Hora - Main JavaScript
 * Handles clock updates, theme switching, and holiday calculations
 */

/**
 * Theme Management
 * Initializes theme based on user preference before page renders
 */
(function initializeTheme() {
    const saved = localStorage.getItem('theme-pref') || 'default';
    let isDark = false;
    
    if (saved === 'default') {
        isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    } else if (saved === 'auto') {
        const h = new Date().getHours();
        isDark = (h < 6 || h >= 18);
    } else {
        isDark = (saved === 'dark');
    }
    
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    document.documentElement.style.backgroundColor = isDark ? '#020617' : '#f1f5f9';
})();

/**
 * Get current date/time locked to Brasília timezone
 * Ensures consistency regardless of user's system timezone
 * @returns {Date} Date object in Brasília timezone
 */
function getBrasiliaDate() {
    const now = new Date();
    // Convert Date to string in Brasília timezone and create new Date from it
    return new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
}

/**
 * Update clock display with current Brasília time
 * Updates every second and handles auto-theme switching
 */
function updateClock() {
    const nowBrasilia = getBrasiliaDate();
    
    // Format time forcing Brasília timezone
    const timeStr = nowBrasilia.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit',
        hour12: false
    });
    
    const dateStr = nowBrasilia.toLocaleDateString('pt-BR', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    });
    
    document.getElementById('clock').textContent = timeStr;
    document.getElementById('date').textContent = dateStr;

    // Auto-theme switching every minute if in auto mode
    if (nowBrasilia.getSeconds() === 0) {
        const saved = localStorage.getItem('theme-pref') || 'default';
        if (saved === 'auto') {
            const h = nowBrasilia.getHours();
            const isDark = (h < 6 || h >= 18);
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        }
    }
}

/**
 * Calculate and display the next Brazilian holiday
 * Updates the holiday section with countdown and details
 */
function updateHoliday() {
    const nowBrasilia = getBrasiliaDate();
    const year = nowBrasilia.getFullYear();
    
    // Fixed Brazilian holidays (JavaScript months are 0-indexed: 0=Jan, 11=Dec)
    const feriados = [
        { n: "Ano Novo", d: new Date(year, 0, 1) },
        { n: "Carnaval", d: new Date(year, 1, 17) },
        { n: "Sexta-feira Santa", d: new Date(year, 3, 3) },
        { n: "Tiradentes", d: new Date(year, 3, 21) },
        { n: "Dia do Trabalho", d: new Date(year, 4, 1) },
        { n: "Corpus Christi", d: new Date(year, 5, 4) },
        { n: "Independência", d: new Date(year, 8, 7) },
        { n: "Nossa Sra. Aparecida", d: new Date(year, 9, 12) },
        { n: "Finados", d: new Date(year, 10, 2) },
        { n: "Proclamação da República", d: new Date(year, 10, 15) },
        { n: "Consciência Negra", d: new Date(year, 10, 20) },
        { n: "Natal", d: new Date(year, 11, 25) },
        { n: "Ano Novo", d: new Date(year + 1, 0, 1) }
    ];

    // Find next holiday after current Brasília date
    const proximo = feriados.find(f => f.d > nowBrasilia);
    
    // Calculate remaining days based on Brasília time
    const diff = Math.ceil((proximo.d - nowBrasilia) / 864e5);
    
    const fmtDia = new Intl.DateTimeFormat('pt-BR', { 
        weekday: 'long', 
        timeZone: 'America/Sao_Paulo' 
    }).format(proximo.d);
    
    const fmtData = new Intl.DateTimeFormat('pt-BR', { 
        day: 'numeric', 
        month: 'long', 
        timeZone: 'America/Sao_Paulo' 
    }).format(proximo.d);
    
    const prep = (proximo.d.getDay() === 0 || proximo.d.getDay() === 6) ? "no" : "numa";

    document.getElementById('holiday-display').innerHTML = 
        `O próximo feriado é <strong>${proximo.n}</strong>, que cai ${prep} <strong>${fmtDia}</strong>, dia <strong>${fmtData}</strong>. Faltam <strong>${diff} dias</strong>.`;
}

/**
 * Initialize application on DOM ready
 * Sets up clock and holiday updates
 */
document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    updateHoliday();
    setInterval(updateClock, 1000);
});
