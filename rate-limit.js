import { LRUCache } from 'lru-cache';

export default function rateLimit({ interval, uniqueTokenPerInterval, limit }) {
  const tokenCache = new LRUCache({
    max: uniqueTokenPerInterval,
    ttl: interval,
  });

  return {
    check: (res, token) =>
      new Promise((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) || 0) + 1;
        
        tokenCache.set(token, tokenCount);
        
        if (tokenCount > limit) {
          reject();
        } else {
          resolve();
        }
      }),
  };
}
