// Polyfill localStorage for SSR to prevent errors
if (typeof window === 'undefined' && typeof global !== 'undefined') {
  const storage = {};
  
  global.localStorage = {
    getItem: function(key) {
      return storage[key] || null;
    },
    setItem: function(key, value) {
      storage[key] = String(value);
    },
    removeItem: function(key) {
      delete storage[key];
    },
    clear: function() {
      Object.keys(storage).forEach(key => delete storage[key]);
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function(index) {
      const keys = Object.keys(storage);
      return keys[index] || null;
    }
  };
  
  // Also add to globalThis for Node.js 12+
  if (typeof globalThis !== 'undefined') {
    globalThis.localStorage = global.localStorage;
  }
}

