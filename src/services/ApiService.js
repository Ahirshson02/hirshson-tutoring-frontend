// Set EXPO_PUBLIC_API_URL at build time (e.g. https://your-api.onrender.com).
const API_BASE_URL = (process.env.EXPO_PUBLIC_API_URL).replace(/\/$/, ''); // || 'http://localhost:8080'
const NETWORK_ERROR = 'Could not reach the server. Please try again.';

async function request(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
    return await res.json(); // { success: true, ... } or { success: false, message }
  } catch (e) {
    return { success: false, message: NETWORK_ERROR };
  }
}

export class ApiService {
  /** @returns {Promise<Array<{day: string, slots: Array<{id, day, time}>}>>} open weekly slots */
  async getAvailabilities() {
    const data = await request('/api/availabilities');
    return data.success ? data.availabilities : [];
  }

  /**
   * @param {{slotId, guardianName, studentName, email, phone?, subject, notes?, wantsRecurring, wantsMultiplePerWeek}} bookingData
   * @returns {Promise<{success: true, booking: object} | {success: false, message: string}>}
   */
  async bookSessions(bookingData) {
    return request('/api/bookings', { method: 'POST', body: JSON.stringify(bookingData) });
  }

  /** No public endpoint by design: view bookings in Supabase (bookings_view). */
  async getBookings() {
    return [];
  }
}

const api = new ApiService();
export default api;
