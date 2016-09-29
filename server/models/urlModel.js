import objectAssign from 'object-assign';
import isURL from 'validator/lib/isURL';

const initialSeq = 1000;
const maxKeyLength = 7;
const redis_ds_URL = 'ds_URL';
const redis_ds_COUNT = 'ds_COUNT';
const redis_ds_RECENT = 'ds_RECENT';

const config = {client: null};

export default function({client = null} = {}) {
  //if(!config.client) {
    objectAssign(config, {client});
  //}
  return {
    getClient,
    getCount,
    getRecent,
    saveUrl,
    getUrl
  }
}

function getClient() {
  return config.client;
}

function getCount(fn) {
  const {client} = config;
  client.get(redis_ds_COUNT, (err, reply) => {
    fn(reply);
  });
}

function getRecent(fn) {
  const {client} = config;
  client.lrange(redis_ds_RECENT, 0, 9, (err, reply) => {
    fn(reply);
  });
}

function saveUrl(url, fn) {
  const {client} = config;

  if(!isURL(url, {protocols: ['http', 'https']})) {
    fn(null);
    return;
  }

// Perform optimistic locking with retry
// http://stackoverflow.com/questions/29757935/redis-using-incr-value-in-a-transaction

  doUpdate();

  function doUpdate() {
    let key;
    let compositeKey;

    client.watch(redis_ds_COUNT);
    client.get(redis_ds_COUNT, (err, count) => {
      if(err) {
        process.nextTick(doUpdate);
      }
      else {
        // Force this to 1,000 if count is undefined?
        // http://stackoverflow.com/questions/9542726/is-it-possible-to-base-36-encode-with-javascript-jquery
        key = ((count || initialSeq) + 1).toString(36);
        compositeKey = `${redis_ds_URL}:${key}`;

        client.multi()
          .incr(redis_ds_COUNT)
          .lpush(redis_ds_RECENT, url)
          .set(compositeKey, url)
          .exec((err, reply) => {
            // Will return null if WATCH fails
            // http://redis.io/commands/exec
            if(typeof reply == 'null') {
              process.nextTick(doUpdate);
            }
            else {
              fn(key, reply);
            }
          });
      }
    });
  }
}

function getUrl(key, fn) {
  const {client} = config;
  // Sanity check. Should decode to an integer.
  // http://stackoverflow.com/questions/9542726/is-it-possible-to-base-36-encode-with-javascript-jquery
  const id = parseInt(key.length > maxKeyLength ? '^' : key, 36);
  if(isNaN(id)) {
    fn(null);
    return;
  }

  client.get(`${redis_ds_URL}:${key}`, (err, reply) => {
    // May be null
    fn(reply);
  });
}
