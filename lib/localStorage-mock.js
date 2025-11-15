// Mock localStorage for SSR
const storage = {};

const localStorageMock = {
  getItem: function(key) {
    return storage[key] || null;
  },
  setItem: function(key, value) {
    storage[key] = value.toString();
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

module.exports = localStorageMock;

