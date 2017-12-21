<?php

/*!
 * Mustache Util Class
 *
 * Copyright (c) 2015 Dave Olsen, http://dmolsen.com
 * Licensed under the MIT license
 *
 * Various utility methods for the Mustache PatternEngine
 *
 */

namespace PatternLab\PatternEngine\Mustache;

use \PatternLab\Config;
use \PatternLab\Console;
use \Symfony\Component\Finder\Finder;

class MustacheUtil {
	
	/**
	* Load helpers for the Mustache PatternEngine
	*
	* @return {Array}         an array of helpers
	*/
	public static function loadHelpers() {
		
		// set-up helper container
		$helpers = array();
		
		// load defaults
		$helperDir = Config::getOption("sourceDir").DIRECTORY_SEPARATOR."_mustache-components/helpers";
		$helperExt = Config::getOption("mustacheHelperExt");
		$helperExt = $helperExt ? $helperExt : "helper.php";
		
		if (is_dir($helperDir)) {
			
			// loop through the filter dir...
			$finder = new Finder();
			$finder->files()->name("*\.".$helperExt)->in($helperDir);
			$finder->sortByName();
			foreach ($finder as $file) {
				
				// see if the file should be ignored or not
				$baseName = $file->getBasename();
				if ($baseName[0] != "_") {
					
					include($file->getPathname());
					
					// $key may or may not be defined in the included file
					// $helper needs to be defined in the included file
					if (isset($helper)) {
						if (!isset($key)) {
							$key = $file->getBasename(".".$helperExt);
						}
						$helpers[$key] = $helper;
						unset($helper);
						unset($key);
					}
					
				}
				
			}
			
		}
		
		return $helpers;
		
	}
	
}
