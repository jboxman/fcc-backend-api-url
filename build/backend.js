require("source-map-support").install();
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 15);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var _ref$client = _ref.client;
  var client = _ref$client === undefined ? null : _ref$client;

  //if(!config.client) {
  (0, _objectAssign2.default)(config, { client: client });
  //}
  return {
    getClient: getClient,
    getCount: getCount,
    getRecent: getRecent,
    saveUrl: saveUrl,
    getUrl: getUrl
  };
};

var _objectAssign = __webpack_require__(13);

var _objectAssign2 = _interopRequireDefault(_objectAssign);

var _isURL = __webpack_require__(11);

var _isURL2 = _interopRequireDefault(_isURL);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var maxKeyLength = 7;
var redis_ds_URL = 'ds_URL';
var redis_ds_COUNT = 'ds_COUNT';
var redis_ds_RECENT = 'ds_RECENT';

var config = { client: null };

function getClient() {
  return config.client;
}

function getCount(fn) {
  var client = config.client;

  client.get(redis_ds_COUNT, function (err, reply) {
    fn(reply);
  });
}

function getRecent(fn) {
  var client = config.client;

  client.lrange(redis_ds_RECENT, 0, 9, function (err, reply) {
    fn(reply);
  });
}

function saveUrl(url, fn) {
  var client = config.client;


  if (!(0, _isURL2.default)(url, { protocols: ['http', 'https'] })) {
    fn(null);
    return;
  }

  // Perform optimistic locking with retry
  // http://stackoverflow.com/questions/29757935/redis-using-incr-value-in-a-transaction

  doUpdate();
  function doUpdate() {
    client.watch(redis_ds_COUNT);
    client.get(redis_ds_COUNT, function (err, count) {
      if (err) {
        process.nextTick(doUpdate);
      } else {
        (function () {
          // Force this to 1,000 if count is undefined?
          // http://stackoverflow.com/questions/9542726/is-it-possible-to-base-36-encode-with-javascript-jquery
          var key = ((count || 1000) + 1).toString(36);
          var compositeKey = redis_ds_URL + ':' + key;
          console.log(compositeKey);
          console.log(key);
          client.multi().incr(redis_ds_COUNT).lpush(redis_ds_RECENT, url).set(compositeKey, url).exec(function (err, reply) {
            // Will return null if WATCH fails
            // http://redis.io/commands/exec
            if (typeof reply == 'null') {
              process.nextTick(doUpdate);
            } else {
              fn(key, reply);
            }
          });
        })();
      }
    });
  }
}

function getUrl(key, fn) {
  var client = config.client;
  // Sanity check. Should decode to an integer.
  // http://stackoverflow.com/questions/9542726/is-it-possible-to-base-36-encode-with-javascript-jquery

  var id = parseInt(key.length > maxKeyLength ? '^' : key, 36);
  if (isNaN(id)) {
    fn(null);
  }

  client.get(redis_ds_URL + ':' + key, function (err, reply) {
    fn(reply);
  });
}

/***/ },
/* 1 */
/***/ function(module, exports) {

module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = assertString;
function assertString(input) {
  if (typeof input !== 'string') {
    throw new TypeError('This library (validator.js) validates strings only');
  }
}
module.exports = exports['default'];

/***/ },
/* 3 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = merge;
function merge() {
  var obj = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var defaults = arguments[1];

  for (var key in defaults) {
    if (typeof obj[key] === 'undefined') {
      obj[key] = defaults[key];
    }
  }
  return obj;
}
module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var app = (0, _express2.default)();

  var port = process.env.PORT || 3100;

  // __dirname is '/' after babel
  app.use(_express2.default.static(process.cwd() + '/public'));

  app.use(_bodyParser2.default.json());

  app.use('/', _redirectController2.default);

  // Import other functions
  app.use('/api', _statsController2.default);
  app.use('/api', _encodeController2.default);
  app.use('/api', _decodeController2.default);

  app.use(function (req, res, next) {
    res.status(404).send('Not Found');
  });

  app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).render('error');
  });

  var server = app.listen(port, function () {
    return console.log('Listening on ' + port);
  });
  return server;
};

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _redis = __webpack_require__(14);

var _redis2 = _interopRequireDefault(_redis);

var _bodyParser = __webpack_require__(12);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _encodeController = __webpack_require__(6);

var _encodeController2 = _interopRequireDefault(_encodeController);

var _decodeController = __webpack_require__(5);

var _decodeController2 = _interopRequireDefault(_decodeController);

var _statsController = __webpack_require__(8);

var _statsController2 = _interopRequireDefault(_statsController);

var _redirectController = __webpack_require__(7);

var _redirectController2 = _interopRequireDefault(_redirectController);

var _urlModel = __webpack_require__(0);

var _urlModel2 = _interopRequireDefault(_urlModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// This will need a specific string for heroku
// var client = require('redis').createClient(process.env.REDIS_URL);
var client = _redis2.default.createClient();
var model = (0, _urlModel2.default)({ client: client });

// For testing:
// https://glebbahmutov.com/blog/how-to-correctly-unit-test-express-server/
;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _urlModel = __webpack_require__(0);

var _urlModel2 = _interopRequireDefault(_urlModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var model = (0, _urlModel2.default)();

router.param('key', function (req, res, next, key) {
  if (key) req.key = key;
  next();
});

router.get('/fetch/:key', function (_ref, res) {
  var key = _ref.key;

  if (!key) {
    res.status(400).send('Invalid API call');
    return;
  }
  model.getUrl(key, function (v) {
    res.status(200).json({
      url: v
    });
  });
});

exports.default = router;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _urlModel = __webpack_require__(0);

var _urlModel2 = _interopRequireDefault(_urlModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var model = (0, _urlModel2.default)();

router.post('/save', function (req, res) {
  var url = req.body.url;

  if (!url) {
    res.status(400).send('Invalid API call');
    return;
  }
  model.saveUrl(url, function (v) {
    res.status(200).json({
      key: v,
      shortUrl: 'http://localhost:3100/' + v
    });
  });
});

/*
router.get('/saveUrl/:url', ({url}, res) => {
  if(!url) {
    res.status(400).send('Invalid API call');
    return;
  }
  model.saveUrl(url, (v) => {
    res.status(200).send(v);
  });
});
*/

exports.default = router;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _urlModel = __webpack_require__(0);

var _urlModel2 = _interopRequireDefault(_urlModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var model = (0, _urlModel2.default)();

// Perform validation
router.param('key', function (req, res, next, key) {
  console.log(key);
  if (key) req.key = key;
  next();
});

router.get('/:key', function (_ref, res) {
  var key = _ref.key;

  if (!key) {
    res.status(404).send('Not Found');
    return;
  }
  model.getUrl(key, function (v) {
    res.redirect(v);
  });
});

exports.default = router;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _urlModel = __webpack_require__(0);

var _urlModel2 = _interopRequireDefault(_urlModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var model = (0, _urlModel2.default)();

router.get('/recent', function (req, res) {
  model.getRecent(function (v) {
    res.status(200).json({
      recentUrls: v
    });
  });
});

exports.default = router;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFDQN;

var _assertString = __webpack_require__(2);

var _assertString2 = _interopRequireDefault(_assertString);

var _merge = __webpack_require__(3);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_fqdn_options = {
  require_tld: true,
  allow_underscores: false,
  allow_trailing_dot: false
};

function isFDQN(str, options) {
  (0, _assertString2.default)(str);
  options = (0, _merge2.default)(options, default_fqdn_options);

  /* Remove the optional trailing dot before checking validity */
  if (options.allow_trailing_dot && str[str.length - 1] === '.') {
    str = str.substring(0, str.length - 1);
  }
  var parts = str.split('.');
  if (options.require_tld) {
    var tld = parts.pop();
    if (!parts.length || !/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
      return false;
    }
  }
  for (var part, i = 0; i < parts.length; i++) {
    part = parts[i];
    if (options.allow_underscores) {
      part = part.replace(/_/g, '');
    }
    if (!/^[a-z\u00a1-\uffff0-9-]+$/i.test(part)) {
      return false;
    }
    if (/[\uff01-\uff5e]/.test(part)) {
      // disallow full-width chars
      return false;
    }
    if (part[0] === '-' || part[part.length - 1] === '-') {
      return false;
    }
  }
  return true;
}
module.exports = exports['default'];

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isIP;

var _assertString = __webpack_require__(2);

var _assertString2 = _interopRequireDefault(_assertString);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ipv4Maybe = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
var ipv6Block = /^[0-9A-F]{1,4}$/i;

function isIP(str) {
  var version = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

  (0, _assertString2.default)(str);
  version = String(version);
  if (!version) {
    return isIP(str, 4) || isIP(str, 6);
  } else if (version === '4') {
    if (!ipv4Maybe.test(str)) {
      return false;
    }
    var parts = str.split('.').sort(function (a, b) {
      return a - b;
    });
    return parts[3] <= 255;
  } else if (version === '6') {
    var blocks = str.split(':');
    var foundOmissionBlock = false; // marker to indicate ::

    // At least some OS accept the last 32 bits of an IPv6 address
    // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
    // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
    // and '::a.b.c.d' is deprecated, but also valid.
    var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
    var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

    if (blocks.length > expectedNumberOfBlocks) {
      return false;
    }
    // initial or final ::
    if (str === '::') {
      return true;
    } else if (str.substr(0, 2) === '::') {
      blocks.shift();
      blocks.shift();
      foundOmissionBlock = true;
    } else if (str.substr(str.length - 2) === '::') {
      blocks.pop();
      blocks.pop();
      foundOmissionBlock = true;
    }

    for (var i = 0; i < blocks.length; ++i) {
      // test for a :: which can not be at the string start/end
      // since those cases have been handled above
      if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
        if (foundOmissionBlock) {
          return false; // multiple :: in address
        }
        foundOmissionBlock = true;
      } else if (foundIPv4TransitionBlock && i === blocks.length - 1) {
        // it has been checked before that the last
        // block is a valid IPv4 address
      } else if (!ipv6Block.test(blocks[i])) {
        return false;
      }
    }
    if (foundOmissionBlock) {
      return blocks.length >= 1;
    }
    return blocks.length === expectedNumberOfBlocks;
  }
  return false;
}
module.exports = exports['default'];

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isURL;

var _assertString = __webpack_require__(2);

var _assertString2 = _interopRequireDefault(_assertString);

var _isFQDN = __webpack_require__(9);

var _isFQDN2 = _interopRequireDefault(_isFQDN);

var _isIP = __webpack_require__(10);

var _isIP2 = _interopRequireDefault(_isIP);

var _merge = __webpack_require__(3);

var _merge2 = _interopRequireDefault(_merge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var default_url_options = {
  protocols: ['http', 'https', 'ftp'],
  require_tld: true,
  require_protocol: false,
  require_host: true,
  require_valid_protocol: true,
  allow_underscores: false,
  allow_trailing_dot: false,
  allow_protocol_relative_urls: false
};

var wrapped_ipv6 = /^\[([^\]]+)\](?::([0-9]+))?$/;

function isRegExp(obj) {
  return Object.prototype.toString.call(obj) === '[object RegExp]';
}

function checkHost(host, matches) {
  for (var i = 0; i < matches.length; i++) {
    var match = matches[i];
    if (host === match || isRegExp(match) && match.test(host)) {
      return true;
    }
  }
  return false;
}

function isURL(url, options) {
  (0, _assertString2.default)(url);
  if (!url || url.length >= 2083 || /\s/.test(url)) {
    return false;
  }
  if (url.indexOf('mailto:') === 0) {
    return false;
  }
  options = (0, _merge2.default)(options, default_url_options);
  var protocol = void 0,
      auth = void 0,
      host = void 0,
      hostname = void 0,
      port = void 0,
      port_str = void 0,
      split = void 0,
      ipv6 = void 0;

  split = url.split('#');
  url = split.shift();

  split = url.split('?');
  url = split.shift();

  split = url.split('://');
  if (split.length > 1) {
    protocol = split.shift();
    if (options.require_valid_protocol && options.protocols.indexOf(protocol) === -1) {
      return false;
    }
  } else if (options.require_protocol) {
    return false;
  } else if (options.allow_protocol_relative_urls && url.substr(0, 2) === '//') {
    split[0] = url.substr(2);
  }
  url = split.join('://');

  split = url.split('/');
  url = split.shift();

  if (url === '' && !options.require_host) {
    return true;
  }

  split = url.split('@');
  if (split.length > 1) {
    auth = split.shift();
    if (auth.indexOf(':') >= 0 && auth.split(':').length > 2) {
      return false;
    }
  }
  hostname = split.join('@');

  port_str = ipv6 = null;
  var ipv6_match = hostname.match(wrapped_ipv6);
  if (ipv6_match) {
    host = '';
    ipv6 = ipv6_match[1];
    port_str = ipv6_match[2] || null;
  } else {
    split = hostname.split(':');
    host = split.shift();
    if (split.length) {
      port_str = split.join(':');
    }
  }

  if (port_str !== null) {
    port = parseInt(port_str, 10);
    if (!/^[0-9]+$/.test(port_str) || port <= 0 || port > 65535) {
      return false;
    }
  }

  if (!(0, _isIP2.default)(host) && !(0, _isFQDN2.default)(host, options) && (!ipv6 || !(0, _isIP2.default)(ipv6, 6)) && host !== 'localhost') {
    return false;
  }

  host = host || ipv6;

  if (options.host_whitelist && !checkHost(host, options.host_whitelist)) {
    return false;
  }
  if (options.host_blacklist && checkHost(host, options.host_blacklist)) {
    return false;
  }

  return true;
}
module.exports = exports['default'];

/***/ },
/* 12 */
/***/ function(module, exports) {

module.exports = require("body-parser");

/***/ },
/* 13 */
/***/ function(module, exports) {

module.exports = require("object-assign");

/***/ },
/* 14 */
/***/ function(module, exports) {

module.exports = require("redis");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

__webpack_require__(4).default();

/***/ }
/******/ ]);
//# sourceMappingURL=backend.js.map