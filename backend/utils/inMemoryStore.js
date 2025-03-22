class InMemoryStore {
  constructor() {
    this.data = {};
    this.expiry = {};
    this.lists = {};
    console.log('In-memory store initialized');
  }

  async get(key) {
    // Check expiry
    if (this.expiry[key] && Date.now() > this.expiry[key]) {
      delete this.data[key];
      delete this.expiry[key];
      return null;
    }
    
    return this.data[key] || null;
  }

  async set(key, value, options = {}) {
    this.data[key] = value;
    
    if (options.EX) {
      this.expiry[key] = Date.now() + options.EX * 1000;
    }
    
    return 'OK';
  }

  async lPush(key, value) {
    if (!this.lists[key]) this.lists[key] = [];
    this.lists[key].unshift(value);
    return this.lists[key].length;
  }

  async lRange(key, start, end) {
    if (!this.lists[key]) return [];
    const list = this.lists[key];
    return list.slice(start, end === -1 ? undefined : end + 1);
  }

  async lTrim(key, start, end) {
    if (!this.lists[key]) return 'OK';
    this.lists[key] = this.lists[key].slice(start, end + 1);
    return 'OK';
  }

  async keys(pattern) {
    const regex = new RegExp(pattern.replace('*', '.*'));
    return Object.keys(this.data).filter(key => regex.test(key));
  }

  async del(key) {
    delete this.data[key];
    delete this.expiry[key];
    delete this.lists[key];
    return 1;
  }
}

export default InMemoryStore;