![license](https://img.shields.io/github/license/pattern-lab/patternengine-php-mustache.svg?maxAge=2592000)
[![Packagist](https://img.shields.io/packagist/v/pattern-lab/patternengine-mustache.svg?maxAge=2592000)](https://packagist.org/packages/pattern-lab/patternengine-mustache) [![Gitter](https://img.shields.io/gitter/room/pattern-lab/php.svg?maxAge=2592000)](https://gitter.im/pattern-lab/php)

# Mustache PatternEngine for Pattern Lab PHP

The Mustache PatternEngine allows you to use [Mustache](https://mustache.github.io) as the template language for Pattern Lab PHP. Once the PatternEngine is installed you can use Mustache-based StarterKits and StyleguideKits.

## Installation

The Mustache PatternEngine will come pre-installed with the **Pattern Lab Standard Edition**.

### Composer

Pattern Lab PHP uses [Composer](https://getcomposer.org/) to manage project dependencies with Pattern Lab Editions. To add the Mustache PatternEngine to the dependencies list for your Edition you can type the following in the command line at the base of your project:

    composer require pattern-lab/patternengine-mustache

See Packagist for [information on the latest release](https://packagist.org/packages/pattern-lab/patternengine-mustache).

## Overview

This document is broken into two parts:

* [Extending Mustache](#extending-mustache)
* [Available Loaders for Plugin Developers](#available-loaders)

## Extending Mustache

Mustache comes with two ways to extend the underlying template parser:

* [Filters](https://github.com/bobthecow/mustache.php/wiki/FILTERS-pragma)
* Lambdas

The Mustache PatternEngine enables these features via Helpers.

### Helpers

The requirements for using helpers with Pattern Lab:

* Files must go in `./source/_mustache-components/helpers`
* Files must have the extension `.helper.php` (_this can be modified in the config_)
* The helper **must** set the variable `$helper`
* Only one helper per file (_e.g. can only set `$helper` once per file_)

An example function called `verbatim.helper.mustache` in `./source/_mustache-components/helpers`:

```php
<?php

$helper = function ($text) {
  return "{{=%%pl pl%%=}}".$text."%%pl={{ }}=pl%%";
};

?>
```

This helper would be used like this in a pattern. Note that the tag is using the filename and that this is an example of a lambda:

```mustache
{{# verbatim }}
  {{ this won't be parsed }}
{{/ verbatim }}
```

Mustache also allows dot notation with helpers. An example function called `case.helper.mustache` in `./source/_mustache-components/helpers`:

```php
<?php

$helper = array(
    'lower' => function($value) { return strtolower((string) $value); },
    'upper' => function($value) { return strtoupper((string) $value); },
));

?>
```

This helper would be used like this in a pattern. Note that the tag is using the filename and that this is an example of a filter:

```mustache
{{ greeting | case.upper }}
```

## Available Loaders

If you're building a plugin that will be parsing Mustache files you have access to three loaders. It's recommended that you use these instead of accessing Mustache directly as these loaders will work with other PatternEngines.

### The String Loader

The string loader takes a simple string and compiles it. To use:

```php
$data         = array("hello" => "world");
$string       = "If I say hello you say {{ hello }}.";
$stringLoader = \PatternLab\Template::getStringLoader();
$output       = $stringLoader->render(array("string" => $string, "data" => $data));
print $output; // outputs "If I say hello you say world."
```

### The Filesystem Loader

The filesystem loader will look for templates in the configured StyleguideKit directory and compile them. The template location for the filesystem loader can't be modified. To use:

```php
$data             = array(...);
$filesystemLoader = \PatternLab\Template::getFilesystemLoader();
$output           = $filesystemLoader->render(array("template" => "viewall", "data" => $data));
print $output; // outputs the viewall view from the configured styleguidekit
```

### The Pattern Loader

The pattern loader looks for patterns and allows the use of the Pattern Lab-specific partial syntax. To use:

```php
$data                  = array(...);
$patternContent        = file_get_contents("path/to/pattern");
$patternEngineBasePath = \PatternLab\PatternEngine::getInstance()->getBasePath();
$patternLoaderClass    = $patternEngineBasePath."\Loaders\PatternLoader";
$patternLoader         = new $patternLoaderClass($options);
$code                  = $patternLoader->render(array("pattern" => $patternContent, "data" => $data));
print $output; // outputs the given pattern
