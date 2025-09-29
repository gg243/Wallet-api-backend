import { Redis } from '@upstash/redis'

const redis = new Redis({
  redis: Redis.fromEnv(),
  limiter: Ratelimiter.slidingWindow(10, '60s'),    
})

await redis.set("foo", "bar");
await redis.get("foo");


