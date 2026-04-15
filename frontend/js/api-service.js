class APIService {
  constructor(baseURL) {
    this.baseURL = baseURL || (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) || 'http://localhost:8000/api';
    this.storageKey = 'nyaySetuMockData';
    this.mockDb = this.#loadMockDb();
  }

  #loadMockDb() {
    const existing = localStorage.getItem(this.storageKey);
    if (existing) return JSON.parse(existing);
    const seed = {
      users: [{ id: 1, role: 'citizen', name: 'Rahul Kumar', email: 'citizen@nyaysetu.test', phone: '9876543210' }],
      firs: [
        { id: 'FIR-2026-0001', title: 'Vehicle theft', status: 'Under Investigation', priority: 'High', citizenId: 1, station: 'PS Gomti Nagar', createdAt: '2026-04-01', updates: ['Complaint registered', 'Assigned to officer'] },
        { id: 'FIR-2026-0002', title: 'Cyber fraud', status: 'Filed', priority: 'Medium', citizenId: 1, station: 'PS Hazratganj', createdAt: '2026-04-04', updates: ['Complaint registered'] }
      ],
      officers: [
        { id: 'OFF-101', name: 'Inspector Meena', station: 'PS Gomti Nagar', rank: 'Inspector' },
        { id: 'OFF-102', name: 'SI Arjun', station: 'PS Hazratganj', rank: 'Sub Inspector' }
      ],
      stations: [],
      complaints: [],
      activityLogs: [{ at: new Date().toISOString(), action: 'System initialized' }]
    };
    localStorage.setItem(this.storageKey, JSON.stringify(seed));
    return seed;
  }

  #persist() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.mockDb));
  }

  async request(method, endpoint, payload = null) {
    const safeEndpoint = FormValidator.sanitize(endpoint || '');
    await new Promise((r) => setTimeout(r, 200));
    return { success: true, method, endpoint: safeEndpoint, data: payload };
  }

  async login(credentials) {
    const role = credentials.role || 'citizen';
    const user = {
      id: Date.now(),
      role,
      name: FormValidator.sanitize(credentials.name || credentials.email || 'Demo User'),
      email: FormValidator.sanitize(credentials.email || 'demo@nyaysetu.test')
    };
    return { token: `mock-token-${Date.now()}`, user };
  }

  async register(payload) {
    const user = {
      id: Date.now(),
      role: 'citizen',
      name: FormValidator.sanitize(payload.fullName),
      email: FormValidator.sanitize(payload.email),
      phone: FormValidator.sanitize(payload.phone)
    };
    this.mockDb.users.push(user);
    this.#persist();
    return { success: true, user };
  }

  async forgotPassword(email) { return this.request('POST', '/auth/forgot-password', { email: FormValidator.sanitize(email) }); }
  async resetPassword(payload) { return this.request('POST', '/auth/reset-password', payload); }
  async verifyOTP(payload) { return this.request('POST', '/auth/verify-otp', payload); }

  async submitFIR(payload) {
    const fir = {
      id: `FIR-2026-${String(this.mockDb.firs.length + 1).padStart(4, '0')}`,
      title: FormValidator.sanitize(payload.incidentType || 'General Complaint'),
      status: 'Filed',
      priority: FormValidator.sanitize(payload.priority || 'Medium'),
      citizenId: 1,
      station: FormValidator.sanitize(payload.policeStation || 'Auto Assigned'),
      createdAt: new Date().toISOString().split('T')[0],
      updates: ['Complaint registered successfully']
    };
    this.mockDb.firs.unshift(fir);
    this.#persist();
    return { success: true, fir };
  }

  async getFIRs() { return { success: true, firs: this.mockDb.firs }; }
  async getFIRById(id) { return { success: true, fir: this.mockDb.firs.find((f) => f.id === id) }; }

  async updateFIRStatus(id, status) {
    const fir = this.mockDb.firs.find((f) => f.id === id);
    if (!fir) return { success: false, message: 'FIR not found' };
    fir.status = FormValidator.sanitize(status);
    fir.updates.push(`Status updated to ${fir.status}`);
    this.#persist();
    return { success: true, fir };
  }

  async getStations() { return { success: true, stations: this.mockDb.stations }; }
  async createStation(station) {
    const item = { ...station, id: station.stationId || `ST-${Date.now()}` };
    this.mockDb.stations.push(item);
    this.#persist();
    return { success: true, station: item };
  }

  async getOfficers() { return { success: true, officers: this.mockDb.officers }; }
  async assignOfficer(payload) {
    this.mockDb.activityLogs.push({ at: new Date().toISOString(), action: `Officer ${payload.officerId} assigned to ${payload.firId}` });
    this.#persist();
    return { success: true };
  }

  async getComplaints() { return { success: true, complaints: this.mockDb.complaints }; }
  async createComplaint(payload) {
    const c = { id: `CMP-${Date.now()}`, ...payload, status: 'Open' };
    this.mockDb.complaints.push(c);
    this.#persist();
    return { success: true, complaint: c };
  }

  async getActivityLogs() { return { success: true, logs: this.mockDb.activityLogs }; }
}

class AuthManager {
  static setSession({ token, user }) {
    localStorage.setItem('nyay_token', token);
    localStorage.setItem('nyay_user', JSON.stringify(user));
  }

  static getUser() {
    try { return JSON.parse(localStorage.getItem('nyay_user') || 'null'); } catch { return null; }
  }

  static isAuthenticated() { return !!localStorage.getItem('nyay_token'); }

  static requireRole(roles = []) {
    const user = this.getUser();
    if (!user || (roles.length && !roles.includes(user.role))) {
      window.location.href = '/login.html';
      return false;
    }
    return true;
  }

  static logout() {
    localStorage.removeItem('nyay_token');
    localStorage.removeItem('nyay_user');
    window.location.href = '/login.html';
  }
}

class UIUtils {
  static toast(message, type = 'success') {
    const wrap = document.getElementById('toastWrap') || document.body.appendChild(Object.assign(document.createElement('div'), { id: 'toastWrap', className: 'toast-wrap' }));
    const toast = document.createElement('div');
    toast.className = `toast-item toast-${type}`;
    toast.textContent = message;
    wrap.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
  }

  static openModal(id) { const m = document.getElementById(id); if (m) m.classList.add('show-modal'); }
  static closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('show-modal'); }

  static bindModalClose() {
    document.querySelectorAll('[data-close-modal]').forEach((btn) => btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-close-modal');
      if (target) UIUtils.closeModal(target);
    }));
  }
}

class FormValidator {
  static sanitize(value) {
    return String(value || '').replace(/[<>"'`]/g, '').trim();
  }

  static validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.sanitize(value));
  }

  static validatePhone(value) {
    return /^\d{10}$/.test(this.sanitize(value));
  }

  static validatePassword(value) {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(value || '');
  }

  static csrfReady(form) {
    if (!form.querySelector('input[name="csrf_token"]')) {
      const token = document.createElement('input');
      token.type = 'hidden';
      token.name = 'csrf_token';
      token.value = 'csrf-placeholder-token';
      form.appendChild(token);
    }
  }
}

class SessionManager {
  constructor(timeoutMinutes = 30, warningMinutes = 5) {
    this.timeoutMs = timeoutMinutes * 60 * 1000;
    this.warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;
    this.warningTimer = null;
    this.expireTimer = null;
    this.reset = this.reset.bind(this);
  }

  start() {
    ['click', 'keydown', 'mousemove', 'scroll', 'touchstart'].forEach((event) => window.addEventListener(event, this.reset, { passive: true }));
    this.reset();
  }

  reset() {
    clearTimeout(this.warningTimer);
    clearTimeout(this.expireTimer);
    this.warningTimer = setTimeout(() => UIUtils.toast('Session will expire soon due to inactivity.', 'warning'), this.warningMs);
    this.expireTimer = setTimeout(() => {
      UIUtils.toast('Session expired. Please login again.', 'danger');
      AuthManager.logout();
    }, this.timeoutMs);
  }
}

window.apiService = new APIService(window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL);
window.AuthManager = AuthManager;
window.UIUtils = UIUtils;
window.FormValidator = FormValidator;
window.SessionManager = SessionManager;

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form').forEach((form) => FormValidator.csrfReady(form));
  UIUtils.bindModalClose();
});
