<?php

/*!
 * Mustache Pattern Engine Loader Class - Filesystem
 *
 * Copyright (c) 2014 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license
 *
 * Sets an instance of Mustache to deal with rendering of templates that aren't patterns
 *
 */

namespace PatternLab\PatternEngine\Mustache\Loaders;

use \PatternLab\PatternEngine\Loader;
use \PatternLab\PatternEngine\Mustache\MustacheUtil;

class FilesystemLoader extends Loader {

	/**
	* Load a new Mustache instance that uses the File System Loader
	*/
	public function __construct($options = array()) {

		$mustacheOptions                    = array();
		$mustacheOptions["loader"]          = new \Mustache_Loader_FilesystemLoader($options["templatePath"]);
		$mustacheOptions["partials_loader"] = new \Mustache_Loader_FilesystemLoader($options["partialsPath"]);
		$mustacheOptions["helpers"]         = MustacheUtil::loadHelpers();
		$mustacheOptions["pragmas"]         = array(\Mustache_Engine::PRAGMA_FILTERS);

		$this->instance = new \Mustache_Engine($mustacheOptions);

	}

	/**
	* Render a template
	* @param  {Array}        the options to be rendered by Mustache
	*
	* @return {String}       the rendered result
	*/
	public function render($options = array()) {

		return $this->instance->render($options["template"], $options["data"]);

	}

}
