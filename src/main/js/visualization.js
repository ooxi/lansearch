/**
 * Copyright (c) 2013 github.com/ooxi
 * 
 * This software is provided 'as-is', without any express or implied warranty.
 * In no event will the authors be held liable for any damages arising from the
 * use of this software.
 * 
 * Permission is granted to anyone to use this software for any purpose,
 * including commercial applications, and to alter it and redistribute it
 * freely, subject to the following restrictions:
 * 
 *  1. The origin of this software must not be misrepresented; you must not
 *     claim that you wrote the original software. If you use this software in a
 *     product, an acknowledgment in the product documentation would be
 *     appreciated but is not required.
 * 
 *  2. Altered source versions must be plainly marked as such, and must not be
 *     misrepresented as being the original software.
 * 
 *  3. This notice may not be removed or altered from any source distribution.
 */
var async = require('async');
var fs = require('fs');

var client = __dirname +'/../../client';

var noscript = require(__dirname +'/visualization/noscript.js');
var script = require(__dirname +'/visualization/script.js');
var style= require(__dirname +'/visualization/style.js');





/**
 * Generates an HTML listing application
 * 
 * @param {object} options .listings Array of listings to be displayed
 * 
 * @param {function} cb Callback which will be invoked with an error (if any)
 *     as first argument and the resulting HTML application as second
 */
module.exports = function(options, cb) {
	
	var index = fs.readFileSync(client +'/html/index.html', 'UTF-8');
	
	/* Create all visualizations in parallel...
	 */
	async.parallel([
		function(cb) {
			noscript(options, cb);
		},
		function(cb) {
			script(options, cb);
		},
		function(cb) {
			style(options, cb);
		}
		
	/* ...and gather the results back into one application
	 */
	], function(err, results) {
		
		if (err) {
			cb(err);
			return;
		}
		
		cb(null, index
			.replace(/%NOSCRIPT%/, results[0])
			.replace(/%SCRIPT%/, results[1])
			.replace(/%STYLE%/, results[2])
		);
	});
};
