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
var humanize = require('humanize');





/**
 * humanize uses SI units wrong
 * 
 * @param {int} size Filesize to display
 * @param {boolean} binary Iff true it will use binary suffixes (KiB, MiB) else
 *     decimal suffixes will be used
 */
module.exports = function(size, binary) {	
	
	if (size <= 0) {
		return '0 bytes';
	}
	
	var configuration = {
		binary: {
			kilo:	1024,
			suffix:	['bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB']
		},
		decimal: {
			kilo:	1000,
			suffix:	['bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
		}
	};
	
	binary = !!binary;
	var suffix = binary ? configuration.binary.suffix : configuration.decimal.suffix;
	var kilo = binary ? configuration.binary.kilo : configuration.decimal.kilo;
	
	if (size < kilo) {
		var decimals = 0;
	}
	var suffixSep = ' ';
	return humanize.intword(size, suffix, kilo, decimals, undefined, undefined, suffixSep);
};
