# TwitterApp

Monolith boilerplate for Twitter type social network app

## Architecture

| Services    | Container | Stack                  | Ports |
| ----------- | --------- | ---------------------- | ----- |
| DB          | redis     | Redis stack            | 6379  |
| Archive     | postgres  | Postgres               | 5432  |
| Queue       | rabbitmq  | RabbitMQ               | 5672  |
| API service | api       | TS, NestJS, Http, REST | 8080  |
| Web client  | web       | TS, React, Tailwind    | 3000  |

- while microservices may be more convenient for such an application, a monolith is an intentional simplification
- for a real world scenario you definitely need an easily sharded nosql db instead of rdbms
- this app is designed to be optimized for reading performance

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

## App

`USER`
- Redis Graph: users with subscriptions & blocks since `subs of my subs` querying
  User ->(follows)-> User
  User ->(blocks)-> User
- Postgres: UserDetails{id,bio,email,password}

`Status`
- Redis hash, RediSearch: recents(1m)
  FT.CREATE statusIdx ON HASH PREFIX 1 status: SCHEMA text TEXT WEIGHT 5.0
  FT.SEARCH statusIdx "hello world" LIMIT 0 10
- Postgres: older 1m

`Reports`
- Postgres

`Analytics`




User ->(posts)-> Status
User ->(liked)-> Status

Status ->(reposts)-> Status
Status ->(reply)-> Status
Status ->(liked)-> User
Status ->(mentions)-> User
Status ->(tags)-> User


### Features

- **CACHE + DB**

  - `USER:id`(many-reads, http-cache, _USER:ID({id,us,nm,img,ts,tss,tfr,tfg}), DELETEDUSERS(uid)_)

    - user data are splitted by frequency of use
      - cache layer is many-reads-writes: USER:ID({id,us,nm,img,ts,tss,tfr,tfg})
      - db layer is used only for auth, user mutations and seldom queries: UserDetails{id,bio,email,password}

  - `STATUS:id`(many-reads, slow-writes, _STATUS:ID({id,txt,ass,uid,sid?,ts,tlk,trp,trl}), STATUSES:USER:UID(sid), STATUSES:TAG:TAG(sid), REPLIES:SID(sid), REPOSTS:SID(sid)_

    - statuses are splitted by relevance(statuses are very related to current events, we only need a fast\*reads for the recent ones)
      - cache layer: all new statuses
      - db layer: statuses older than 30d are removed from cache and archived to the cold db with batch inserts
        - writing to db at first lacks in terms of performance: enlarges creation time, separates inserts, includes deleted during 30d statuses
        - read will go to cache at first and to cold db as an fallback
    - fanout updates
      - new status needs to be propagated to followers feeds and if user have too many followers it could be an issue
      - to handle it we use async queue with fanout updates. Every queue task will update feed for the next 1000 followers
      - most users have less than 1k followers and will get updates at one task

- **CACHE ONLY**(temp/many-reads-writes)

  - `FIREHOSE`(temp, _FIREHOSE(uid)_)

  - `TRENDS`(=100, temp(24h), _LASTTAGS(tag), TRENDS(tag)_)

    - store all tags in _lasttags_ sset with timestamp
    - store all tags in _trends_ sset with count of usage
    - every hour
      - drop all tags in _lasttags_ older than 24h
      - update _trends_ according with _lasttags_
    - get trends by score

  - `RECOMMENDATIONS:uid`(<1000, temp, many-writes, http-cache, _RECOMMENDATIONS:UID(uid)_)

    1. users I watch/liked/reposted/replied the most that are not on my blocklist
    2. top 50 recommendations of user I have started following that are not on my blocklist

    - based on my activity and the activity of my following
    - most likely all these recommendations will be mutual followings and this is ok
    - the more i active the more recommendations i have

  - `FOLLOWERS|FOLLOWING:uid`(many-reads, http-cache, _FOLLOWERS:UID(uid), FOLLOWING:UID(uid)_)
  - `BLOCKLIST:uid`(many-reads, _BLOCKLIST:UID(uid)_)



  - `LIKES:uid|sid`(many-reads-writes, _LIKES:USER:UID(sid), LIKES:STATUS:SID(uid)_)

 

  - `FEED:uid`(<1000, temp, many-reads-writes, _FEED:UID(statusevent)_)

    - following activity
      - reposts/replies/likes of my following
      - top statuses of following feeds
    - _with every new statuses only first 1k followers get feeds updates, the rest are processed async by rabbitmq_

  - `NOTIFICATIONS:uid`(<1000, temp, many-reads-writes, _NOTIFICATIONS:UID(statusevent)_)

    - me related activity
      - my @mentions
      - reposts/replies/likes of my statuses

- **DB ONLY**(few-reads-writes, non-client-app)

  - `REPORTS`(few-reads-writes, admin-only, _REPORT({id,iud,sid?,reason,createdAt})_)

### Api

- **monitoring**

- **auth**

  - create(email,password)
    - if (hget())
    - if (zscore(deletedusers, uid)) && zrem('deletedusers', auid)`
      - ? zrem(deleted, uid)
  - findAll
  - findOne
  - delete

- **users**

  - #[users]

    - create({ username,email,name })
      - `if (hget(`USERSLOOKUP`, username) || hget(`USERSLOOKUP`, email)) return 409` _username or email in use_
      - `id = incr(`USER:ID`)`
      - `pp.hset(`USERSLOOKUP`, ...{username:id,email:id,:id:password:password})`
      - `pp.hset(`USER:ID`, ...{id,username,name,bio,img,email,totalFollowers:0,totalFollowing:0,totalStatuses:0,createdAt})`
      - `pp.hgetall(`USER:ID`)`
      - `return entriesToObject(pp.execute()[-1])`
    - findAll(auid, { limit,order,cursor })
      - `pp.zcard(`RECOMMENDATIONS:AUID`)`
      - `pp.zrange(`RECOMMENDATIONS:AUID`, cursor -1 REV! BYSCORE LIMIT 0 limit)`
      - `[total, ...uids] = pp.execute()`
      - `items = for uid in uids: this.findOne(auid,uid,true)`
      - `return { total, items }`
    - findOne(auid, uid, silent?)
      - `if (!exists(`USER:AUID`)) return silent ? null : 404` _no user_
      - `user = entriesToObject(hgetall(`USER:AUID`))`
      - `if (uid !== auid)`
        - `delete user.email`
        - `pp.zscore(`BLOCKLIST:AUID`, uid)`
        - `pp.zscore(`FOLLOWING:AUID`, uid)`
        - `pp.zintercard(2 following:auid following:uid)`
        - `[blocked, followed, totalInterFollowing] = pp.execute()`
        - `user.relation = {blocked,followed,totalInterFollowing}`
      - `if (!silent)`
        - `if (!(pp.zscore(`FOLLOWING:AUID`, uid)))`
          - `if (!pp.zscore(`BLOCKLIST:AUID`, uid))`
            - `if (pp.zscore(`RECOMMENDATIONS:AUID`, uid))`
              - ? `pp.zincrby(`RECOMMENDATIONS:AUID`, uid, 1)`
              - : `pp.zadd(`RECOMMENDATIONS:AUID`, uid, 1)`
            - `pp.zremrangebyrank(`RECOMMENDATIONS:AUID`, 0, 1000)`
        - `pp.execute()`
      - `return user`
    - update(auid, { password, ...data })
      - `if (!exists(`USER:AUID`)) return 404` _no user_
      - `user = hgetall(`USER:ID`)`
      - `if (data.username)`
        - `if (hget(`USERSLOOKUP`, data.username)) return 409` _username in use_
        - `pp.hrem(`USERSLOOKUP`, user.username)`
        - `pp.hset(`USERSLOOKUP`, data.username, auid)`
      - `if (data.email)`
        - `if (hget(`USERSLOOKUP`, data.email)) return 409` _email in use_
        - `pp.hrem(`USERSLOOKUP`, user.email)`
        - `pp.hset(`USERSLOOKUP`, data.email, auid)`
      - `if (password)`
        - `pp.hrem(`USERSLOOKUP`, auid:password)`
        - `pp.hset(`USERSLOOKUP`, auid:password, password)`
      - `pp.hset(`USER:AUID`, ...data)`
      - `pp.execute()`
      - `return {...user,data}`
    - delete(auid)
      - `if (!exists(`USER:AUID`)) return 404` _no user_
      - `zadd(`DELETEDUSERS`, auid, timestamp)`
      - `return null`

  - #[subscriptions]

    - create({ auid,uid })
      - `if (!exists(`USER:UID`)) return 409` _no such user_
      - `if (zscore(`DELETEDUSERS`)) return 409` _deleted user_
      - `if (zscore(`FOLLOWING:AUID`, uid)) return 409` _already sub_
      - `pp.zadd(`FOLLOWING:AUID`, uid, timestamp)`
      - `pp.zadd(`FOLLOWERS:UID`, auid, timestamp)`
      - `pp.hincrby(`USER:AUID`, totalFollowing, 1)`
      - `pp.hincrby(`USER:UID`, totalFollowers, 1)`
      - ##drop*from*recommendations##
      - `if (pp.zscore(`RECOMMENDATIONS:AUID`, uid)`
        - `pp.zrem(`RECOMMENDATIONS:AUID`, uid)`
      - ##drop*from*blocklist##
      - `if (pp.zscore(`BLOCKLIST:AUID`, uid)`
        - `pp.zrem(`BLOCKLIST:AUID`, uid)`
      - ##get*following*statuses##
      - `pp.zrevrange(`STATUSES:USER:UID`, 0, 100, withscores)
      - `statuses = pp.execute()[-1]`
      - `pp.zadd(`FEED:AUID`, ...statuses)`
      - `pp.zremrangebyrank(`FEED:AUID`, 0, 1000)`
      - `pp.execute()`
      - ##get*top*recommendations*of*following##
      - `uids = zrange(`RECOMMENDATIONS:AUID`, cursor -1 REV BYSCORE LIMIT 0 50)`
      - `for uid in uids`
        - `if (!(pp.zscore(`FOLLOWING:AUID`, uid)))`
          - `if (!pp.zscore(`BLOCKLIST:AUID`, uid))`
            - `if (pp.zscore(`RECOMMENDATIONS:AUID`, uid))`
              - ? `pp.zincrby(`RECOMMENDATIONS:AUID`, uid, 1)`
              - : `pp.zadd(`RECOMMENDATIONS:AUID`, uid, 1)`
            - `pp.zremrangebyrank(`RECOMMENDATIONS:AUID`, 0, 1000)`
      - `pp.execute()`
      - `user = [users].findOne(auid,uid,true)`
      - `return user`
    - findAll(auid, { uid,variant,limit,order,cursor })
      - `key = variant === 'FOLLOWERS' ? `FOLLOWERS:UID`:`FOLLOWING:UID``
      - `pp.zcard(key)`
      - `pp.zrange(key, cursor -1 REV? BYSCORE LIMIT 0 limit)`
      - `[total, ...uids] = pp.execute()`
      - `items = for uid in sids [users].findOne(auid,uid,true)`
      - `return { total, items }`
    - delete(auid, uid)
      - `if (!zscore(`FOLLOWING:AUID`, uid)) return 404` _no sub_
      - `pp.zrem(`FOLLOWING:AUID`, uid)`
      - `pp.zrem(`FOLLOWERS:UID`, auid)`
      - `pp.hincrby(`USER:AUID`, totalFollowing, -1)`
      - `pp.hincrby(`USER:UID`, totalFollowers, -1)`
      - `pp.zrevrange(`STATUSES:USER:UID`, 0, 100)`
      - `statuses = pp.execute()[-1]`
      - `pp.zrem(`FEED:AUID`, ...statuses)`
      - `return null`

  - #[blocks]

    - create({ auid, uid })
      - `if (!exists(`USER:UID`)) return 409` _no such user_
      - `if (zscore(`DELETEDUSERS`)) return 409` _deleted user_
      - `if (zscore(`BLOCKLIST:AUID`, uid)) return 409` _already blocked_
      - `zadd(`BLOCKLIST:AUID`, uid, timestamp)`
      - `user = [users].findOne(auid, uid)`
      - `return user`
    - findAll(auid, { limit,order,cursor })
      - `pp.zcard(`BLOCKLIST:AUID`)`
      - `pp.zrange(`BLOCKLIST:AUID`, cursor -1 REV? BYSCORE LIMIT 0 limit`
      - `[total, ...uids] = pp.execute()`
      - `items = for uid in uids: [users].findOne(auid,uid,true)`
      - `return { total, items }`
      <!-- - findOne(auid,uid)
      - `createdAt = zscore(`BLOCKLIST:AUID`, uid)`
      - `if (!createdAt) return 404`
      - `user = [users].findOne(auid, uid, true)`
      - `return { user, createdAt }` -->
    - delete(auid, uid)
      - `if (!zscore(`BLOCKLIST:AUID`, uid)) return 404` _no block_
      - `zrem(`BLOCKLIST:AUID`, uid)`
      - `return null`

  - #[reports]
    - create(auid, { uid, sid?, reason? })
      - `if (!exists(`USER:UID`)) return 409` _no such user_
      - `if (sid && !(exists(`STATUS:SID`))) return 409` _no such status_
      - `db.create(`REPORTS`, reason, sid, uid)`
      - return {user,status,reason,createdAt:timestamp}

- **statuses**

  - [statuses]

    - _findRelation_()
    - create(auid, data:{sid, text, assets})
      - `id = incr('status:id:')`
      - `pp.hmset(`STATUS:ID`, ...{id,uid,sid,text,assets,createdAt,totalLikes:0,totalRetweets:0,totalReplies:0})`
      - `pp.hincrby(`USER:AUID`, 'totalStatuses', 1)`
      - `pp.zadd(`STATUSES:USER:AUID`, id, createdAt)`
      - ##repost/reply##
      - `if (sid)`
        - `if (text || assets)`
          - ? `pp.hincrby(`STATUS:SID`, 'totalReplies', 1)`
          - ? `pp.zadd(`REPLIES:SID`, id, timestamp)`
          - : `pp.hincrby(`STATUS:SID`, 'totalReposts', 1)`
          - : `pp.zadd(`REPOSTS:SID`, id, timestamp)`
        - ##recommed-author-of-origin-status##
        -
        - `if (!(pp.zscore(`FOLLOWING:AUID`, uid)))`
          - `if (!pp.zscore(`BLOCKLIST:AUID`, uid))`
            - `if (pp.zscore(`RECOMMENDATIONS:AUID`, uid))`
              - ? `pp.zincrby(`RECOMMENDATIONS:AUID`, uid, 1)`
              - : `pp.zadd(`RECOMMENDATIONS:AUID`, uid, 1)`
            - `pp.zremrangebyrank(`RECOMMENDATIONS:AUID`, 0, 1000)`
      - ##tags##
      - `for #tag in text`
        - `pp.zadd(`STATUSES:TAG:TAG`, id, createdAt)`
        - `pp.zadd(`LASTTAGS`, tag, createdAt)`
        - `if (pp.zscore(`TRENDS`, tag))`
          - ? `pp.hincrby(`TRENDS`, tag, 1)`
          - : `pp.zadd('`TRENDS`, tag, 1)`
      - ##mentions##
      - `for @mention in text`
        - =>>>>>>>>>>>>>> notifications
      - ##followers-feeds##
      - `subs`
      - `pp.execute()`
      - `pp.publish('streaming:status:', JSON.stringify(status))`
      - `return this.findOne(auid, id, true)`
    - findAll(auid,uid?,sid?,tag?,limit,order,cursor)
      uid || sid ||tag || trended
    - findOne(auid, sid, silent?)
      //first lookup go to redis the second to postgres
      - `if (!exists(`STATUS:SID`)) return silent ? null : 404`
      - `status = entriesToObject(hgetall(`STATUS:SID`))`
      - `status.author = [users].findOne(auid, status.uid, true)`
      - `if (status.sid) status.status = this.findOne(auid, status.sid, true)`
      - `pp.zscore(`LIKES:STATUS:SID`, auid)`
      - `pp.zscore(`REPOSTS:SID`, auid)`
      - `[liked, reposted] = pp.execute()`
      - `status.relation = {liked,reposted}`
      - `return status`
    - delete(auid, sid)
      - `if (!exists(`STATUS:SID`)) return 404`
      - `uid = hget(`STATUS:SID`, uid)`
      - `if (uid !== auid) return 403`
      - `pp.delete(`STATUS:SID`)`
      - `pp.hincrby(`USER:AUID`, 'totalStatuses', -1)`
      - `pp.zrem(`STATUSES:AUID`, sid)`
      - `remove sid from feeds`
      - `pp.publish('streaming:status:del', JSON.stringify(status))`
      - `pp.execute()`
      - `return null`

  - #[likes]

    - create(auid, sid)
      - `if (!(exists(`STATUS:SID`))) return 409`
      - `pp.zadd(`LIKES:USER:AUID`, sid, timestamp)`
      - `pp.zadd(`LIKES:STATUS:SID`, auid, timestamp)`
      - `pp.hincrby(`STATUS:SID`, totalLikes, 1)`
      - `pp.execute()`
      - `user=[users].findOne(auid,auid)`
      - `status=[status].findOne(auid,sid,true)`
      - `if (!(pp.zscore(`FOLLOWING:AUID`, status.author.id)))`
        - `if (!pp.zscore(`BLOCKLIST:AUID`, status.author.id))`
          - `if (pp.zscore(`RECOMMENDATIONS:AUID`, status.author.id))`
            - ? `pp.zincrby(`RECOMMENDATIONS:AUID`, status.author.id, 1)`
            - : `pp.zadd(`RECOMMENDATIONS:AUID`, status.author.id, 1)`
          - `pp.zremrangebyrank(`RECOMMENDATIONS:AUID`, 0, 1000)`
      - `pp.execute()`
      - =>>>>>>>>>>>>>> notifications
      - `return {user,status}`
    - findAll(auid, { uid?,sid?,limit,order,cursor })
      - `if (uid && !sid)`
        - `pp.zcard(`LIKES:USER:UID`)`
        - `pp.zrange(`LIKES:USER:UID`, cursor -1 REV? BYSCORE LIMIT 0 limit`
        - `[total, ...sids] = pp.execute()`
        - `items = for sid in sids [statuses].findOne(auid,sid)`
      - `if (sid && !uid)`
        - `pp.zcard(`LIKES:STATUS:SID`)`
        - `pp.zrange(`LIKES:STATUS:SID`, cursor -1 REV? BYSCORE LIMIT 0 limit`
        - `[total, ...uids] = pp.execute()`
        - `items = for uid in uids [users].findOne(auid,uid)`
      - `if (sid && uid)`
        - `count = 0; items = [this.findOne(auid,{uid,sid},true)]`
      - `else count = 0; items = []`
      - `return { total, items }`
      <!-- - findOne(auid, { uid, sid }, silent)
      - `if (!zscore(`LIKES:STATUS:SID`, uid) return silent ? null : 404`
      - `user=[users].findOne(auid,uid)`
      - `status=[statuses].findOne(auid,sid)`
      - `return {user,status}` -->
    - delete(auid, sid)
      - `if (!(exists(`STATUS:SID`))) return 404`
      - `pp.zrem(`LIKES:USER:AUID`, sid)`
      - `pp.zrem(`LIKES:STATUS:SID`, auid)`
      - `pp.execute()`
      - `return null`

  - #[trends]

    - _trendsMapping(arr: unknown[])_
      - const results = []
      - for (let i = 0; i < arr.length; i += 2)
        - result.push({ tag: arr[i], count: arr[i + 1] })
      - return result
    - findAll({ limit,order,cursor })
      - `pp.zcard(`TRENDS`)`
      - `pp.zrange(`TRENDS`, cursor -1 REV BYSCORE LIMIT 0 limit WITHSCORES)`
      - `[total, ...items] = pp.execute()`
      - `return { total, items: this.trendsMapping(items) }`

  - [feeds] _following activity: likes/reposts/replies_

    - create()
      - avoid in blocklist:uid

  - [notifications] _me related activity: mentions, likes/reposts/replies_
    - create(sse(from load), no interval)
      - avoid in blocklist:uid
        {status,user,type: like|mention}

- **firehose**

  sse statusEvent stream is filtered by SampleFilter, MentionFilter, TrackFilter

### TODO

- Rabbit
  - schedulling(rabbitmq-delayed-message-exchange):
    - every day statuses older than 30d go to cold db with bulk inserts
    - every day user hard deleting
      - `userstodelete = zrange(`DELETEDUSERS`, now, -1 REV BYSCORE)`
      - `for uid in userstodelete pp.hrem(`USER:UID`)`
      - ...rest zrem
      - pg version: SELECT # FROM users WHERE deletedAt > NOW() - interval '3 month'
    - every hour trends filter:
      - `pp.zremrangebyscore(`LASTTAGS`, '-inf', now - dayinsec)//cut older than 24h`
      - `pp.zinterscore(`TRENDS`, 2, lasttags, trends)//only lasttags in trends`
      <!-- - `pp.zremrangebyrank(`TRENDS`, 0, 100)` -->
    - scheduled statuses
      - `[statuses].create(auid,data)`
- Monitoring
  - Termius custom health indicators for redis, rabbit
  - Prometheus redis & rabbitmq stats
- Redis

  - geospatial - statuses/trends localization
  - [analitics with Redis TimeSeries](https://www.infoq.com/articles/redis-time-series-grafana-real-time-analytics/)
  - the text and assets(media links) fields of the Status entity combined can easily contain more than 500 chars
    - the idea is to consider the text field as an asset and store them out of redis
    - maybe blob/clob service
    - client will download text the same way it downloads the assets per Status(loading=lazy optimisation)

<!-- StatusEvent{type:'posting'|'repost'|'reply' |'like'|'mention'|'RECOMMENDATIONS', from:Partial<User>, status:Partial<Status>}
FeedEvent{status:Status,extra?:'liked/following by :Follower' }
feed:uid
Notification{status:Partial<Status>,event?:{type: 'like/repost/reply/mention', from: Partial<User>}}
notifications:uid -->


<!-- const redis = new Redis();
redis.defineCommand(`CLMAN_INITSESS`, { lua: "return {KEYS[1]}" });
redis.CLMAN_INITSESS(1, "hi", console.log); // printed null [ 'hi' ]
redis.call('set', 'foo', 'bar') or redis.call(['set', 'foo', 'bar'])
https://github.com/redis/redis-om-node -->