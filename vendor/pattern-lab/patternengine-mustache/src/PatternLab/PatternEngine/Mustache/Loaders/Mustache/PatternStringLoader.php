<?php

/*!
 * Mustache Pattern String Loader Class
 *
 * Copyright (c) 2014 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license
 *
 * The Pattern String Loader class simply spits back the given raw string for a pattern
 * to be processed by Mustache. The magic happens with partials anyway.
 *
 */

namespace PatternLab\PatternEngine\Mustache\Loaders\Mustache;

class PatternStringLoader implements \Mustache_Loader {
	
	/**
     * Load a Template by source.
     *
     * @param string $name Mustache Template source
     *
     * @return string Mustache Template source
     */
	public function load($name) {
		
		return $name;
		
	}
	
}
