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

## TODO

- Redis geospatial - local statuses at first?
- Rabbit
  - request batching?
  - schedulling(rabbitmq_delayed_message_exchange):
    - user hard deleting(time threshold)
      - pg version: SELECT * FROM users WHERE deleted_at > NOW() - interval '3 month'
    - striked statusses(count threshold)
    - scheduled statuses
- Termius custom health indicators
  - redis
  - rabbit

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
  - [users]
    - _findRelation_(uid,subuid)
      - `pp.zscore('blacklist:uid', subuid)`
      - `pp.zscore('following:uid', subuid)`
      - `pp.zinterstore('interfollowing:uid:subuid' 2 following:uid following:subuid)`
      - `pp.zcard('interfollowing:uid:subuid')`
      - `pp.del('interfollowing:uid:subuid')`
      - `extra = pp.execute()`
      - `return {banned:extra[0],followed:extra[1],totalInterFollowing:extra[3]}`
    - create(username,email,name)
      - `if (hget(userslookup, username) || hget(userslookup, email)) return 409`
      - `id = incr('status:id:')`
      - `pp.hset('userslookup', username, id, email, id, idpassword, password, idadmin, false)`
      - `pp.zadd('users', id, timestamp)`
      - `pp.hset('user:id', ...{id,username,name,bio,img,email,totalFollowers:0,totalFollowing:0,totalStatuses:0,createdAt})`
      - `pp.hgetall('user:id')`
      - `return entriesToObject(pp.execute()[3])`
    - findAll(auid,limit,order,cursor)
      - `src = auid === admin ? 'users' : 'recommend:auid'`
      - `pp.zcard(src)`
      - `pp.zrange(src, cursor -1 REV? BYSCORE LIMIT 0 limit)`
      - `[total, ...uids] = pp.execute()`
      - `items = for uid in uids: this.findOne(uid, auid)` // filter(None, pp.execute())
      - `return { total, items }`
    - findOne(uid, auid)
      - `if (!exists('user:uid')) return 404`
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
    - create
      -
      - if (zscore('recommend:uid', uid2))
        - ? zrem('recommed:uid', uid2)
    - findAll
    - findOne
      -
      - followedByMe: zscore('following:auid', uid)
    - delete
      - strikes
  - [bans]
    - create(auid, uid)
      - `zadd('blacklist:auid', uid, timestamp)`
    - findAll(auid,limit,order,cursor)
      - `pp.zcard('blacklist:auid')`
      - `pp.zrange('blacklist:auid', cursor -1 REV? BYSCORE LIMIT 0 limit`
      - `[total, ...items] = pp.execute()`
      - `for id in items: pp.hgetall('user:id')`
      - `{ total, items: filter(None, pp.execute()) }`
    - findOne(uid,sid)
      - `zscore('blacklist:auid', uid)`
    - delete(auid, sid)
      - `zrem('blacklist:auid', uid)`
- **statuses**
  - [statuses]
    - _findRelation_()
      -
    - create(auid, data:{sid, text, media,,})
      - `id = incr('status:id:')`
      - `pp.hincrby('user:auid', totalStatuses, 1)`
      - `pp.hmset('status:id, ...{id,uid,sid,text,media,createdAt,totalLikes:0,totalRetweets:0,totalReplies:0})`
      - `pp.hincrby('user:auid, 'totalStatuses')`
      - `if (sid)`
        - ``
      - `pp.execute()`

    parse text for @mentions, #hashes
    ZSET to store status IDs as ZSET members, with the timestamp
    - findAll(recommended?)
    - findOne
      - hmget('status:sid')
      - if (zscore('recommend:auid', status.uid))
        - ? zincrby('recommend:auid', 1, status.uid)
        - : zadd('recommend:auid', 1, status.uid)
    - delete(auid, sid)
      - `if (!exists('status:sid')) return 404`
      - `uid = hget('status:sid', uid)`
      - `if (uid !== auid) return 403`
      - `pp.hrem('status:sid')`
      - `pp.hincrby('user:auid, 'totalStatuses', -1)`
      - `pp.zrem('statuses:auid')`
      - `pp.execute()`
      - `return true`

  - [strikes]
    - create(auid, uid, sid, reason?)
      - `zadd('strikes', reason, sid)`
    - findAll(uid,sid,limit,order,cursor)
      - `pp.zcount('strikes:sid')`
      - `pp.zrange('likes:sid', cursor -1 REV? BYSCORE LIMIT 0 limit`
      - `[total, ...items] = pp.execute()`
      - `for id in items: pp.hgetall('status|user:id')`
      - `{ total, items: filter(None, pp.execute()) }`
  - [likes]
    - create(auid, sid)
      - `pp.zadd('likes:auid', sid, timestamp)`
      - `pp.zadd('likes:sid', auid, timestamp)`
      - `pp.execute()`
    - findAll(uid,sid,limit,order,cursor)
      - `pp.zcount('likes:uid|sid')`
      - `pp.zrange('likes:uid|sid', cursor -1 REV? BYSCORE LIMIT 0 limit`
      - `[total, ...items] = pp.execute()`
      - `for id in items: pp.hgetall('status|user:id')`
      - `{ total, items: filter(None, pp.execute()) }`
    - findOne(uid,sid)
      - `zscore('likes:sid', uid)`
    - delete(auid, sid)
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
  - `status:id {id,text?,media[],authorId,sid,createdAt,likesCnt,repostsCnt,retweetsCnt}`
  - `statuses:uid sid^createdAt`
  - `hashes:hash sid^createdAt`

  - `feed:uid sid|{uid,sid}^createdAt <1000` following activity
  - `notifications:uid sid(@mention,repost,reply)|{uid,sid}{like)` me related activity

    {sid,uid,type[like|mention|repost|reply]}
- API
  - POST
    pipeline.hget('user:uid, 'login')
    pipeline.incr('status:id:')
    login, id = pipeline.execute()
    pipeline.hmset('status:id, { id, uid, login, message, createdAt: time.time() })
    pipeline.hincrby('user:uid, 'posts') <!-- increment posts counter in user -->
    pipeline.execute()

    parse text for @mentions, #hashes
    ZSET to store status IDs as ZSET members, with the timestamp
  - GET
  - PATCH
  - DELETE

<!-- subscriptions -->
- DATA:
  - `followers:uid uid^createdAt`
  - `following:uid uid^createdAt`
  - `blacklist:uid uid[]`
- API
  - POST
    HOME_TIMELINE_SIZE = 1000
    def follow_user(conn, uid, other_uid):
      fkey1 = 'following:uid'
      fkey2 = 'followers:other_uid'
      <!-- if allready followed -->
      if conn.zscore(fkey1, other_uid): return None
      <!-- add subscriptions -->
      pipeline.zadd(fkey1, other_uid, now)
      pipeline.zadd(fkey2, uid, now)
      <!-- count sizes -->
      pipeline.zcard(fkey1)
      pipeline.zcard(fkey2)
      <!-- Fetch the most recent HOME_TIMELINE_SIZE status messages from the newly followed user’s profile timeline -->
      pipeline.zrevrange('profile:%s'%other_uid, 0, HOME_TIMELINE_SIZE-1, withscores=True)
      following, followers, status_and_score = pipeline.execute()[-3:]
      <!--  -->
      pipeline.hset('user:%s'%uid, 'following', following)
      pipeline.hset('user:%s'%other_uid, 'followers', followers)
      <!-- Update the home timeline of the following user, keeping only the most recent 1000 status messages. -->
      if status_and_score:
        pipeline.zadd('home:uid, **dict(status_and_score))
        pipeline.zremrangebyrank('home:uid, 0, -HOME_TIMELINE_SIZE-1)

      pipeline.execute()
      return True
  - GET
  - DELETE




recommended user

- when tweet request
  - put author_id of viewed tweet that i dont follow && not in blacklist
- on request
  - add followings of my followings && not in blacklist
