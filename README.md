# Twitter

Monolith boilerplate for Twitter type social network app

## Architecture

| Services    | Container | Stack                  | Ports |
| ----------- | --------- | ---------------------- | ----- |
| Cache       | redis     | Redis                  | 6379  |
| DB          | postgres* | Postgres               | 5432  |
| Queue       | rabbitmq  | RabbitMQ               | 5672  |
| API service | api       | TS, NestJS, Http, REST | 8080  |
| Web client  | web       | TS, React, Tailwind    | 3000  |

- while microservices may be more convinient for such app, the monolith is an intention simplification
- *for real world scenario you definitely need an easy sharding nosql db

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

### Features

- **CACHE + DB**

  - `USER:id`(many reads, allow http cache)

  - `STATUS:id`(many reads, slow writes)
  
    - write
      - since the statuses are very related to current events, we only need a fast reads for the recent ones
      - write to cache at first
      - statuses older than 30d are removed from cache and writed to the cold db with batch inserts
      - writing to db at first lacks in terms of performance: enlarges creation time, separates inserts, includes deleted during 30d statuses
    - read: will go to cache at first and to cold db as an fallback
    - fanout updates
      - every new status needs to be propagated to followers feeds and if user have too many followers it would be an issue
      - to non blocking the creation process we will split followers updates by 1k and put their feeds updates to async queue
      - most users have less than 1k followers and will get updates at once

  - `LIKES`

  - `REPORTS`(few reads/writes)
    - db only since no reads for the main client app

- **CACHE ONLY**(temp or many reads/writes)

  - `TRENDS`(100, temp(24h))

    - store all tags in _lasttags_ sset with timestamp
    - store all tags in _trends_ sset with count of usage
    - every hour
      - drop all tags in _lasttags_ older than 24h
      - update _trends_ according with _lasttags_
    - get trends by score

  - `RECOMMENDATIONS:uid`(<1000, temp, many writes, allow http cache)

    1. users I watch/liked/reposted/replied the most that are not on my blacklist
    2. top 50 recommendations of user I have started following that are not on my blacklist

    - based on my activity and the activity of my following
    - most likely all these recommendations will be mutual followings and this is ok
    - the more i active the more recommendations i have

  - `FOLLOWERS|FOLLOWING:uid`(many reads, allow http cache)

  - `BLACKLIST:uid`(many reads)

  - `FEED:uid`(<1000, temp, many reads/writes)

    - following activity
      - reposts/replies/likes of my following
      - top statuses of following feeds
    - _with every new statuses only first 1k followers get feeds updates, the rest are processed async by rabbitmq_

  - `NOTIFICATIONS:uid`(<1000, temp, many reads/writes)

    - me related activity
      - my @mentions
      - reposts/replies/likes of my statuses

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

  - *[users]
    - create({ username,email,name })
      - `if (hget(`USERSLOOKUP`, username) || hget(`USERSLOOKUP`, email)) return 409`  _username or email in use_
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
        - `pp.zscore(`BLACKLIST:AUID`, uid)`
        - `pp.zscore(`FOLLOWING:AUID`, uid)`
        - `pp.zintercard(2 following:auid following:uid)`
        - `[banned, followed, totalInterFollowing] = pp.execute()`
        - `user.relation = {banned,followed,totalInterFollowing}`
      - `if (!silent)`
        - `if (!(pp.zscore(`FOLLOWING:AUID`, uid)))`
          - `if (!pp.zscore(`BLACKLIST:AUID`, uid))`
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

  - *[subscriptions]
    - create({ auid,uid })
      - `if (!exists(`USER:UID`)) return 409` _no such user_
      - `if (zscore(`DELETEDUSERS`)) return 409` _deleted user_
      - `if (zscore(`FOLLOWING:AUID`, uid)) return 409` _already sub_
      - `pp.zadd(`FOLLOWING:AUID`, uid, timestamp)`
      - `pp.zadd(`FOLLOWERS:UID`, auid, timestamp)`
      - `pp.hincrby(`USER:AUID`, totalFollowing, 1)`
      - `pp.hincrby(`USER:UID`, totalFollowers, 1)`
      - ##drop_from_recommendations##
      - `if (pp.zscore(`RECOMMENDATIONS:AUID`, uid)`
        - `pp.zrem(`RECOMMENDATIONS:AUID`, uid)`
      - ##drop_from_blacklist##
      - `if (pp.zscore(`BLACKLIST:AUID`, uid)`
        - `pp.zrem(`BLACKLIST:AUID`, uid)`
      - ##get_following_statuses##
      - `pp.zrevrange(`STATUSES:USER:UID`, 0, 100, withscores)
      - `statuses = pp.execute()[-1]`
      - `pp.zadd(`FEED:AUID`, ...statuses)`
      - `pp.zremrangebyrank(`FEED:AUID`, 0, 1000)`
      - `pp.execute()`
      - ##get_top_recommendations_of_following##
      - `uids = zrange(`RECOMMENDATIONS:AUID`, cursor -1 REV BYSCORE LIMIT 0 50)`
      - `for uid in uids`
        - `if (!(pp.zscore(`FOLLOWING:AUID`, uid)))`
          - `if (!pp.zscore(`BLACKLIST:AUID`, uid))`
            - `if (pp.zscore(`RECOMMENDATIONS:AUID`, uid))`
              - ? `pp.zincrby(`RECOMMENDATIONS:AUID`, uid, 1)`
              - : `pp.zadd(`RECOMMENDATIONS:AUID`, uid, 1)`
            - `pp.zremrangebyrank(`RECOMMENDATIONS:AUID`, 0, 1000)`
      - `pp.execute()`
      - `user = [users].findOne(auid,uid,true)`
      - `return user`
    - findAll(auid, { uid,variant,limit,order,cursor })
      - `key = variant === 'FOLLOWERS' ? `FOLLOWERS:UID` : `FOLLOWING:UID``
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

  - *[bans]
    - create({ auid, uid })
      - `if (!exists(`USER:UID`)) return 409` _no such user_
      - `if (zscore(`DELETEDUSERS`)) return 409` _deleted user_
      - `if (zscore(`BLACKLIST:AUID`, uid)) return 409` _already blocked_
      - `zadd(`BLACKLIST:AUID`, uid, timestamp)`
      - `user = [users].findOne(auid, uid)`
      - `return user`
    - findAll(auid, { limit,order,cursor })
      - `pp.zcard(`BLACKLIST:AUID`)`
      - `pp.zrange(`BLACKLIST:AUID`, cursor -1 REV? BYSCORE LIMIT 0 limit`
      - `[total, ...uids] = pp.execute()`
      - `items = for uid in uids: [users].findOne(auid,uid,true)`
      - `return { total, items }`
    <!-- - findOne(auid,uid)
      - `createdAt = zscore(`BLACKLIST:AUID`, uid)`
      - `if (!createdAt) return 404`
      - `user = [users].findOne(auid, uid, true)`
      - `return { user, createdAt }` -->
    - delete(auid, uid)
      - `if (!zscore(`BLACKLIST:AUID`, uid)) return 404` _no ban_
      - `zrem(`BLACKLIST:AUID`, uid)`
      - `return null`

  - *[reports]
    - create(auid, { uid, sid?, reason? })
      - `if (!exists(`USER:UID`)) return 409` _no such user_
      - `if (sid)`
        - `if (!(exists(`STATUS:SID`))) return 409` _no such status_
        - `zadd(`REPORTS:STATUS:SID`, reason, sid)`
      - `zadd(`REPORTS:USER:UID`, reason, sid)`
      - return {user,status,reason,createdAt:timestamp}

- **statuses**

  - [statuses]
    - _findRelation_()
    - create(auid, data:{sid, text, media})
      - `id = incr('status:id:')`
      - `pp.hmset(`STATUS:ID`, ...{id,uid,sid,text,media,createdAt,totalLikes:0,totalRetweets:0,totalReplies:0})`
      - `pp.hincrby(`USER:AUID`, 'totalStatuses', 1)`
      - `pp.zadd(`STATUSES:USER:AUID`, id, createdAt)`
      - ##repost/reply##
      - `if (sid)`
        - `if (text || media)`
          - ? `pp.hincrby(`STATUS:SID`, 'totalReplies', 1)`
          - ? `pp.zadd(`REPLIES:SID`, id, timestamp)`
          - : `pp.hincrby(`STATUS:SID`, 'totalReposts', 1)`
          - : `pp.zadd(`REPOSTS:SID`, id, timestamp)`
        - ##recommed_author_of_origin_status##
        - 
        - `if (!(pp.zscore(`FOLLOWING:AUID`, uid)))`
          - `if (!pp.zscore(`BLACKLIST:AUID`, uid))`
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
      - ##followers_feeds##
      - `subs`
      - `pp.execute()`
      - `return this.findOne(auid, id, true)`
    - findAll(auid,uid?,sid?,tag?,limit,order,cursor)
        uid || sid ||tag || trended
    - findOne(auid, sid, silent?)
    //first lookup go to redis the second to postgres
      - `if (!exists(`STATUS:SID`)) return silent ? null : 404`
      - `status = entriesToObject(hgetall(`STATUS:SID`))`
      - `status.author = [users].findOne(auid, status.uid, true)`
      - `if (status.sid) status.status = this.findOne(auid, status.sid, true)`
      - `pp.zscore(`LIKES:SID`, auid)`
      - `pp.zscore(`REPOSTS:SID`, auid)`
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
      - `return null`
  
  - *[likes]
    - create(auid, sid)
      - `if (!(exists(`STATUS:SID`))) return 409`
      - `pp.zadd(`LIKES:USER:AUID`, sid, timestamp)`
      - `pp.zadd(`LIKES:STATUS:SID`, auid, timestamp)`
      - `pp.hincrby(`STATUS:SID`, totalLikes, 1)`
      - `pp.execute()`
      - `user=[users].findOne(auid,auid)`
      - `status=[status].findOne(auid,sid,true)`
      - `if (!(pp.zscore(`FOLLOWING:AUID`, status.author.id)))`
        - `if (!pp.zscore(`BLACKLIST:AUID`, status.author.id))`
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

  - *[trends]
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
    - create(sse(on home page), interval)
      - avoid in blacklist:uid
  
  - [notifications] _me related activity: mentions, likes/reposts/replies_
    - create(sse(from load), no interval)
      - avoid in blacklist:uid
        {status,user,type: like|mention}

- **timeline**

  statusEvent stream for feed, notifications, search

### TODO

- Rabbit
  - followers feeds update batching. With every new status only the first 1000 followers will gets updates in their feeds immediantly.
    The rest will by batched by 1000 and put to async queue
  - schedulling(rabbitmq_delayed_message_exchange):
    - every day statuses older than 30d go to cold db with bulk inserts
    - every day user hard deleting
      - `userstodelete = zrange(`DELETEDUSERS`, now, -1 REV BYSCORE)`
      - `for uid in userstodelete pp.hrem(`USER:UID`)`
      - ...rest zrem
      - pg version: SELECT \* FROM users WHERE deleted_at > NOW() - interval '3 month'
    - every hour trends filter:
      - `pp.zremrangebyscore(`LASTTAGS`, '-inf', now - dayinsec)//cut older than 24h`
      - `pp.zinterscore(`TRENDS`, 2, lasttags, trends)//only lasttags in trends`
      <!-- - `pp.zremrangebyrank(`TRENDS`, 0, 100)` -->
    - scheduled statuses
      - `[statuses].create(auid,data)`
- Monitoring
  - Termius custom health indicators for redis, rabbit
  - Prometheus redis stats
- Redis
  - geospatial - feed local statuses at first?
  - Search API?





when users post messages, we’ll PUBLISH the posted message information to a channel in Redis.
Our filters will SUBSCRIBE to that same channel, receive the message, and yield messages that match the filters back to the web server for sending to the client.

pipeline.hmset('status:%s'%id, data)
pipeline.hincrby('user:%s'%uid, 'posts')
pipeline.publish('streaming:status:', json.dumps(data))

pipeline.delete(key)
pipeline.zrem('profile:%s'%uid, status_id)
pipeline.zrem('home:%s'%uid, status_id)
pipeline.hincrby('user:%s'%uid, 'posts', -1)
pipeline.publish('streaming:status:', json.dumps(status))


pubsub.subscribe(['streaming:status:'])
  for {channel,message} in pubsub.listen():
    if decoded.get('deleted'):
      yield json.dumps({
          'id': decoded['id'], 'deleted': True})
    else
      yield message

  if quit[0]:
    break
    If the web server no longer has a connection to the client, stop filtering messages.
    
 
  pubsub.reset()





StatusEvent{type:'posting'|'repost'|'reply'  |'like'|'mention'|'RECOMMENDATIONS', from:Partial<User>, status:Partial<Status>}


FeedEvent{status:Status,extra?:'liked/following by :Follower' }
feed:uid
Notification{status:Partial<Status>,event?:{type: 'like/repost/reply/mention', from: Partial<User>}}
notifications:uid


like for my status, repost/reply for my status, mention me
[queue]
1. find uid of origin_status/mentioned_user
2. put StatusEvent in notifications:uid
3. put StatusEvent in notification_queue:uid
[pubsub]
1. find uid of origin_status/mentioned_user
2. put StatusEvent in notifications:uid
1. publish [StatusEvent,[uid]] in notifying

sse(auid)
[queue]
brpop notification_queue:auid -> send
[pubsub]
subscribe notifying message [StatusEvent,[uid]]
if uid === auid -> send


<!-- statuses -->

- DATA:

  - `feed:uid sid|{uid,sid}^createdAt <1000` following activity
  - `notifications:uid sid(@mention,repost,reply)|{uid,sid}{like)` me related activity

    {sid,uid,type[like|mention|repost|reply]}


    feed:uid = auid
    status.uid = auid
    status.text = :query
