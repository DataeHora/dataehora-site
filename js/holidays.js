/**
 * Data e Hora - Holiday Utilities
 * Shared functions for calculating Brazilian holidays including moveable dates
 */

/**
 * Calculate Easter Sunday for a given year using the Computus algorithm
 * @param {number} year - The year to calculate Easter for
 * @returns {Date} Date object for Easter Sunday
 */
function calculateEaster(year) {
    const a = year % 19;
    const b = Math.floor(year / 100);
    const c = year % 100;
    const d = Math.floor(b / 4);
    const e = b % 4;
    const f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3);
    const h = (19 * a + b - d - g + 15) % 30;
    const i = Math.floor(c / 4);
    const k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7;
    const m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31) - 1;
    const day = ((h + l - 7 * m + 114) % 31) + 1;
    
    return new Date(year, month, day);
}

/**
 * Get all Brazilian national holidays for a given year
 * Includes fixed and moveable holidays
 * @param {number} year - The year to get holidays for
 * @returns {Array} Array of holiday objects with {d: day, m: month, n: name, dt: Date object, week: weekday}
 */
function getHolidays(year) {
    // Fixed national holidays
    const holidays = [
        { d: 1, m: 0, n: "Confraternização Universal" },
        { d: 21, m: 3, n: "Tiradentes" },
        { d: 1, m: 4, n: "Dia do Trabalhador" },
        { d: 7, m: 8, n: "Independência do Brasil" },
        { d: 12, m: 9, n: "Nossa Sra. Aparecida" },
        { d: 2, m: 10, n: "Finados" },
        { d: 15, m: 10, n: "Proclamação da República" },
        { d: 20, m: 10, n: "Consciência Negra" },
        { d: 25, m: 11, n: "Natal" }
    ];

    // Calculate Easter and add moveable holidays
    const easter = calculateEaster(year);
    
    const addMoveable = (offset, name) => {
        const date = new Date(easter);
        date.setDate(easter.getDate() + offset);
        holidays.push({ d: date.getDate(), m: date.getMonth(), n: name });
    };

    addMoveable(-47, "Carnaval");
    addMoveable(-2, "Sexta-feira Santa");
    addMoveable(60, "Corpus Christi");

    // Convert to Date objects and add weekday info
    return holidays.map(h => {
        const dt = new Date(year, h.m, h.d);
        dt.setHours(0, 0, 0, 0);
        return { 
            ...h, 
            dt, 
            week: dt.toLocaleDateString('pt-BR', { weekday: 'long' })
        };
    }).sort((a, b) => a.dt - b.dt);
}

/**
 * Get all holidays for display (with simplified names)
 * @param {number} year - The year to get holidays for
 * @returns {Array} Array of holiday objects with short names
 */
function getHolidaysForDisplay(year) {
    const holidays = getHolidays(year);
    
    // Map to simplified names for display
    return holidays.map(h => ({
        n: h.n === "Confraternização Universal" ? "Ano Novo" : h.n,
        d: h.dt
    }));
}
