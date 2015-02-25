## Background
Europeana has chosen to use Pattern Lab in order to develop its styleguide and maintain its sites’ stylesheets. Styleguide development is done on files within the /source/ directory of this project, focused primarily on the files within the /source/_patterns directory. Site assets are generated using compass and moved into the public directory using the /core/scripts/generateSite.command.

## Setup
1. Clone this repo into a working directory.
1. Generate and/or update the /source/css/ directory and its css.
   1. initially the /source/css directory does not exist.
   1. assuming that [compass](http://compass-style.org/install/ "compass install page") has already been installed, from the root of the working directory run `compass compile source/`.
1. Generate and/or update the /public/ directory and its site assets.
   1. initially the /public directory exists, but only with a README document.
   1. from the root of the working directory `./core/scripts/generateSite.command` or `php core/builder.php -g`.

## Europeana Pattern Lab
There are a few differences between the Pattern Lab install at https://github.com/pattern-lab/patternlab-php and the Europeana version of Pattern Lab.

1. The styleguide `source` directory already exists.
1. The sass stylesheets that affect the styleguide and that should be editted live in `source/sass` _not in_ `source/css`.
1. The styleguide has been setup to handle more than one site’s styleguide.
   1. `source/sass` contains sub folders for each site.
1. The `source/css` directory needs to be created and updated with `compass compile source/` before the styleguide is update/re-generated.

### Multiple Sites
The Europeana Pattern Lab maintains a styleguide that’s used by several Europeana sites. The templates and pages drop-downs reveal the different views for each site.

### Creating a new site
A new site is defined by its own folder within `source/sass` and a folder in `source/_patterns/03-templates` and/or `source/_patterns/04-pages`. The template and page patterns contain json data that distinguishes the site from other sites represented in the styleguide. The json date refers to site specifc css and/or js files as well as other json data that may be needed by the site styleguide.

1. Create a folder in `source/sass` that represents the site.
   1. Create a `screen.scss` file in that directory that will compose the styles the site uses.
1. Depending on whether you will add a site specific template or page, create a folder in either `source/_patterns/03-templates` or `source/_patterns/04-pages`.
   1. Create a mustache template that represents the corresponding template or page.
      1. `source/_patterns/03-templates/Search/Search-results-list.mustache`
   1. Create a matching `.json` file that contains site specific asset references.
      1. `source/_patterns/03-templates/Search/Search-results-list.json`
      1. `css_files` and `js_files` definitions in the json file are arrays of objects that represent the paths to the site specific assets.
         1. `css_files` takes a path and media key/value pair:
            1. `"path": "../../css/search/screen.css"`
            1. `"media": "all"`
            1. The `source/_patterns/00-atoms/00-meta/_00-head.mustache` will iterate over the `css_files` definition and create corresponding `<link>` tags.
         1. `js_files` takes a path key/value pair:
            1. `"path": "../../js/search/screen.js"`
            1. The `source/_patterns/00-atoms/00-meta/_00-foot.mustache` will iterate over the `js_files` definition and create corresponding `<script>` tags.

## Additional notes
* Apache should serve the /public/ directory as the site’s document root.
* Pattern Lab configuration can be adjusted in the /core/config/config.ini.default file.
* If, for any reason, you need to delete all assets from the public directory, you should also delete the /config/config.ini file. The `./core/scripts/generateSite.command` will then re-generate that file and the /public/ directory without error.
* The development site will rebuild automatically in response to commits to this repository
<<<<<<< HEAD
* To update the "production" site go here - http://jenknisa.eanadev.org/job/styleguide-engineyard-production - and log in if you haven't already and click "build now"
=======
* To update the "production" site go here - http://jenkins.eanadev.org/job/styleguide-engineyard-production - and log in if you haven't already and click "build now"
>>>>>>> develop
* This site: http://develop.styleguide.eanadev.org/ is built from the develop branch
* This site: http://styleguide.europeana.eu/ is built from the master branch
* Make sure that the develop branch has been merged with the master branch before attempting to build the master branch

## About Pattern Lab
- [Pattern Lab Website](http://patternlab.io/)
- [About Pattern Lab](http://patternlab.io/about.html)
- [Documentation](http://patternlab.io/docs/index.html)
- [Demo](http://demo.patternlab.io/)

The PHP version of Pattern Lab is, at its core, a static site generator. It combines platform-agnostic assets, like the [Mustache](http://mustache.github.io/)-based patterns and the JavaScript-based viewer, with a PHP-based "builder" that transforms and dynamically builds the Pattern Lab site. By making it a static site generator, Pattern Lab strongly separates patterns, data, and presentation from build logic.
