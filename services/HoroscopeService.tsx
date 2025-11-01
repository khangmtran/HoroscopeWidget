import axios from "axios";

class HoroscopeService {
  private static BACKEND_URL = "https://horoscope-backend-dwnh.onrender.com";

  private static stripDate(raw: string): string {
    if (!raw) return raw;

    const dashIndex = raw.indexOf("-");
    if (dashIndex !== -1) {
      return raw.substring(dashIndex + 1).trim();
    }
    return raw;
  }

  static async fetchDailyHoroscope(
    dob: string = "2025-01-20",
    topic: string = "general"
  ): Promise<string> {
    try {
      const response = await axios.post(`${this.BACKEND_URL}/api/horoscope`, {
        dob,
        topic,
      });

      const raw = response.data.data.horoscope || "";
      const horoscopeOnly = this.stripDate(raw);
      return horoscopeOnly || "No data found";
    } catch (error) {
      if (__DEV__) {
        console.error(`Failed to fetch topic ${topic}:`, error);
      }
      throw new Error(`Failed to load topic ${topic}`);
    }
  }
}

export default HoroscopeService;
