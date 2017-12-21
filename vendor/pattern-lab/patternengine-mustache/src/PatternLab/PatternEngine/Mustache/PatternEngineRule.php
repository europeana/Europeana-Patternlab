<?php

/*!
 * Mustache Pattern Engine Rule Class
 *
 * Copyright (c) 2014 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license
 *
 * If the test matches "mustache" it will return various instances of the Mustache pattern engine
 *
 */

namespace PatternLab\PatternEngine\Mustache;

use \PatternLab\PatternEngine\Rule;

class PatternEngineRule extends Rule {
	
	public function __construct() {
		
		parent::__construct();
		
		$this->engineProp = "mustache";
		$this->basePath   = "\PatternLab\PatternEngine\Mustache";
		
	}
	
}
