/*eslint-env node*/
/* eslint-disable  no-console */

'use strict';

var inspect = require('eyes').inspector({
    stream: null,
    colors: false
});
var _ = require('underscore');

var apiTokenCache = {};


function removeOldTokens(args) {
    var now = new Date();
    var value;
    _.each(apiTokenCache, function(token) {
        value = now - token.createDate;
        //Expire
        if (value > 1000 * 60 * 60) {
            delete apiTokenCache[token.token];
        }
    });
}
exports.addApiToken = function(token, userid) {
    /*   _.each(apiTokenCache, function(token) {
        if (token.userid == userid) {
            delete apiTokenCache[token.token];
        }
    });*/
    apiTokenCache[token] = {};
    apiTokenCache[token].token = token;
    apiTokenCache[token].createDate = new Date();
    apiTokenCache[token].userid = userid;
    if (apiTokenCache.length > 1000) {
        removeOldTokens();
    }
    console.log(inspect(apiTokenCache));
};

exports.removeApiToken = function(token, userid) {
    var ctime = new Date();
    console.log(inspect(apiTokenCache));
    _.each(apiTokenCache, function(token) {
        if (token.userid == userid) {
            delete apiTokenCache[token.token];
        }
    });
    console.log(inspect(apiTokenCache));
};

exports.checkApiToken = function(token) {
    return apiTokenCache[token];
};

exports.validApiToken = function(token) {
    removeOldTokens();
    if (apiTokenCache[token]) apiTokenCache[token].createDate = new Date();
    return apiTokenCache[token];
};
