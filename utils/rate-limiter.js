class RateLimiter {
  constructor(maxTokens, refillRate, refillSeconds) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRate = refillRate;
    this.refillSeconds = refillSeconds;

    setInterval(this.refillTokens.bind(this), this.refillSeconds * 1000);
  }

  refillTokens() {
    this.tokens = Math.min(this.tokens + this.refillRate, this.maxTokens);
  }

  tryConsumeToken() {
    if (this.tokens > 0) {
      this.tokens -= 1;
      return true;
    } else {
      return false;
    }
  }
}

module.exports = RateLimiter;
