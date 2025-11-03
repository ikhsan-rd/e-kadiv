// SansFormatDate.js

/**
 * Format a timestamp to dd/mm/yy
 * @param {string|null} timestamp - The timestamp to format.
 * @returns {string} - The formatted date string.
 */
export const SansFormatDateFromStamp = (timestamp) =>
{
    if (!timestamp) return ''; // Return empty string if timestamp is null or undefined

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return ''; // Check if date is invalid

    const day = String(date.getDate()).padStart(2,'0');
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year

    return `${day}/${month}/${year}`;
};

/**
 * Format a timestamp to hh:mm | dd/mm/yy
 * @param {string|null} timestamp - The timestamp to format.
 * @returns {string} - The formatted date and time string.
 */
export const SansFormatDateAndTime = (timestamp) =>
{
    if (!timestamp) return ''; // Return empty string if timestamp is null or undefined

    const date = new Date(timestamp);
    if (isNaN(date.getTime())) return ''; // Check if date is invalid

    const day = String(date.getDate()).padStart(2,'0');
    const month = String(date.getMonth() + 1).padStart(2,'0');
    const year = String(date.getFullYear()).slice(-2); // Get last 2 digits of the year
    const hours = String(date.getHours()).padStart(2,'0');
    const minutes = String(date.getMinutes()).padStart(2,'0');

    return `${hours}:${minutes} | ${day}/${month}/${year}`;
};


/**
 * Format a Date object to dd/mm/yy
 * @param {Date|string|null} date - The Date object or date string to format.
 * @returns {string} - The formatted date string.
 */
export const SansFormatDate = (date) =>
{
    if (!date) return ''; // Return empty string if date is null or undefined

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return ''; // Check if date is invalid

    const day = String(dateObj.getDate()).padStart(2,'0');
    const month = String(dateObj.getMonth() + 1).padStart(2,'0');
    const year = String(dateObj.getFullYear());

    return `${day}/${month}/${year}`;
};

/**
 * Format a Date object to hh:mm
 * @param {Date|string|null} time - The Date object or time string to format.
 * @returns {string} - The formatted time string.
 */
export const SansFormatTime = (time) =>
{
    if (!time) return ''; // Return empty string if time is null or undefined

    const timeObj = typeof time === 'string' ? new Date(`1970-01-01T${time}`) : new Date(`1970-01-01T${time.toTimeString().slice(0,5)}`);
    if (!(timeObj instanceof Date) || isNaN(timeObj.getTime())) return ''; // Check if time is invalid

    const hours = String(timeObj.getHours()).padStart(2,'0');
    const minutes = String(timeObj.getMinutes()).padStart(2,'0');

    return `${hours}:${minutes}`;
};


/**
 * Convert a Date object to YYYY-MM-DD format for database submission.
 * @param {Date|string|null} date - The Date object or date string to format.
 * @returns {string} - The formatted date string.
 */
export const SansDateToSend = (date) =>
{
    if (!date) return ''; // Return empty string if date is null or undefined

    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) return ''; // Check if date is invalid

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2,'0');
    const day = String(dateObj.getDate()).padStart(2,'0');

    return `${year}-${month}-${day}`;
};

/**
 * Convert a time string or Date object to HH:MM:SS format for database submission.
 * @param {Date|string|null} time - The Date object or time string to format.
 * @returns {string} - The formatted time string.
 */
export const SansTimeToSend = (time) =>
{
    if (!time) return ''; // Return empty string if time is null or undefined

    const timeObj = typeof time === 'string' ? new Date(`1970-01-01T${time}`) : time;
    if (!(timeObj instanceof Date) || isNaN(timeObj.getTime())) return ''; // Check if time is invalid

    const hours = String(timeObj.getHours()).padStart(2,'0');
    const minutes = String(timeObj.getMinutes()).padStart(2,'0');
    const seconds = String(timeObj.getSeconds()).padStart(2,'0');

    return `${hours}:${minutes}:${seconds}`;
};

export function SansMoneyToSend(numberString) {
    if (typeof numberString !== 'string') {
        numberString = String(numberString);
    }
    return numberString.replace(/\./g, '').replace(',', '.');
}


export function SansFormatMoney(value) {
    if (value == null || value === "") return "0";
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}

/**
 * Convert a date string to the name of the day.
 * @param {string|null} dateString - The date string to convert.
 * @returns {string} - The name of the day or an empty string if input is invalid.
 */
export const SansFormatDateToDay = (dateString) => {
    if (!dateString) return ''; // Return empty string if dateString is null or undefined

    const dateObj = new Date(dateString);
    if (isNaN(dateObj.getTime())) return ''; // Check if date is invalid

    // Array of day names in Indonesian
    const daysOfWeek = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return daysOfWeek[dateObj.getDay()]; // Get the name of the day
};

