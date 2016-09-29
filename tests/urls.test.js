import test from 'tape';
import sinon from 'sinon';
import redis from 'fakeredis';

import urlModel from '../server/models/urlModel';

test('urls model', (t) => {

  t.test('no options', (t) => {
    const model = urlModel();
    t.assert(!model.getClient());
    t.end();
  });

  t.test('client', (t) => {
    const model = urlModel({client: true});
    t.assert(model.getClient());
    t.end();
  });

  t.test('getCount', (t) => {
    const client = redis.createClient();
    //sinon.stub(client, "get", () => {
    //  return 3;
    //});

    const fn = (reply) => {
      console.log(reply);
      client.quit();
      t.end();
    };

    const model = urlModel({client});
    const expected = 3;

    const actual = model.getCount(fn);
    //t.equal(actual, expected);

  });

  t.test('getRecent', (t) => {
    t.end();

  });

  t.test('saveUrl', (t) => {
    t.end();

  });

  t.test('getUrl', (t) => {
    const client = null;
    const key = 'a';
    const model = urlModel({client});
    const expected = 'http://example.com';

    //const actual = model.getUrl(key);
    //console.log(actual);

    //t.equal(actual, expected);
    t.end();
  });

});
