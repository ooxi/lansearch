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
var jsftp = require('jsftp');



/**
 * Opens a connection to a remote ftp host and lists all directories and files
 * 
 * @param {object or string} options jsftp options for connecting to remote FTP
 *     host, iff string then it will connect to that hostname with anonymous
 *     default options
 * @param {function} cb Function which will be called with error as first and
 *     listing (iff available) as second parameter
 */
module.exports = function(options, cb) {
	
	/* Expand simple arguments
	 */
	if ('string' === typeof(options)) {
		options = {
			host:	options
		};
	}
	
	var ftp = new jsftp(options);
	var listing = [];
	var depth = 0;
	
	
	/* Different file types
	 */
	var TYPE_DIRECTORY = 1;
	var TYPE_FILE = 0;
	
	
	/* Scans all files below path ands adds them to the listing object
	 */
	var scan = function(path, to) {
		
		/* List all files in path
		 */
		ftp.ls(path, function(err, res) {
			
			/* Propagate error without delay
			 */
			if (err) {
				ftp.raw.quit();
				cb(err);
				return;
			}
			
			/* Add files and directories
			 */
			res.forEach(function(file) {
				/* Recursive scan
				 */
				if (TYPE_DIRECTORY === file.type) {
					var directory = {
						name:		file.name,
						type:		'directory',
						children:	[]
					};
					to.push(directory);
					
					++depth;
					scan(path +'/'+ file.name, directory.children);
					
				/* Simple file
				 */
				} else if (TYPE_FILE === file.type) {
					to.push({
						name:	file.name,
						type:	'file',
						size:	file.size
					});
				
				/* Unknown file type
				 */
				} else {
					console.log('Unknown file type', path, file.name, file.type);
				}
			});
			
			/* Because of the async nature somebody will be the last
			 * and that callback will have to close the connection
			 */
			--depth;
			
			if (0 === depth) {
				ftp.raw.quit();
				cb(null, listing);
			}
		});
	};
	
	++depth;
	scan('.', listing);
};
