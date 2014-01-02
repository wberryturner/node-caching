'use strict';

var url = require('url'),
    redis = require('redis'),
    HashRing = require('hashring');

function HashRingStore(servers) {
    
    var i,
        temp;

    if (!(this instanceof HashRingStore)) {
        return new HashRingStore(servers);
    }

    if (typeof servers === 'string') {
        servers = servers.split(',');
    }

    this.ring = new HashRing(servers);
    this.client = {};

    for (i = 0; i < servers.length; i++) {
        temp = url.parse(servers[i]);
        this.client[servers[i]] = redis.createClient(temp.port, temp.hostname);
    }
}

HashRingStore.prototype.getClient = function cachingHashRingStoreGetServer(key) {

    var server = this.ring.get(key),
        client = this.client[server];
    
    return client;
}

HashRingStore.prototype.get = function(key, callback) {
    this.getClient(key).get(key, function(err, result) {
        callback(err, JSON.parse(result));
    });
};

HashRingStore.prototype.set = function(key, ttl, result) {
    if (ttl) {
        this.getClient(key).setex(key, Math.ceil(ttl/1000), JSON.stringify(result));
    } else {
        this.getClient(key).set(key, JSON.stringify(result));
    }
};

HashRingStore.prototype.remove = function(pattern) {
    if (~pattern.indexOf('*')) {
        var self = this;
        this.getClient(pattern).keys(pattern, function(err, keys) {
            if (keys.length) {
                self.getClient(keys).del(keys);
            }
        });
    } else {
        this.getClient(pattern).del(pattern);
    }
};

module.exports = HashRingStore;