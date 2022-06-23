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

- Redis pubsub case?
- Redis geospatial - local statuses at first?
- Rabbit request batching?
- Rabbit schedulling(rabbitmq_delayed_message_exchange):
  - user hard deleting(time threshold)
  - striked statusses(count threshold)
  - scheduled statuses


<!-- Entities/Cache(highly_requested) -->
- [subscriptions]
- [likes]
- [blacklist](_authors whose recommendations and tweets/likes are ignored_)
  - data: blacklist:userid(set with userid)
  - api: POST /, DELETE /id

<!-- Temp data(redis) -->
- [auth](_temp_codes_)
  - data: codes(sset code^userid)
  - api:
- [recommendations](_authors recommendations_)
  - data: recommendations:userid(list/100)
    - when tweet request
      - put author_id of viewed tweet that i dont follow && not in blacklist
    - on request
      - add followings of my followings && not in blacklist
  - api: GET(polling, keyset pagination) /
- [trends](_tweets-trends_)
  - data: trends
  - api: GET(polling, keyset pagination) /

- [notifications](notifications:userid(queue list), GET / (sse))
  - data:
  - api: GET(sse) /
- [timeline]
  - data:
  - api: GET(sse) /


<!-- auth -->
- DATA
- API
  - POST
    #if deleted then restore user
    if (conn.zscore(deleted, uid)) conn.zrem(deleted, uid)
  - GET

<!-- users -->
- DATA:
  - `user:id {id,username,name,bio?,createdAt,followersCnt,followingCnt,statusesCnt}`
  - `user:id:secured {email, password}`
  - `user:username uid`
  - `user:email uid`
  - `deleted uid^deletedAt`
- API:
  - POST
    #if email/username are in use
    if (conn.get(user:email) || conn.get(user:username)) return Err
    #create user & co
    id = conn.incr('user:id:')
    pipeline.hset('users:username, id)
    pipeline.hset('users:email, id)
    pipeline.hmset(user:id, {id,username,name,bio,followers:0,following:0,posts:0, createdAt})
    pipeline.hmset(user:id:sequred, {email,password}
    this.password = await bcrypt.hash(this.password, 8);
  - GET
  - PATCH
  - DELETE
    #if user not exists
    if (conn.zscore(deleted, uid)) return Err
    #soft delete user
    conn.zadd(deleted,uid,now())

<!-- statuses -->
- DATA:
  - `status:id {id,text?,media[],authorId,sid,createdAt,likesCnt,repostsCnt,retweetsCnt}`
  - `statusses:uid sid^createdAt`
  - ``
  - `feed:uid sid^createdAt`
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

<!-- timelines -->
statusses:uid statusid^createdAt
home:uid status^createdAt

def get_status_messages(conn, uid, timeline='home:', page=1, count=30):
  statuses = conn.zrevrange('%s%s'%(timeline, uid), (page-1)*count, page*count-1)
  for id in statuses: pipeline.hgetall('status:%s'%id)
  <!-- Filter will remove any “missing” status messages that had been prev deleted -->
  return filter(None, pipeline.execute())


<!-- likes -->
- DATA:
  - `likes:uid sid^createdAt`
  - `likes:sid uid^createdAt`
  <!-- - `likes sid^uid` -->
- API
  - POST(sid)
  - GET(uid, sid)
  - DELETE(sid)
