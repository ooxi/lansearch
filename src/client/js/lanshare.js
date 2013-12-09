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
define('lanshare', ['display'], function(display) {
	
	/**
	 * Shows a loading animation
	 * 
	 * @param {jQuery} $root DOM
	 */
	var disable = function($root) {

		$root.addClass('lanshare-loading').animate({
			backgroundColor:	'#D3D3D3'
		}, 50);
	};
	
	/**
	 * Removes the loading animation
	 * 
	 * @param {jQuery} $root DOM
	 */
	var enable = function($root) {
		$root.removeClass('lanshare-loading').animate({
			backgroundColor:	'#FFFFFF'
		}, 250);
	};





	/**
	 * Connects a node with a parent (and does that again for all children)
	 * 
	 * @param {object} parent Parent node
	 * @param {object} node Current node
	 */
	var link_with_parent = function(parent, node) {
		node.parent = parent;
		
		if (node.hasOwnProperty('children')) {
			for (var i = 0; i < node.children.length; ++i) {
				
				node.children[i] = link_with_parent(
					node, node.children[i]
				);
			}
		}
		return node;
	};
	
	
	
	/**
	 * Create a virtual root listing and connect all nodes
	 * 
	 * @param {array of object} listings Source listings
	 * @returns {object} New root listing
	 */
	var create_root_listing = function(listings) {
		var root = {
			type:		'root',
			parent:		null,
			children:	[]
		};
		
		for (var i = 0; i < listings.length; ++i) {
			root.children.push(link_with_parent(root, listings[i]));
		}
		return root;
	};
	
	
	
	/**
	 * Creates an ID for 
	 */
	var add_id = function(ids, prefix, node) {
		node.id = prefix;

		if (node.hasOwnProperty('name')) {
			node.id += '/'+ encodeURIComponent(node.name);
		} else if ('root' !== node.type) {
			throw 'IllegalStateException, only root cannot have a name all other nodes like `'+ node.type +'\' must have one';
		}
		ids[node.id] = node;
		
		if (node.hasOwnProperty('children')) {
			for (var i = 0; i < node.children.length; ++i) {
				add_id(ids, node.id, node.children[i]);
			}
		}
	};





	return function($root, options) {
		
		/* Disable GUI while doing all the heavy calculations like
		 * building a search index
		 */
		disable($root);
		
		
		/* Prepare listings
		 */
		var root = create_root_listing(options.listings);
		
		
		/* Create URL mappings for all entries
		 */
		var ids = {};
		add_id(ids, '', root);
		
		
		/* Register history handler
		 */
		window.onpopstate = function(event) {
			if (null === event.state) {
				display($root, root);
			} else {
				display($root, event.state);
			}
		};
		
		
		/* If URL contains a hash navigate to that node
		 */
		var hash = window.location.hash.substr(1);
		
		if (ids.hasOwnProperty(hash)) {
			display($root, ids[hash]);
		} else {
			display($root, root);
		}
		
		
		/* All work is done, GUI can now be used
		 */
		enable($root);
	};
});
