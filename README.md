# Twitter

Monolith boilerplate for Twitter type social network app

## Architecture

| Services    | Container | Stack                  | Ports |
| ----------- | --------- | ---------------------- | ----- |
| DB          | redis     | Redis                  | 6379  |
| Queue       | rabbitmq  | RabbitMQ               | 5672  |
| API service | api       | TS, NestJS, Http, REST | 8080  |
| Web client  | web       | TS, React, Tailwind    | 3000  |

## Run the project

### Setup

1. Fork/Clone this repo

1. Download [Docker](https://docs.docker.com/desktop/mac/install/) (if necessary)

### Build and Run the App

1. Set the Environment variables in .env.dev

1. Fire up the Containers

   ```sh
   make network
   make dev-check
   make dev
   ```

### Production

1. Set the Environment variables in .env

1. Run the containers:

   ```sh
   make network
   make prod-build
   make prod
   ```

- **monitoring**
- **auth**
  - create(email,password)
    - if (hget())
    - if (zscore(deletedusers, uid)) && zrem('deletedusers', auid)`
      - ? zrem(deleted, uid)
  - findAll
  - findOne
  - delete
- **admin**
  `admins uid^createdAt`
  strikes:user:uid
  strikes:status:sid
- **users**

  - [users]

    - _findRelation(uid,subuid)_
      - `pp.zscore('blacklist:uid', subuid)`
      - `pp.zscore('following:uid', subuid)`
      - `pp.zintercard(2 following:uid following:subuid)`
      - `[banned, followed, totalInterFollowing] = pp.execute()`
      - `return {banned,followed,totalInterFollowing}`
    - create(username,email,name)

      - `if (hget(userslookup, username) || hget(userslookup, email)) return 409`
      - `id = incr('user:id')`
      - `pp.hset('userslookup', ...{username:id,email:id,idpassword:password})`
      - `pp.hset('user:id', ...{id,username,name,bio,img,email,totalFollowers:0,totalFollowing:0,totalStatuses:0,createdAt})`

      - `pp.hgetall('user:id')`
      - `return entriesToObject(pp.execute()[3])`

    - findAll(auid,limit,order,cursor)
      - add followings of my followings && not in blacklist
      - `pp.zcard('RECOMMEND:auid')`
      - `pp.zrange('RECOMMEND:auid', cursor -1 REV! BYSCORE LIMIT 0 limit)`
      - `[total, ...uids] = pp.execute()`
      - `items = for uid in uids: this.findOne(auid,uid,true)` // filter(None, pp.execute())
      - `return { total, items }`
    - findOne(auid,uid,silent?)
      - `if (!exists('user:uid')) return silent ? null : 404`
      - `user = entriesToObject(hgetall('user:uid'))`
      - `if (uid !== auid)`
        - `delete user.email`
        - `user.relation = this.findRelation(auid, uid)`
      - `return user`
    - update(auid, data)
      - `user = this.findOne(auid, auid)`
      - `hset('user:auid', ...data)`
      - `return {...user,data}`
    - delete(auid)
      - `if (!exists('user:auid')) return 404`
      - `zadd('deletedusers', auid, timestamp)`
      - `return true`

  - [subscriptions]
    - create(auid, uid)
      - `if (zscore(`FOLLOWING:AUID`, uid)) return 409`
      - `pp.zadd(`FOLLOWING:AUID`, uid, timestamp)`
      - `pp.zadd(`FOLLOWERS:UID`, auid, timestamp)`
      - `pp.hincrby(`USER:AUID`, totalFollowing, 1)`
      - `pp.hincrby(`USER:UID`, totalFollowers, 1)`
      - `if (pp.zscore(`RECOMMEND:AUID`, uid)`
        - `pp.zrem(`RECOMMEND:AUID`, uid)`
      - `pp.execute()`
      - `user = [users].findOne(auid,uid,true)`
      - `return user`
      <!-- - pipeline.zremrangebyrank('home:%s'%uid, 0, -HOME_TIMELINE_SIZE-1) -->
    - findAll
    - findOne
    - delete

  - [bans]
    - create(auid, uid)
      - `if (zscore('blacklist:auid', uid)) return 409`
      - `user = [users].findOne(auid, uid)`
      - `zadd('blacklist:auid', uid, createdAt)`
      - `return { user, createdAt }`
    - findAll(auid,limit,order,cursor)
      - `pp.zcard('blacklist:auid')`
      - `pp.zrange('blacklist:auid', cursor -1 REV? BYSCORE LIMIT 0 limit`
      - `[total, ...uids] = pp.execute()`
      - `items = for uid in uids: [users].findOne(auid,uid,true)`
      - `{ total, items: filter(None,items) }`
    - findOne(auid,uid)
      - `createdAt = zscore('blacklist:auid', uid)`
      - `if (!createdAt) return 404`
      - `user = [users].findOne(auid, uid, true)`
      - `return { user, createdAt }`
    - delete(auid,uid)
      - `if (!zscore('blacklist:auid', uid)) return 404`
      - `zrem('blacklist:auid', uid)`
      - `return true`

- **statuses**
  - [statuses]
    - _findRelation_()
    - create(auid, data:{sid, text, media})
      - `id = incr('status:id:')`
      - `pp.hmset(`STATUS:ID`, ...{id,uid,sid,text,media,createdAt,totalLikes:0,totalRetweets:0,totalReplies:0})`
      - `pp.hincrby(`USER:AUID`, 'totalStatuses', 1)`
      - `pp.zadd(`STATUSES:USER:AUID`, id, createdAt)`
      - `if (sid)`
        - `if (text || media)`
          - ? `pp.hincrby(`STATUS:SID`, 'totalReplies', 1)`
          - : `pp.hincrby(`STATUS:SID`, 'totalRetweets', 1)`
          - : `pp.zadd(`REPOSTS:SID`, id, createdAt)`
      - `for #hash in text`
        - `pp.zadd(`STATUSES:HASH:HASH`, id, createdAt)`
        - `pp.zadd(`LASTHASHES`, hash, createdAt)`
        - `if (pp.zscore(`TRENDS`, hash))`
          - ? `pp.hincrby(`TRENDS`, hash, 1)`
          - : `pp.zadd('`TRENDS`, hash, 1)`
      - `if (@mention in text)`
        - =>>>>>>>>>>>>>> notifications    
      - `subs`
      - `pp.execute()`
      - `return this.findOne(auid, id, true)`
    - findAll(auid,uid?,sid?,hash?,limit,order,cursor)
        uid || sid ||hash || trended
    - findOne(auid, sid, silent?)
      - `if (!exists(`STATUS:SID`)) return silent ? null : 404`
      - `status = entriesToObject(hgetall(`STATUS:SID`))`
      - `status.author = [users].findOne(auid, status.uid, true)`
      - `if (status.sid) status.status = this.findOne(auid, status.sid, true)`
      - `pp.zscore(`LIKES:SID`, auid)`
      - `pp.zscore(`REPOSTS:SID`, auid)`
      - `if (!(pp.zscore(`FOLLOWING:AUID`, status.uid)))`
        - `if (pp.zscore(`RECOMMEND:AUID`, status.uid))`
          - ? `pp.zincrby(`RECOMMEND:AUID`, status.uid, 1)`
          - : `pp.zadd(`RECOMMEND:AUID`, status.uid, 1)`
      - `[liked, reposted] = pp.execute()`
      - `status.relation = {liked,reposted}`
      - `return status`
    - delete(auid, sid)
      - `if (!exists(`STATUS:SID`)) return 404`
      - `uid = hget(`STATUS:SID`, uid)`
      - `if (uid !== auid) return 403`
      - `pp.hrem(`STATUS:SID`)`
      - `pp.hincrby(`USER:AUID`, 'totalStatuses', -1)`
      - `pp.zrem(`STATUSES:AUID`, sid)`
      - `pp.execute()`
      - `return true`
  - [trends]
    - findAll(limit,order,cursor)
      - `pp.zcard(`TRENDS`)`
      - `pp.zrange(`TRENDS`, cursor -1 REV BYSCORE LIMIT 0 limit WITHSCORES)`
      - `[total, ...items] = pp.execute()`
      - `{ total, items: trendsMapping(items) }`
  - [strikes]
    - create(auid, uid, sid, reason?)
      - `if (uid && !(exists(`USER:UID`))) return 409`
      - `if (sid && !(exists(`STATUS:SID`))) return 409`
      - `zadd('strikes', reason, sid)`
    - findAll(uid,sid,limit,order,cursor)
      - `pp.zcard('strikes:sid')`
      - `pp.zrange('likes:sid', cursor -1 REV? BYSCORE LIMIT 0 limit`
      - `[total, ...items] = pp.execute()`
      - `for id in items: pp.hgetall('status|user:id')`
      - `{ total, items: filter(None, pp.execute()) }`
  - [likes]
    - create(auid, sid)
      - `if (!(exists(`STATUS:SID`))) return 409`
      - `pp.zadd(`LIKES:AUID`, sid, timestamp)`
      - `pp.zadd(`LIKES:SID`, auid, timestamp)`
      - `pp.execute()`
    - findAll(auid,uid?,sid?,limit,order,cursor)
      - `pp.zcard('likes:uid|sid')`
      - `pp.zrange('likes:uid|sid', cursor -1 REV? BYSCORE LIMIT 0 limit`
      - `[total, ...items] = pp.execute()`
      - `for id in items: pp.hgetall('status|user:id')`
      - `{ total, items: filter(None, pp.execute()) }`
    - findOne(auid,uid?,sid?)
      - `zscore('likes:sid', uid)`
    - delete(auid, sid?)
      - `pp.zrem('likes:auid', sid)`
      - `pp.zrem('likes:sid', auid)`
      - `pp.execute()`

  - [feeds] _following activity: likes/reposts/replies_
    - create(sse(on home page), interval)
      - avoid in blacklist:uid
  - [notifications] _me related activity: mentions, likes/reposts/replies_
    - create(sse(from load), no interval)
      - avoid in blacklist:uid
        {status,user,type: like|mention}




<!-- statuses -->

- DATA:

  - `feed:uid sid|{uid,sid}^createdAt <1000` following activity
  - `notifications:uid sid(@mention,repost,reply)|{uid,sid}{like)` me related activity

    {sid,uid,type[like|mention|repost|reply]}



## TODO

- Redis geospatial - local statuses at first?
- Rabbit
  - request batching?
  - schedulling(rabbitmq_delayed_message_exchange):
    - user hard deleting(time threshold)
      - pg version: SELECT \* FROM users WHERE deleted_at > NOW() - interval '3 month'
    - striked statusses(count threshold)
    - scheduled statuses
    - every hour trends filter:
      - `pp.zremrangebyscore(`LASTHASHES`, '-inf', now - dayinsec)//cut older than 24h`
      - `pp.zinterscore(`TRENDS`, 2, hashes, trends)//only lasthashes in trends`
- Monitoring
  - Termius custom health indicators for redis, rabbit
  - Prometheus redis stats

```ts
pagination: createdAt=20045455, limit=20
sort: order=ASC|DESC
filters: uid?, sid?

function arrayToObject(arr: unknown[]) {
const entries: unknown[][] = []
for (let i = 0; i < arr.length; i += 2) {
entries.push([arr[i], arr[i + 1]])
}
return Object.fromEntries(entries)
}

function trendsMapping(arr: unknown[]) {
const results = []
for (let i = 0; i < arr.length; i += 2) {
result.push({ hash: arr[i], count: arr[i + 1] })
}
return result
}
```