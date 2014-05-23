## Background
Europeana has chosen to use Pattern Lab in order to develop its styleguide and maintain its sites’ stylesheets. Styleguide development is done on files within the /source/ directory of this project, focused primarily on the files within the /source/_patterns directory. Site assets are generated using compass and moved into the public directory using the /core/scripts/generateSite.command.

## Setup
1. Clone this repo into a working directory.
1. Generate and/or update the /source/css/ directory and its css.
   1. initially the /source/css directory does not exist.
   1. assuming that [compass](http://compass-style.org/install/ "compass install page") has already been installed, from the root of the working directory run `compass compile source/`.
1. Generate and/or update the /public/ directory and its site assets.
   1. initially the /public directory exists, but only with a README document.
   1. from the root of the working directory `./core/scripts/generateSite.command`.

## Additional notes
* Apache should serve the /public/ directory as the site’s document root.
* Pattern Lab configuration can be adjusted in the /core/config/config.ini.default file.
* If, for any reason, you need to delete all assets from the public directory, you should also delete the /config/config.ini file. The `./core/scripts/generateSite.command` will then re-generate that file and the /public/ directory without error.

## About Pattern Lab
- [Pattern Lab Website](http://patternlab.io/)
- [About Pattern Lab](http://patternlab.io/about.html)
- [Documentation](http://patternlab.io/docs/index.html)
- [Demo](http://demo.patternlab.io/)

The PHP version of Pattern Lab is, at its core, a static site generator. It combines platform-agnostic assets, like the [Mustache](http://mustache.github.io/)-based patterns and the JavaScript-based viewer, with a PHP-based "builder" that transforms and dynamically builds the Pattern Lab site. By making it a static site generator, Pattern Lab strongly separates patterns, data, and presentation from build logic.
