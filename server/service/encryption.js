/*eslint-env node*/
/* eslint-disable  no-console */
/*global  */

'use strict';

var crypto = require('crypto');
var keyText = 'FutureView';
var hash = crypto.createHash('md5').update(keyText).digest('hex');
//console.log(hash);
var key = new Buffer(hash, 'hex');
var algo = 'des-ede';
module.exports = {
    Encrypt: function(text)
    {
        console.log('Encrypting ' + text);
        var cipher = crypto.createCipheriv(algo, key, '');
        var crypted = cipher.update(text, 'utf8', 'base64');
        crypted += cipher.final('base64');
        console.log('helpers.Encryption.Encrypt returns '+ crypted);
        return crypted;
    },
    Decrypt: function(text){
        console.log('Decrypting ' + text);
        var decipher = crypto.createDecipheriv(algo, key, '');
        var dec = decipher.update(text, 'base64', 'utf8');
        dec += decipher.final('utf8');
        console.log('helpers.Encryption.Decrypt returns ' + dec);
        return dec;
    }
};
