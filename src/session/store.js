import Redis from 'ioredis';
import { Store } from 'koa-session2';
import config from '../../config.json';
import { port, host, password } from '../../config/redis.json';

export default class RedisStore extends Store {
    constructor() {
        super();
        this.redis = new Redis({
          port, host, family: 4, password
        });
    }

    async get(sid) {
        let data = await this.redis.get(`SESSION:${sid}`);
        return JSON.parse(data);
    }

    async set(session, opts) {
        if(!opts.sid) {
            opts.sid = this.getID(24);
        }
        await this.redis.set(`SESSION:${opts.sid}`, JSON.stringify(session), 'EX', config.redis_maxAge);
        return opts.sid;
    }

    async destroy(sid) {
        return await this.redis.del(`SESSION:${sid}`);
    }
}
