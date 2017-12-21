![license](https://img.shields.io/github/license/pattern-lab/plugin-php-reload.svg)
[![Packagist](https://img.shields.io/packagist/v/pattern-lab/plugin-reload.svg)](https://packagist.org/packages/pattern-lab/plugin-reload) [![Gitter](https://img.shields.io/gitter/room/pattern-lab/php.svg)](https://gitter.im/pattern-lab/php)

# Reload Plugin for Pattern Lab

The Reload Plugin adds Web Socket-based automatic browser reload support to Pattern Lab. The Reload Plugin will automatically reload the Pattern Lab iFrame if you're using the `--watch` flag or `--server --with-watch` flag combo.

## Installation

To add the Reload Plugin to your project using [Composer](https://getcomposer.org/) type:

    composer require pattern-lab/plugin-reload

See Packagist for [information on the latest release](https://packagist.org/packages/pattern-lab/plugin-reload).

## Usage

The Reload Plugin is automatically turned on when you install it. Simply "watch" your project using the following command:

    php core/console --watch

You can also run your server and watch your project at the same time:

    php core/console --server --with-watch

## Disabling the Plugin

To disable the Reload Plugin you can either directly edit `./config/config.yml` or use the command line option:

    php core/console --config --set plugins.reload.enabled=false
