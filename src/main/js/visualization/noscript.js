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
var filesize = require(__dirname +'/filesize.js');
var _ = require('escape-html');





/* Will display a file or directory
 * 
 * @param {string} parentUrl URL to parent entry
 * @param {object} entry file or directory to display
 */
var display = function(parentUrl, entry) {
	var url = parentUrl +'/'+ encodeURIComponent(entry.name);

	if ('directory' === entry.type) {
		html = '<a class="directory" href="'+ _(url) +'">'+ _(entry.name) +'</a>';

		if (entry.children.length) {
			html += '<ul class="directory-children">';

			for (var i = 0; i < entry.children.length; ++i) {
				html += '<li>'+ display(url, entry.children[i]) +'</li>';
			}
			html += '</ul>';
		}

		return html;
	} else if ('file' === entry.type) {
		return html = '<a class="file" href="'+ _(url) +'">'+ _(entry.name) +'</a> <em>'+ _(filesize(entry.size, true)) +'</em>';
	} else {
		throw 'Unsupported entry type '+ entry.type;
	}
};





/**
 *  Will display a complete listing
 *  
 *  @param {object} Listing entry
 */
var listing = function(entry) {
	html = '<h2><a href="'+ _(entry.url) +'">'+ _(entry.name) +'</a></h2>';

	if (entry.children.length) {
		html += '<ul class="listing">';

		for (var i = 0; i < entry.children.length; ++i) {
			html += '<li>'+ display(entry.url, entry.children[i]) +'</li>';
		}

		html += '</ul>';
	} else {
		html += '<p>'+ _(entry.name) +' is empty</p>';
	}

	return html;
};





/**
 * Creates an HTML only (no js) listing
 * 
 * @param {object} options See module.exports
 * @param {function} cb Callback as always
 */
module.exports = function(options, cb) {
	var html = '<h1>lanshare</h1>';
	
	for (var i = 0; i < options.listings.length; ++i) {
		html += listing(options.listings[i]);
	}
	
	cb(null, html);
};
