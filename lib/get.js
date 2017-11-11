/*

Copyright 2017 AJ Jordan <alex@strugee.net>.

This file is part of lazymention.

lazymention is free software: you can redistribute it and/or modify it
under the terms of the GNU Affero General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

lazymention is distributed in the hope that it will be useful, but
WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public
License along with lazymention. If not, see
<https://www.gnu.org/licenses/>.

*/

'use strict';

var _http = require('http'),
    https = require('https'),
    url = require('url'),
    concat = require('concat-stream'),
    pkg = require('../package.json');

module.exports = function get(path, callback) {
	var opts = url.parse(path);

	var http = opts.protocol === 'http:' ? _http : https;

	opts.headers = {
		'User-Agent': 'node.js/' + process.versions.node + ' ' + pkg.name + '/' + pkg.version
	};

	var req = http.get(opts);

	req.on('response', function(res) {
		if (res.statusCode < 200 || res.statusCode >= 300) {
			callback(new Error('Request to ' + path + ' returned HTTP ' + res.statusCode));
			console.log('fweai');
			return;
		}

		res.pipe(concat(function(buf) {
			callback(undefined, buf.toString());
		}));
	});

	req.on('error', function(err) {
		callback(err);
	});
};