/**
 * Data e Hora - Main JavaScript
 * Handles clock updates and holiday calculations
 * Note: Theme initialization is handled inline in the HTML head to prevent FOUC
 */

/**
 * Official time offset from API (in milliseconds)
 * Updated periodically from WorldTimeAPI
 */
let officialTimeOffset = 0;
let lastSyncTime = 0;

/**
 * Sync with official time API (WorldTimeAPI for São Paulo)
 * Updates the offset between local system time and official time
 */
async function syncOfficialTime() {
    try {
        const response = await fetch('https://worldtimeapi.org/api/timezone/America/Sao_Paulo');
        const data = await response.json();
        
        // Calculate offset between official time and local time
        const officialTime = new Date(data.datetime);
        const localTime = new Date();
        officialTimeOffset = officialTime - localTime;
        lastSyncTime = Date.now();
        
        console.log('Synced with official São Paulo time');
    } catch (error) {
        console.warn('Failed to sync with official time API, using browser timezone:', error);
        // Fallback: continue using browser time with timezone conversion
        officialTimeOffset = 0;
    }
}

/**
 * Get current date/time adjusted with official time offset
 * Uses official API time when available, falls back to system time
 * @returns {Date} Date object adjusted with official time offset
 */
function getBrasiliaDate() {
    return new Date(Date.now() + officialTimeOffset);
}

/**
 * Reusable date/time formatters for performance
 */
const timeFormatter = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit', 
    second: '2-digit',
    hour12: false,
    timeZone: 'America/Sao_Paulo'
});

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'America/Sao_Paulo'
});

const holidayWeekdayFormatter = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    timeZone: 'America/Sao_Paulo'
});

const holidayDateFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Sao_Paulo'
});

// Additional formatters for timezone-aware component extraction
const hourFormatter = new Intl.DateTimeFormat('pt-BR', {
    hour: 'numeric',
    hour12: false,
    timeZone: 'America/Sao_Paulo'
});

const secondFormatter = new Intl.DateTimeFormat('pt-BR', {
    second: 'numeric',
    timeZone: 'America/Sao_Paulo'
});

const yearFormatter = new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    timeZone: 'America/Sao_Paulo'
});

const dayFormatter = new Intl.DateTimeFormat('pt-BR', {
    day: 'numeric',
    timeZone: 'America/Sao_Paulo'
});

const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
    month: 'numeric',
    timeZone: 'America/Sao_Paulo'
});

/**
 * Update clock display with current Brasília time
 * Updates every second and handles auto-theme switching
 */
function updateClock() {
    const nowBrasilia = getBrasiliaDate();
    
    // Format time and date using pre-created formatters (with timeZone set)
    const timeStr = timeFormatter.format(nowBrasilia);
    const dateStr = dateFormatter.format(nowBrasilia);
    
    document.getElementById('clock').textContent = timeStr;
    document.getElementById('date').textContent = dateStr;

    // Auto-theme switching every minute if in auto mode
    // Use pre-created formatters for timezone-aware component extraction
    const seconds = parseInt(secondFormatter.format(nowBrasilia), 10);
    if (seconds === 0) {
        const saved = localStorage.getItem('theme-pref') || 'default';
        if (saved === 'auto') {
            const h = parseInt(hourFormatter.format(nowBrasilia), 10);
            const isDark = (h < 6 || h >= 18);
            document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
        }
    }
}

/**
 * Calculate and display the next Brazilian holiday
 * Updates the holiday section with countdown and details
 * Uses dynamic calculation for all holidays including moveable ones
 */
function updateHoliday() {
    const nowBrasilia = getBrasiliaDate();
    
    // Get current date components in São Paulo timezone using pre-created formatters
    const year = parseInt(yearFormatter.format(nowBrasilia), 10);
    
    // Get holidays for current and next year
    const currentYearHolidays = getHolidaysForDisplay(year);
    const nextYearHolidays = getHolidaysForDisplay(year + 1);
    const allHolidays = [...currentYearHolidays, ...nextYearHolidays];

    // Get today's date at midnight in São Paulo timezone for comparison
    // Extract date components using pre-created formatters
    const currentDay = parseInt(dayFormatter.format(nowBrasilia), 10);
    const currentMonth = parseInt(monthFormatter.format(nowBrasilia), 10) - 1; // 0-indexed
    const todayInSaoPaulo = new Date(year, currentMonth, currentDay);
    
    // Find next holiday after current São Paulo date
    const proximo = allHolidays.find(f => f.d > todayInSaoPaulo);
    
    // Safety check - should always find a holiday due to next year's holidays
    if (!proximo) {
        document.getElementById('holiday-display').innerHTML = 
            'Não foi possível calcular o próximo feriado.';
        return;
    }
    
    // Calculate remaining days based on São Paulo dates
    const diff = Math.ceil((proximo.d - todayInSaoPaulo) / 864e5);
    
    // Use pre-created formatters for better performance
    const fmtDia = holidayWeekdayFormatter.format(proximo.d);
    const fmtData = holidayDateFormatter.format(proximo.d);
    const prep = (proximo.d.getDay() === 0 || proximo.d.getDay() === 6) ? "no" : "numa";

    document.getElementById('holiday-display').innerHTML = 
        `O próximo feriado é <strong>${proximo.n}</strong> no dia <strong>${fmtData}</strong>, que é em <strong>${diff} dias</strong>.`;
}

/**
 * Initialize application on DOM ready
 * Sets up clock and holiday updates
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Sync with official time API first
    await syncOfficialTime();
    
    // Re-sync every 5 minutes to maintain accuracy
    setInterval(syncOfficialTime, 5 * 60 * 1000);
    
    updateClock();
    updateHoliday();
    setInterval(updateClock, 1000);
});
