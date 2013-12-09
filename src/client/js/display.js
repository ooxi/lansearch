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
define('display', ['jquery'], function($) {
	
	
	
	/**
	 * @param {type} node Node of which an URL should be calculated
	 * @returns {URL} URL of file node
	 */
	var get_real_url = function(node) {
		
		/* Node has an absolute URL, no need to check parent
		 */
		if (node.hasOwnProperty('url')) {
			return node.url;
		
		/* Node has no parent and no absolute URL which means we cannot
		 * calculate an URL
		 */
		} else if (null === node.parent) {
			throw 'IllegalStateException, it\'s impossible to calculate a URL to '+ node;
		} else {
			return get_real_url(node.parent) +'/'+ encodeURIComponent(node.name);
		}
	};
	
	
	
	
	
	/**
	 * Default action for link buttons
	 */
	var link_click_handler = function() {
		var $this = $(this);
		
		var $root = $this.data('$root');
		var node = $this.data('node');
		
		window.history.pushState(node, node.name, '#'+ node.id);
		display($root, node);
	};


	
	
	
	/**
	 * Displays one link
	 * 
	 * @param {node} node Node to which a link should be constructed
	 * 
	 * @return {jQuery} DOM representation of a link to that node
	 */
	var display_link = function($root, node) {
		
		var classes = {
			root:		'glyphicon-globe',
			listing:	'glyphicon-list',
			directory:	'glyphicon-folder-open',
			file:		'glyphicon-file'
		}
		
		/* Name is composed of a node type icon an the node's name
		 */
		var $name = $('<span />').append(
			$('<span class="glyphicon" />').addClass(classes[node.type]),
			$('<span class="lanshare-link-name" />').text(node.name)
		);
		
		
		
		/* Files should be opened in an external application not inside
		 * the webapp
		 */
		if ('file' === node.type) {
			var $name = $name.append($('<em />').text(node.size));
		
			return $('<a class="lanshare-link btn btn-primary btn-lg btn-block" target="_blank" />')
				.attr('href', get_real_url(node))
				.append($name);
			
		/* Virtual link inside the webapp
		 */
		} else {
			return $('<button type="button" class="lanshare-link btn btn-primary btn-lg btn-block" />')
				.data('$root', $root)
				.data('node', node)
				.click(link_click_handler)
				.append($name);
		}
	};
	
	

	/**
	 * Displays a link list to the parent and all children
	 * 
	 * @param {node or null} parent Parent node
	 * @param {array of node} children All children
	 * 
	 * @return {jQuery} DOM representation of parent and children
	 */
	var display_links = function($root, parent, children) {
		var $list = $('<div class="lanshare-link-list btn-group-vertical" />');
		
		if (null !== parent) {
			var $parent = display_link($root, parent);
			$parent.text('..');
			$list.append($parent);
		}
		for (var i = 0; i < children.length; ++i) {
			$list.append(display_link($root, children[i]));
		}
		
		return $list;
	};
	
	
	
	
	
	/**
	 * Displays the virtual root
	 * 
	 * @param {jQuery} $root DOM in which to display
	 * @param {node} node Virtual root listing
	 */
	var display_root = function($root, root) {
		if ('root' !== root.type) {
			throw 'IllegalStateException, root.type sould be `root\' but is `'+ root.type +'\'';
		}
		
		var $heading = '<h1>lanshare</h1>';
		var $children = display_links($root, root.parent, root.children);
		
		$root.append($heading, $children);
	};
	
	
	
	/**
	 * Displays a server listing
	 * 
	 * @param {jQuery} $root DOM in which to display
	 * @param {node} node Server listing node
	 */
	var display_listing = function($root, listing) {
		if ('listing' !== listing.type) {
			throw 'IllegalStateException, listing.type sould be `listing\' but is `'+ listing.type +'\'';
		}
		
		var $heading = $('<h1 />').text(listing.name);
		var $children = display_links($root, listing.parent, listing.children);
		
		$root.append($heading, $children);
	};
	
	
	
	/**
	 * Displays a directory listing
	 * 
	 * @param {jQuery} $root DOM in which to display
	 * @param {node} node Server listing node
	 */
	var display_directory = function($root, directory) {
		if ('directory' !== directory.type) {
			throw 'IllegalStateException, directory.type sould be `directory\' but is `'+ directory.type +'\'';
		}
		
		var $heading = $('<h1 />').text(directory.name);
		var $children = display_links($root, directory.parent, directory.children);
		
		$root.append($heading, $children);
	};
	
	
	
	
	
	
	/**
	 * Switches between different display implementations
	 * 
	 * @param {jQuery} $root DOM in which to display
	 * @param {object} node Node to display
	 */
	var display = function($root, node) {
		$root.html('');
		
		if ('root' === node.type) {
			display_root($root, node);
		} else if ('listing' === node.type) {
			display_listing($root, node);
		} else if ('directory' === node.type) {
			display_directory($root, node);
		} else {
			throw 'Invalid node type `'+ node.type +'\'';
		}
	};
	
	
	
	return display;
});
