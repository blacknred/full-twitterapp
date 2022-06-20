import type { ClientOpts, RetryStrategyOptions } from 'redis';
import { RedisClient } from 'redis';
import { parse } from 'url';
import { promisify } from 'util';

/** Redis instance */

export class RedisAdapter extends RedisClient {
  public getAsync: any;
  public setAsync: any;
  public delAsync: any;
  public scanAsync: any;

  private static retryStrategy(opts: RetryStrategyOptions) {
    if (opts.error && opts.error.code === 'ECONNREFUSED') {
      return new Error('The server refused the connection');
    }
    if (opts.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (opts.attempt > 10) {
      return undefined;
    }
    return Math.min(opts.attempt * 100, 3000);
  }

  private static prepareOpts(opts: ClientOpts) {
    opts.retry_strategy = RedisAdapter.retryStrategy;

    if (opts.url) {
      const params = parse(opts.url, true, true);
      opts.host = params.hostname;
      opts.port = +params.port;
      if (params.path) {
        opts.db = params.path.slice(1);
      }
      if (params.auth) {
        const auth = params.auth.split(':');
        opts.password = auth[auth.length - 1];
      }
    }

    return opts;
  }

  constructor(opts: ClientOpts) {
    super(RedisAdapter.prepareOpts(opts));

    this.getAsync = promisify(this.get).bind(this);
    this.setAsync = promisify(this.set).bind(this);
    this.delAsync = promisify(this.del).bind(this);
    this.scanAsync = promisify(this.scan).bind(this);
  }
}
