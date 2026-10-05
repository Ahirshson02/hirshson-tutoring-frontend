import { WEEKDAYS, SAMPLE_TIMES } from '../data/content';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Hardcoded sample data until the backend exists.
const SAMPLE_AVAILABILITIES = WEEKDAYS.map((day) => ({
  day,
  slots: SAMPLE_TIMES.map((time) => ({ id: `${day}-${time}`, day, time })),
}));

const SAMPLE_BOOKINGS = [];

/**
 * Single place for all server communication.
 * Swap the bodies below for real fetch() calls when the backend is ready.
 */
export class ApiService {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl; // e.g. 'https://api.example.com'
  }

  /** @returns {Promise<Array<{day: string, slots: Array<{id, day, time}>}>>} */
  async getAvailabilities() {
    await delay(250);
    return SAMPLE_AVAILABILITIES; // TODO: GET `${this.baseUrl}/availabilities`
  }

  /** @returns {Promise<Array>} existing bookings */
  async getBookings() {
    await delay(150);
    return SAMPLE_BOOKINGS; // TODO: GET `${this.baseUrl}/bookings`
  }

  /**
   * @param {{slot, guardianName, studentName, subject, notes, wantsRecurring, wantsMultiplePerWeek}} bookingData
   */
  async bookSessions(bookingData) {
    console.log('[ApiService.bookSessions] submitted:', bookingData);
    await delay(600);
    // TODO: POST `${this.baseUrl}/bookings`
    return { success: true, bookingId: `sample-${Date.now()}`, booking: bookingData };
  }
}

const api = new ApiService();
export default api;
