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
var argv = require('optimist')
	.demand('file').describe('file', 'Path to HTML file which should be served')
	.default('port', 8080).describe('port', 'Port on which the HTTP server should listen')
	.argv;
var fs = require('fs');
var http = require('http');



http.createServer(function(req, res) {
	res.writeHead(200, {"Content-Type": "text/html; encoding=UTF-8"});
	res.end(fs.readFileSync(argv.file, 'UTF-8'));
}).listen(argv.port);

console.log('Startet serving `', argv.file ,'\' on port `', argv.port ,'\'');
