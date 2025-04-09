import { createClient } from 'redis';
import InMemoryStore from '../utils/inMemoryStore.js';
import EventEmitter from 'events';

class RedisService extends EventEmitter {
  constructor() {
    super();
    this.client = null;
    this.fallbackStore = new InMemoryStore();
    this.isUsingFallback = false;
    this.isConnecting = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 5000;
    
    this.init();
  }
  
  async init() {
    if (this.client || this.isConnecting) return;
    
    this.isConnecting = true;
    
    try {
      // Check if we're in demo mode (missing REDIS config)
      if (!process.env.REDIS_HOST || !process.env.REDIS_PASSWORD) {
        console.log('Redis credentials not found, using in-memory fallback for demo mode');
        this.isUsingFallback = true;
        this.isConnecting = false;
        this.emit('fallback', true);
        return;
      }
      
      this.client = createClient({
        username: process.env.REDIS_USERNAME || 'default',
        password: process.env.REDIS_PASSWORD,
        socket: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT || '16434')
        }
      });
      
      this.client.on('error', (err) => {
        console.error('Redis client error:', err);
        this.emit('error', err);
        
        if (!this.isUsingFallback) {
          console.log('Switching to in-memory fallback');
          this.isUsingFallback = true;
          this.emit('fallback', true);
        }
      });
      
      this.client.on('ready', () => {
        console.log('Redis client ready');
        this.isUsingFallback = false;
        this.reconnectAttempts = 0;
        this.emit('ready');
      });
      
      this.client.on('reconnecting', () => {
        console.log('Redis client reconnecting...');
        this.emit('reconnecting');
      });
      
      await this.client.connect();
      console.log('Redis service connected successfully');
      this.isConnecting = false;
      this.emit('connected');
    } catch (error) {
      console.error('Redis connection failed, using in-memory fallback:', error);
      this.isUsingFallback = true;
      this.isConnecting = false;
      this.scheduleReconnect();
      this.emit('fallback', true);
    }
  }
  
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log('Max reconnection attempts reached, staying with fallback');
      return;
    }
    
    this.reconnectAttempts++;
    setTimeout(() => this.init(), this.reconnectDelay);
  }
  
  async get(key) {
    try {
      if (this.client && this.client.isReady) {
        return await this.client.get(key);
      } else {
        return await this.fallbackStore.get(key);
      }
    } catch (error) {
      console.error('Redis get error:', error);
      return await this.fallbackStore.get(key);
    }
  }
  
  async set(key, value, options = {}) {
    try {
      if (this.client && this.client.isReady) {
        return await this.client.set(key, value, options);
      } else {
        return await this.fallbackStore.set(key, value, options);
      }
    } catch (error) {
      console.error('Redis set error:', error);
      return await this.fallbackStore.set(key, value, options);
    }
  }
  
  async lPush(key, value) {
    try {
      if (this.client && this.client.isReady) {
        return await this.client.lPush(key, value);
      } else {
        return await this.fallbackStore.lPush(key, value);
      }
    } catch (error) {
      console.error('Redis lPush error:', error);
      return await this.fallbackStore.lPush(key, value);
    }
  }
  
  async lRange(key, start, end) {
    try {
      if (this.client && this.client.isReady) {
        return await this.client.lRange(key, start, end);
      } else {
        return await this.fallbackStore.lRange(key, start, end);
      }
    } catch (error) {
      console.error('Redis lRange error:', error);
      return await this.fallbackStore.lRange(key, start, end);
    }
  }
  
  async lTrim(key, start, end) {
    try {
      if (this.client && this.client.isReady) {
        return await this.client.lTrim(key, start, end);
      } else {
        return await this.fallbackStore.lTrim(key, start, end);
      }
    } catch (error) {
      console.error('Redis lTrim error:', error);
      return await this.fallbackStore.lTrim(key, start, end);
    }
  }
  
  async del(key) {
    try {
      if (this.client && this.client.isReady) {
        return await this.client.del(key);
      } else {
        return await this.fallbackStore.del(key);
      }
    } catch (error) {
      console.error('Redis del error:', error);
      return await this.fallbackStore.del(key);
    }
  }
  
  async keys(pattern) {
    try {
      if (this.client && this.client.isReady) {
        return await this.client.keys(pattern);
      } else {
        return await this.fallbackStore.keys(pattern);
      }
    } catch (error) {
      console.error('Redis keys error:', error);
      return await this.fallbackStore.keys(pattern);
    }
  }
  
  isReady() {
    return this.client && this.client.isReady;
  }
  
  async quit() {
    if (this.client && this.client.isReady) {
      await this.client.quit();
    }
  }
}

// Export as singleton
const redisService = new RedisService();
export default redisService;