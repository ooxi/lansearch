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
var fs = require('fs-extra');
var rjs = require('requirejs');
var tmp = require('tmp');

var client = __dirname +'/../../../client';
var lib = __dirname +'/../../../../lib';





/**
 * Reads a couple of files in and concatenates them separated by a newline
 * 
 * @param {array of string} sources Source file paths
 * @param {string} destination Destination file path
 * @param {string} charset Charset to use
 */
var cat = function(sources, destination, charset) {
	var js = '';
	
	for (var i = 0; i < sources.length; ++i) {
		js += '\n'+ fs.readFileSync(sources[i], charset);
	}
	fs.writeFileSync(destination, js, charset);
};





/**
 * Writes all required scripts into a directory and prepares a r.js
 * configuration
 * 
 * @param {string} destination temporary directory to use
 * @param {object} options See visualization
 * @param {function} cb Will be called with error as first argument, and r.js
 *     configuration as second argument
 */
var fill = function(destination, options, cb) {
	
	/* require.js must be execture before any other scripts otherwise
	 * the client will get runtime errors
	 */
	cat([	lib +'/requirejs/require.js',
		client +'/js/__init__.js'
	], destination +'/__init__.js', 'UTF-8');
	
	/* Since not all jQuery plugins support AMD I simply concatenate all
	 * together
	 */
	cat([	lib +'/jquery/jquery-2.0.3.js',
		lib +'/jquery/jquery.color-2.1.2.js'
	], destination +'/jquery.js', 'UTF-8');
	
	/* Wrap configuration in require.js module
	 */
	var optionsScript = 'define(\'options\', '+ JSON.stringify(options) +');';
	fs.writeFileSync(destination +'/options.js', optionsScript, 'UTF-8');
	
	/* Copy additional libraries
	 */
	fs.copySync(client +'/js/display.js', destination +'/display.js');
	fs.copySync(client +'/js/lanshare.js', destination +'/lanshare.js');
	
	cb(null, {
		baseUrl:	destination,
		out:		destination +'/optimized.js',
		name:		'__init__',
		optimize:	'none'
	});
};





/**
 * Creates a dynamic HTML listing using javascript
 * 
 * @param {object} options See module.exports
 * @param {function} cb Callback as always
 */
module.exports = function(options, cb) {
	
	async.waterfall([
		
		/* Create temporary directory
		 */
		function(cb) {
			tmp.dir({
				mode:		0750,
				prefix:		'lanseach',
				unsafeCleanup:	true
			}, cb);
		},
		
		/* Write stuff into that directory
		 */
		function(directory, cb) {
			fill(directory, options, cb);
		},
		
		/* Optimize code with r.js
		 */
		function(configuration, cb) {
			rjs.optimize(configuration, function() {
				var optimized = fs.readFileSync(configuration.out, 'UTF-8');
				cb(null, optimized);
			});
		}
	], cb);
};
