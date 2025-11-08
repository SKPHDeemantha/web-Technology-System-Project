/* assets/js/app.js
   Global application utilities, API client (with mock fallback), storage helpers,
   event bus, notifications, component loader, and common UI utilities.
   Frontend-only and safe to run without a backend.
*/
(() => {
  'use strict';

  // Configuration
  const Config = {
    APP_NAME: 'University Web App',
    API_BASE_URL: '', // Set your backend API base URL if available
    REQUEST_TIMEOUT: 10000, // ms
    POLL_INTERVAL_MS: 15000, // for mock "real-time" updates
    USE_MOCK:
      !location.origin ||
      location.protocol === 'file:' ||
      !location.hostname ||
      !window.fetch ||
      !('AbortController' in window),
    STORAGE_KEYS: {
      TOKEN: 'auth.token',
      USER: 'auth.user',
      THEME: 'theme',
      CSRF: 'csrf.token',
      MOCK_DB: 'mock.db',
    },
  };

  // Safe storage wrapper (handles JSON and exceptions)
  const Storage = {
    get(key, fallback = null) {
      try {
        const v = localStorage.getItem(key);
        return v === null ? fallback : v;
      } catch {
        return fallback;
      }
    },
    set(key, value) {
      try {
        localStorage.setItem(key, value);
      } catch {
        /* ignore */
      }
    },
    remove(key) {
      try {
        localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    },
    getJSON(key, fallback = null) {
      try {
        const v = Storage.get(key, null);
        return v ? JSON.parse(v) : fallback;
      } catch {
        return fallback;
      }
    },
    setJSON(key, obj) {
      try {
        Storage.set(key, JSON.stringify(obj));
      } catch {
        /* ignore */
      }
    },
  };

  // Utilities
  const Utils = {
    uid(prefix = 'id') {
      if (window.crypto && crypto.getRandomValues) {
        const buf = new Uint32Array(1);
        crypto.getRandomValues(buf);
        return `${prefix}_${buf[0].toString(16)}_${Date.now().toString(36)}`;
      }
      return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(36)}`;
    },
    debounce(fn, wait = 300) {
      let t = null;
      return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn.apply(null, args), wait);
      };
    },
    escapeHTML(str = '') {
      return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    },
    toQueryString(params = {}) {
      const s = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') s.append(k, v);
      });
      return s.toString();
    },
    formatDateTime(ts) {
      const d = ts instanceof Date ? ts : new Date(ts);
      return d.toLocaleString();
    },
    isJSONResponse(resp) {
      const ct = resp.headers.get('content-type') || '';
      return ct.includes('application/json');
    },
    sleep(ms = 0) {
      return new Promise((res) => setTimeout(res, ms));
    },
  };

  // Event Bus (Pub/Sub)
  const Events = (() => {
    const map = new Map(); // event -> handlers[]
    return {
      on(event, handler) {
        if (!map.has(event)) map.set(event, []);
        map.get(event).push(handler);
        return () => this.off(event, handler);
      },
      off(event, handler) {
        const arr = map.get(event) || [];
        const next = arr.filter((h) => h !== handler);
        map.set(event, next);
      },
      emit(event, payload) {
        const arr = map.get(event) || [];
        arr.forEach((h) => {
          try {
            h(payload);
          } catch (e) {
            console.error('Event handler error', e);
          }
        });
      },
    };
  })();

  // Toast notifications
  const Toast = (() => {
    let root = null;
    const ensureRoot = () => {
      if (!root) {
        root = document.createElement('div');
        root.id = 'toast-root';
        root.style.position = 'fixed';
        root.style.top = '16px';
        root.style.right = '16px';
        root.style.zIndex = '9999';
        root.style.display = 'flex';
        root.style.flexDirection = 'column';
        root.style.gap = '8px';
        document.body.appendChild(root);
      }
    };
    const show = (message, type = 'info', duration = 3500) => {
      ensureRoot();
      const toast = document.createElement('div');
      toast.setAttribute('role', 'status');
      toast.style.padding = '10px 14px';
      toast.style.borderRadius = '8px';
      toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
      toast.style.color = '#fff';
      toast.style.fontWeight = '600';
      toast.style.maxWidth = '320px';
      toast.style.wordBreak = 'break-word';
      toast.style.backdropFilter = 'blur(4px)';
      toast.style.transition = 'transform .2s ease, opacity .2s ease';
      toast.style.transform = 'translateY(-6px)';
      toast.style.opacity = '0.98';
      const colors = {
        info: '#6a0dad',
        success: '#2e7d32',
        warning: '#f9a825',
        error: '#c62828',
      };
      toast.style.background = colors[type] || colors.info;
      toast.textContent = message;
      root.appendChild(toast);
      requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
        toast.style.opacity = '1';
      });
      const t = setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-6px)';
        setTimeout(() => toast.remove(), 200);
      }, duration);
      toast.addEventListener('click', () => {
        clearTimeout(t);
        toast.remove();
      });
    };
    return {
      info: (m, d) => show(m, 'info', d),
      success: (m, d) => show(m, 'success', d),
      warning: (m, d) => show(m, 'warning', d),
      error: (m, d) => show(m, 'error', d),
      show,
    };
  })();

  // Browser notification helper (falls back to toasts)
  const Notifier = {
    async notify(title, options = {}) {
      try {
        if (!('Notification' in window)) {
          Toast.info(`${title}${options.body ? ' - ' + options.body : ''}`);
          return;
        }
        if (Notification.permission === 'granted') {
          new Notification(title, options);
        } else if (Notification.permission !== 'denied') {
          const perm = await Notification.requestPermission();
          if (perm === 'granted') new Notification(title, options);
          else Toast.info(`${title}${options.body ? ' - ' + options.body : ''}`);
        } else {
          Toast.info(`${title}${options.body ? ' - ' + options.body : ''}`);
        }
      } catch {
        Toast.info(`${title}${options.body ? ' - ' + options.body : ''}`);
      }
    },
  };

  // Theme helper
  const Theme = {
    get() {
      return Storage.get(Config.STORAGE_KEYS.THEME, 'light');
    },
    set(mode) {
      const isDark = mode === 'dark';
      document.body.classList.toggle('dark-mode', isDark);
      Storage.set(Config.STORAGE_KEYS.THEME, isDark ? 'dark' : 'light');
      Events.emit('theme:change', isDark ? 'dark' : 'light');
    },
    toggle() {
      this.set(this.get() === 'dark' ? 'light' : 'dark');
    },
    init() {
      this.set(this.get());
    },
  };

  // HTTP client wrapper (for real API)
  const Http = (() => {
    const withTimeout = (promise, ms) => {
      const controller = new AbortController();
      const t = setTimeout(() => controller.abort(), ms);
      return {
        exec: async () => {
          try {
            const resp = await promise(controller.signal);
            return resp;
          } finally {
            clearTimeout(t);
          }
        },
        controller,
      };
    };

    const request = async (path, { method = 'GET', params = null, body = null, headers = {}, raw = false } = {}) => {
      if (Config.USE_MOCK) {
        throw new Error('Http.request called in mock mode. Use App.api.* instead.');
      }
      const qs = params ? `?${Utils.toQueryString(params)}` : '';
      const url = `${Config.API_BASE_URL}${path}${qs}`;
      const token = Auth.getToken();
      const defaultHeaders = {};
      if (token) defaultHeaders['Authorization'] = `Bearer ${token}`;
      if (body && !(body instanceof FormData)) {
        defaultHeaders['Content-Type'] = 'application/json';
      }
      const fetchOptions = {
        method,
        headers: Object.assign({}, defaultHeaders, headers),
        signal: undefined,
      };
      if (body) fetchOptions.body = body instanceof FormData ? body : JSON.stringify(body);

      const runner = withTimeout((signal) => fetch(url, Object.assign({ signal }, fetchOptions)), Config.REQUEST_TIMEOUT);
      const resp = await runner.exec();
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        const err = new Error(`HTTP ${resp.status} ${resp.statusText}`);
        err.status = resp.status;
        err.body = Utils.isJSONResponse(resp) ? await resp.json().catch(() => text) : text;
        throw err;
      }
      if (raw) return resp;
      if (Utils.isJSONResponse(resp)) return resp.json();
      return resp.text();
    };

    return {
      get: (p, opts = {}) => request(p, Object.assign({ method: 'GET' }, opts)),
      post: (p, body, opts = {}) => request(p, Object.assign({ method: 'POST', body }, opts)),
      put: (p, body, opts = {}) => request(p, Object.assign({ method: 'PUT', body }, opts)),
      del: (p, opts = {}) => request(p, Object.assign({ method: 'DELETE' }, opts)),
      raw: (p, opts = {}) => request(p, Object.assign({ raw: true }, opts)),
    };
  })();

  // Basic Auth manager (works with mock)
  const Auth = (() => {
    const getToken = () => Storage.get(Config.STORAGE_KEYS.TOKEN, null);
    const setToken = (t) => (t ? Storage.set(Config.STORAGE_KEYS.TOKEN, t) : Storage.remove(Config.STORAGE_KEYS.TOKEN));

    const getUser = () => Storage.getJSON(Config.STORAGE_KEYS.USER, null);
    const setUser = (u) => (u ? Storage.setJSON(Config.STORAGE_KEYS.USER, u) : Storage.remove(Config.STORAGE_KEYS.USER));

    const logout = () => {
      setToken(null);
      setUser(null);
      Events.emit('auth:logout');
    };

    return {
      getToken,
      setToken,
      getUser,
      setUser,
      logout,
    };
  })();

  // Mock database and API (simple in-memory persisted to localStorage)
  const MockDB = (() => {
    const defaultState = {
      users: [
        // lecturers
        { id: 'lec_1', name: 'Dr. Alice Benson', email: 'alice@uni.edu', role: 'lecturer', password: 'password', department: 'CS' },
        // students
        { id: 'stu_1', name: 'John Doe', email: 'john.1@uni.edu', role: 'student', year: 1, password: 'password' },
        { id: 'stu_2', name: 'Jane Smith', email: 'jane.2@uni.edu', role: 'student', year: 2, password: 'password' },
      ],
      announcements: [
        {
          id: 'ann_1',
          title: 'Welcome to Semester',
          body: 'Semester starts Monday. Check your timetable.',
          authorId: 'lec_1',
          scope: 'all',
          createdAt: new Date().toISOString(),
        },
      ],
      timetables: [
        {
          id: 'tt_1',
          title: 'CS101 - Introduction to Programming',
          lecturerId: 'lec_1',
          year: 1,
          day: 'Monday',
          time: '09:00 - 11:00',
          location: 'Room A1',
        },
      ],
      materials: [],
    };

    const load = () => {
      const s = Storage.getJSON(Config.STORAGE_KEYS.MOCK_DB, null);
      if (s) return s;
      Storage.setJSON(Config.STORAGE_KEYS.MOCK_DB, defaultState);
      return defaultState;
    };

    const save = (state) => {
      Storage.setJSON(Config.STORAGE_KEYS.MOCK_DB, state);
    };

    let state = load();

    // Helpers
    const find = (collection, predicate) => (state[collection] || []).filter(predicate);
    const getById = (collection, id) => (state[collection] || []).find((r) => r.id === id);
    const add = (collection, obj) => {
      const item = Object.assign({ id: Utils.uid(collection) }, obj);
      state[collection] = state[collection] || [];
      state[collection].push(item);
      save(state);
      return item;
    };
    const update = (collection, id, patch) => {
      state[collection] = state[collection] || [];
      const idx = state[collection].findIndex((r) => r.id === id);
      if (idx === -1) return null;
      state[collection][idx] = Object.assign({}, state[collection][idx], patch);
      save(state);
      return state[collection][idx];
    };
    const remove = (collection, id) => {
      state[collection] = state[collection] || [];
      const idx = state[collection].findIndex((r) => r.id === id);
      if (idx === -1) return false;
      state[collection].splice(idx, 1);
      save(state);
      return true;
    };

    return {
      state,
      find,
      getById,
      add,
      update,
      remove,
      reset() {
        state = defaultState;
        save(state);
      },
      dump() {
        return JSON.parse(JSON.stringify(state));
      },
    };
  })();

  // Application API (wraps real HTTP or mock)
  const Api = (() => {
    // When using mock, simulate latency and events
    const simulate = async (fn, ms = 300) => {
      if (!Config.USE_MOCK) return fn();
      await Utils.sleep(ms + Math.random() * 200);
      return fn();
    };

    // Authentication (mock)
    const authLogin = async ({ email, password }) => {
      if (!Config.USE_MOCK) {
        // Attempt real API
        return Http.post('/auth/login', { email, password });
      }
      return simulate(() => {
        const u = MockDB.state.users.find((x) => x.email === email && x.password === password);
        if (!u) {
          const e = new Error('Invalid credentials');
          e.status = 401;
          throw e;
        }
        const token = 'mock-token-' + Utils.uid('tok');
        const user = Object.assign({}, u);
        delete user.password;
        // persist token & user
        Auth.setToken(token);
        Auth.setUser(user);
        Events.emit('auth:login', user);
        return { token, user };
      }, 300);
    };

    const authLogout = async () => {
      if (!Config.USE_MOCK) {
        await Http.post('/auth/logout');
      }
      Auth.logout();
      return { ok: true };
    };

    // Announcements
    const getAnnouncements = async (params = {}) =>
      simulate(() => {
        const items = MockDB.state.announcements.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        if (params.year) {
          // if scope filtering needed in real app
          return items.filter((x) => x.scope === 'all' || x.scope === `year:${params.year}`);
        }
        return items;
      }, 200);

    const createAnnouncement = async (payload) =>
      simulate(() => {
        const ann = MockDB.add('announcements', Object.assign({ createdAt: new Date().toISOString() }, payload));
        Events.emit('announcements:created', ann);
        Notifier.notify('New announcement', { body: ann.title });
        return ann;
      }, 200);

    // Timetables
    const getTimetables = async (params = {}) =>
      simulate(() => {
        const t = MockDB.state.timetables.slice();
        if (params.year) return t.filter((x) => Number(x.year) === Number(params.year));
        return t;
      }, 200);

    const createTimetable = async (payload) =>
      simulate(() => {
        const tt = MockDB.add('timetables', payload);
        Events.emit('timetables:created', tt);
        return tt;
      }, 200);

    // Users (list)
    const getUsers = async (params = {}) =>
      simulate(() => {
        const u = MockDB.state.users.slice();
        if (params.role) return u.filter((x) => x.role === params.role);
        return u.map((x) => {
          const copy = Object.assign({}, x);
          delete copy.password;
          return copy;
        });
      }, 200);

    // Provide a fallback for any unimplemented endpoints
    return {
      auth: { login: authLogin, logout: authLogout },
      announcements: { list: getAnnouncements, create: createAnnouncement },
      timetables: { list: getTimetables, create: createTimetable },
      users: { list: getUsers },
      // expose mockDB for dev convenience
      _mock: Config.USE_MOCK ? MockDB : null,
    };
  })();

  // Component loader (simple)
  const Loader = {
    show(target = document.body) {
      let el = document.getElementById('global-loader');
      if (!el) {
        el = document.createElement('div');
        el.id = 'global-loader';
        el.style.position = 'fixed';
        el.style.inset = '0';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.background = 'rgba(0,0,0,0.3)';
        el.style.zIndex = '9998';
        el.innerHTML = `<div style="padding:18px;border-radius:12px;background:rgba(255,255,255,0.95);box-shadow:0 8px 24px rgba(0,0,0,0.2);font-weight:700">Loading…</div>`;
        document.body.appendChild(el);
      }
      el.style.display = 'flex';
    },
    hide() {
      const el = document.getElementById('global-loader');
      if (el) el.style.display = 'none';
    },
  };

  // Simple DOM helpers for small UI demos
  const DOM = {
    mountAnnouncements(container) {
      if (!container) return;
      Loader.show();
      Api.announcements
        .list()
        .then((items) => {
          container.innerHTML = '';
          if (!items || items.length === 0) {
            container.innerHTML = '<div class="empty">No announcements</div>';
            return;
          }
          items.forEach((a) => {
            const card = document.createElement('div');
            card.className = 'announcement-card';
            card.style.padding = '12px';
            card.style.borderRadius = '8px';
            card.style.marginBottom = '10px';
            card.style.background = 'linear-gradient(180deg,#0b0710, #150920)';
            card.style.color = '#fff';
            card.innerHTML = `<strong style="display:block">${Utils.escapeHTML(a.title)}</strong>
                              <div style="font-size:13px;margin-top:6px">${Utils.escapeHTML(a.body)}</div>
                              <div style="font-size:11px;margin-top:8px;opacity:.8">${Utils.formatDateTime(a.createdAt)}</div>`;
            container.appendChild(card);
          });
        })
        .catch((e) => {
          console.error(e);
          Toast.error('Failed to load announcements');
        })
        .finally(() => Loader.hide());
    },
    mountTimetable(container, year = 1) {
      if (!container) return;
      Loader.show();
      Api.timetables
        .list({ year })
        .then((items) => {
          container.innerHTML = '';
          if (!items || items.length === 0) {
            container.innerHTML = '<div class="empty">No timetable entries</div>';
            return;
          }
          const ul = document.createElement('div');
          items.forEach((tt) => {
            const el = document.createElement('div');
            el.style.padding = '10px';
            el.style.borderRadius = '8px';
            el.style.marginBottom = '8px';
            el.style.background = '#0f0620';
            el.style.color = '#fff';
            el.innerHTML = `<div style="font-weight:700">${Utils.escapeHTML(tt.title)}</div>
                            <div style="font-size:13px;margin-top:6px">${Utils.escapeHTML(tt.day)} • ${Utils.escapeHTML(tt.time)} • ${Utils.escapeHTML(tt.location)}</div>`;
            ul.appendChild(el);
          });
          container.appendChild(ul);
        })
        .catch((e) => {
          console.error(e);
          Toast.error('Failed to load timetable');
        })
        .finally(() => Loader.hide());
    },
  };

  // Application bootstrap & public API
  const App = {
    Config,
    Utils,
    Events,
    Toast,
    Notifier,
    Theme,
    Auth,
    Api,
    Loader,
    DOM,
    init() {
      document.title = Config.APP_NAME;
      Theme.init();

      // quick keyboard shortcut: t = toggle theme
      window.addEventListener('keydown', (ev) => {
        if ((ev.key === 't' || ev.key === 'T') && (ev.metaKey || ev.ctrlKey)) {
          ev.preventDefault();
          Theme.toggle();
          Toast.info(`Theme switched to ${Theme.get()}`);
        }
      });

      // If using mock, start a poller that may add random "server" announcements to simulate realtime
      if (Config.USE_MOCK) {
        setInterval(() => {
          // occasionally create a simulated announcement
          if (Math.random() < 0.12) {
            const lec = MockDB.state.users.find((u) => u.role === 'lecturer') || MockDB.state.users[0];
            MockDB.add('announcements', {
              title: 'Auto Notice',
              body: `Automated update ${new Date().toLocaleTimeString()}`,
              authorId: lec ? lec.id : 'system',
              scope: 'all',
              createdAt: new Date().toISOString(),
            });
            Events.emit('announcements:updated');
          }
        }, Config.POLL_INTERVAL_MS);
      }

      // forward events for UI convenience
      Events.on('announcements:created', () => {
        Toast.success('Announcement posted');
        Events.emit('announcements:updated');
      });

      // global error handler (optional)
      window.addEventListener('unhandledrejection', (ev) => {
        console.error('Promise rejection', ev.reason);
      });
    },
  };

  // Auto-init when DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
  } else {
    App.init();
  }

  // Expose App to window for debugging and usage by other scripts
  window.App = App;
})();
