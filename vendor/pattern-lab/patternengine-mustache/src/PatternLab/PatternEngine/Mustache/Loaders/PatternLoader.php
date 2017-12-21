<?php

/*!
 * Mustache Pattern Engine Loader Class - Patterns
 *
 * Copyright (c) 2014 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license
 *
 * Sets an instance of Mustache to deal with rendering of patterns
 *
 */

namespace PatternLab\PatternEngine\Mustache\Loaders;

use \PatternLab\Config;
use \PatternLab\Dispatcher;
use \PatternLab\PatternEngine\Mustache\Loaders\Mustache\PatternStringLoader as Mustache_Loader_PatternStringLoader;
use \PatternLab\PatternEngine\Mustache\Loaders\Mustache\PatternPartialLoader as Mustache_Loader_PatternPartialLoader;
use \PatternLab\PatternEngine\Mustache\MustacheUtil;
use \PatternLab\PatternEngine\Loader;

class PatternLoader extends Loader {

	/**
	* Load a new Mustache instance that uses the Pattern Loadere
	*/
	public function __construct($options = array()) {

		//default var
		$patternSourceDir = Config::getOption("patternSourceDir");

		$mustacheOptions                    = array();
		$mustacheOptions["loader"]          = new Mustache_Loader_PatternStringLoader();
		$mustacheOptions["partials_loader"] = new Mustache_Loader_PatternPartialLoader($patternSourceDir,array("patternPaths" => $options["patternPaths"]));
		$mustacheOptions["helpers"]         = MustacheUtil::loadHelpers();
		$mustacheOptions["pragmas"]         = array(\Mustache_Engine::PRAGMA_FILTERS);

		$this->instance = new \Mustache_Engine($mustacheOptions);

	}

	/**
	* Render a pattern
	* @param  {Array}        the options to be rendered by Mustache
	*
	* @return {String}       the rendered result
	*/
	public function render($options = array()) {

		return $this->instance->render($options["pattern"], $options["data"]);

	}

}
