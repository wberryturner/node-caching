# node-caching

Makes working with caching easier. Now with [hash ring support](http://en.wikipedia.org/wiki/Consistent_hashing)!


## Installation

Via [npm](http://github.com/isaacs/npm):

```
$ npm install caching
```


## Built in stores

* Memory
* Redis
* Hash Ring


### Pseudo-code Example

```javascript
var Caching = require('caching');
var cache = new Caching('redis'); /* use 'memory', 'redis' or 'hashring' */

var ttl = 60 * 1000; // 1minute;
cache('twitter-users', ttl, function(passalong) {
    getMostActiveTwitterUser(function(err, userName) {
        fetchTwitterFollowers(userName, passalong); // passalong replaces function(err, userList) {}
    })
}, function(err, userList) {
    console.log(userList);
});
```


### Memory Code Example

```javascript
var Caching = require('caching');
var cache = new Caching();

setInterval(function() {
    cache('key', 10000 /*ttl in ms*/, function(passalong) {
        // This will only run once, all following requests will use cached data.
        setTimeout(function() {
            passalong(null, 'Cached result');
        }, 1000);
    }, function(err, results) {
        // This callback will be reused each call
        console.log(results);
    });
}, 100);
```


### Redis Code Example

```javascript
var Caching = require('caching');
var cache = new Caching('redis');

setInterval(function() {
    cache('key', 10000 /*ttl in ms*/, function(passalong) {
        // This will only run once, all following requests will use cached data.
        setTimeout(function() {
            passalong(null, 'Cached result');
        }, 1000);
    }, function(err, results) {
        // This callback will be reused each call
        console.log(results);
    });
}, 100);
```


### Hash Ring Code Example

```javascript
var Caching = require('caching');
var cache = new Caching('hashring', {
        "servers": 'http://localhost:6377,http://localhost:6378,http://localhost:6379,http://localhost:6380',
        "max cache size": 10000 /* Any node-hashing options allowed */
    });

setInterval(function() {
    cache('key', 10000 /*ttl in ms*/, function(passalong) {
        // This will only run once, all following requests will use cached data.
        setTimeout(function() {
            passalong(null, 'Cached result');
        }, 1000);
    }, function(err, results) {
        // This callback will be reused each call
        console.log(results);
    });
}, 100);
```


## Api

```
cache(key, ttl, runIfNothingInCache, useReturnedCachedResults);
```


### arguments[0]

Key, `'myKey'`


### arguments[1]

Time To Live in ms, `60*30*1000`


### arguments[2]

Callback that will run if results aren't already in cache store.

```javascript
function (passalong) {
    setTimeout(function() {
        passalong(null, 'mape', 'frontend developer', 'sweden');
    }, 1000);
}
```


### arguments[3]

Callback that is called every time the method runs.

```javascript
function(err, result) {
    console.log(name, result);
}
```
