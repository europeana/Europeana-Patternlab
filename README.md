# Europeana Pattern Lab Styleguide

[![Build Status](https://travis-ci.org/europeana/Europeana-Patternlab.svg?branch=develop)](https://travis-ci.org/europeana/Europeana-Patternlab)

## Background
Europeana uses Pattern Lab in order to develop its styleguide and maintain its sites’ stylesheets, javascripts, images and markup templates.  Apache, Compass and Php are required to run it.

Styleguide development is done on files within the /source/ directory of this project, focused primarily on the files within the /source/_patterns directory. Site assets are generated by executing 'php core/console --generate'

## Setup
### With Docker
1. Clone this repo into a working directory and `cd` into it
1. Bring Docker Compose up with:

    ```
    cd docker
    docker-compose up
    ```

1. You will now have Pattern Lab running at http://localhost:8080/

### Without Docker
1. Clone this repo into a working directory under an apache server web root
1. Generate and/or update the /source/css/ directory and its css
   1. initially the /source/css directory does not exist
   1. assuming that [compass](http://compass-style.org/install/ "compass install page") has already been installed, from the root of the working directory run `compass compile source/`
1. Generate and/or update the /public/ directory and its site assets
   1. initially the /public directory exists, but only with a README document
   1. from the root of the working directory run `php core/console --generate`
1. The web server should serve files from the `public` directory generated or updated in the previous step

## Testing
The unit tests under source/js/unit-tests can be run with the commands:

`npm install`
`npm test`

or alternatively:

`npm install`
`karma start`
## Europeana Pattern Lab
There are a few differences between the Pattern Lab install at https://github.com/pattern-lab/patternlab-php and the Europeana version of Pattern Lab.

1. The styleguide `source` directory already exists.
1. The sass stylesheets that affect the styleguide and that should be edited live in `source/sass` _not in_ `source/css`.
1. The styleguide has been setup to handle more than one site’s styleguide.
   1. `source/sass` contains sub folders for each site
   1. `source/_patterns` contains the additional folder `js_demo` for markup used to demo javascript components
1. The `source/css` directory needs to be created and updated with `compass compile source/` before the styleguide is update/re-generated.

### Multiple Sites
The Europeana Pattern Lab maintains a styleguide that’s used by several Europeana sites. The template drop-down on the top-level styleguide page reveals the different views for each site.  Page templates for different sites are encouraged to use common components where possible.

### Creating a new site
A new site is defined by its own folder within `source/sass` and a folder in `source/_patterns/templates`. The template patterns contain json data that distinguishes the site from other sites in the styleguide. The json data refers to site specifc css and/or js files as well as the json data used to populate the templates with (dummy) content.

1. Create a folder in `source/sass` that represents the site
   1. Create a `screen.scss` file in that directory that will compose the styles the site uses
1. Depending on whether you will add a site specific template or page, create a folder in either `source/_patterns/templates`
   1. Create a mustache template that represents the corresponding template or page
      1. `source/_patterns/templates/Search/Search-results-list.mustache`
   1. Create a matching `.json` file that contains site specific asset references
      1. `source/_patterns/templates/Search/Search-results-list.json`
      1. `css_files` and `js_files` definitions in the json file are arrays of objects that represent the paths to the site specific assets
         1. `css_files` takes path and media key/value pairs:
            1. `"path": "../../css/search/screen.css"`
            1. `"media": "all"`
            1. The partial at `source/_patterns/atoms/meta/_head.mustache`, if included, will iterate over the `css_files` definition and create corresponding `<link>` tags.
         1. `js_files` takes path and data_main key/value pairs:
            1. `"path": "../../js/search/screen.js"`
            1. `"data_main": "../../js/modules/main/templates/main-collections"`
            1. The partial at `source/_patterns/atoms/meta/_foot.mustache`, if included, will iterate over the `js_files` definition and create corresponding `<script>` tags.
            1. As a general rule a site should have a single js entry point (the requirejs config specified by `data_main`) the loading of further javascript should then be handled by requirejs
         1. `js_vars` takes name, value and unquoted key/value pairs:
            1. `"name": "pageName"`
            1. `"value": "collections/show"`
            1. `"unquoted": false  (optional - used to output raw JSON into a variable)`
            1. As a general rule js_vars should be use sparingly as they translate to global (window) variables in the generated javascript

## Development
The command:

 - grunt watch

should be executed in the project root before commencing development.  This will rebuild the styleguide CSS (when sass files are saved), redeploy the scripts (when js files are saved) and recompile the templates (when any file is saved)

This watch script invokes Pattern Lab's build command (`php core/console --generate`) but it also handles Europeana-specific styleguide features, such as the separate compilation of scss files that are loaded externally by javascript.

For more details on Europeana's front-end development practice please see the [development wiki](https://europeanadev.assembla.com/spaces/europeana-npc/wiki/Front-end)


## Additional notes
* Apache should serve the /public/ directory as the site’s document root.
* Pattern Lab configuration can be adjusted in the /core/config/config.ini.default file.
* If, for any reason, you need to delete all assets from the public directory, you should also delete the /config/config.ini file. The `php core/console --generate` will then re-generate that file and the /public/ directory without error.
* Various development test sites will rebuild automatically in response to commits to this repository
* To update the "production" site go here - https://jenkins.eanadev.org/job/styleguide.s3.production/ - and log in if you haven't already and click "build now"
* This site: http://styleguide.europeana.eu/ is built from the develop branch
* The sites under this domain: https://style.europeana.eu/ are built from versions on the master branch
* Make sure that the develop branch has been merged with the master branch before attempting to build the master branch

## About Pattern Lab
- [Pattern Lab Website](http://patternlab.io/)
- [About Pattern Lab](http://patternlab.io/about.html)
- [Documentation](http://patternlab.io/docs/index.html)
- [Demo](http://demo.patternlab.io/)

The PHP version of Pattern Lab is, at its core, a static site generator. It combines platform-agnostic assets, like the [Mustache](http://mustache.github.io/)-based patterns and the JavaScript-based viewer, with a PHP-based "builder" that transforms and dynamically builds the Pattern Lab site. By making it a static site generator, Pattern Lab strongly separates patterns, data, and presentation from build logi.cg
