class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 30000;
    this.failureCount = 0;
    this.isOpen = false;
    this.nextAttempt = Date.now();
  }
  
  async executeWithBreaker(serviceFunction) {
    if (this.isOpen) {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit is open, service unavailable');
      }
      
      // Half-open state
      this.isOpen = false;
    }
    
    try {
      const result = await serviceFunction();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }
  
  onSuccess() {
    this.failureCount = 0;
  }
  
  onFailure() {
    this.failureCount++;
    
    if (this.failureCount >= this.failureThreshold) {
      this.isOpen = true;
      this.nextAttempt = Date.now() + this.resetTimeout;
    }
  }
}

export default CircuitBreaker;

// Example usage
// const redisBreaker = new CircuitBreaker();
// try {
//   const result = await redisBreaker.executeWithBreaker(() => redis.get('some-key'));
// } catch (error) {
//   // Use fallback
// }