---
title: "Cache busting your assets"
heading: "Cache busting<br/> your assets"
desc: "Let's learn how to bust the cache wide open with Webpack & Gulp."
cover: "cover-cache-busting-your-assets.svg"
facebook: "facebook-cache-busting-your-assets.png"
twitter: "twitter-cache-busting-your-assets.png"
date: "13 October 2018 12:45 UTC"
author: "Ben Rogerson"
---

<div class="intro">"Ahh&hellip; you need to hard refresh to see the&nbsp;site&nbsp;changes."</div>

I've given those awkward instructions far too many times. Each time it could have been avoided if I had just remembered to increment a version number on my dodgy query string cache buster.

Thankfully, I don't need to do that anymore! I've automated the cache busting process within both Webpack and Gulp and I wanted to share a solution for both.

So here's how we're going to bust this cache:

1. During the build process our cachable assets will have a content based hash added to their filename. eg: `app.js` will become `app-1decbe9347.js`

2. A `.json` manifest file will be created containing mappings between our hashed and non-hashed asset filenames

3. Lastly, we'll use plugin functions to fetch the renamed assets in our twig templates


## Set asset cache times

To make any of this work your assets should have their caching expiry set. One year is the common recommendation. Here's a `.htaccess` example that caches stylesheets, scripts and favicons:

```bash
<IfModule mod_expires.c>
    # Enable expirations
    ExpiresActive On
    # Set asset expirations
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/x-icon "access plus 1 month"
</IfModule>
```

You can check your assets are caching with [browser caching checker](https://www.giftofspeed.com/cache-checker/).


## Cache busting with Webpack

Setting up cache busting within a Webpack workflow doesn't require too much work.

First we need to install the [webpack-manifest-plugin](https://github.com/danethurber/webpack-manifest-plugin):

```bash
npm install webpack-manifest-plugin --save-dev
# or
yarn add webpack-manifest-plugin --dev
```

Your manifest should be generated in development and production environments. So in your main webpack config, require the plugin and add it to your plugins list.

```js
const ManifestPlugin = require('webpack-manifest-plugin');

{
    plugins: [
        ...
        new ManifestPlugin({
            filename: 'manifest.json'
        })
    ]
}
```

### Configure the craft-twigpack plugin

Now we'll install and activate the [craft-twigpack plugin](https://github.com/nystudio107/craft-twigpack). Either install it within the Craft plugins area or by command line:

```bash
composer require nystudio107/craft-twigpack
./craft install/plugin nystudio107/craft-twigpack
```

Now create `config/twigpack.php` and add this configuration:

```php
<?php

return [
    // Global settings
    '*' => [
        // If `devMode` is on, use webpack-dev-server
        // for all for HMR (hot module reloading)
        'useDevServer' => false,
        // Manifest file names
        'manifest' => [
            'legacy' => 'manifest.json',
            'modern' => 'manifest.json',
        ],
        // Public server config
        'server' => [
            'manifestPath' => '/',
            'publicPath' => '/',
        ],
        // webpack-dev-server config
        'devServer' => [
            'manifestPath' => 'http://localhost:8080/',
            'publicPath' => 'http://localhost:8080/',
        ],
        // Local files config
        'localFiles' => [
            'basePath' => '@webroot/',
            'criticalPrefix' => 'dist/criticalcss/',
            'criticalSuffix' => '_critical.min.css',
        ],
    ],
    // Live (production) environment
    'live' => [
    ],
    // Staging (pre-production) environment
    'staging' => [
    ],
    // Local (development) environment
    'local' => [
        // If `devMode` is on, use webpack-dev-server
        // for all HMR (hot module reloading)
        'useDevServer' => true,
    ],
];
```

Now after you run the development server, you should see the newly generated manifest at `http://localhost:8080/manifest.json` containing the path mappings.

It should look similar to this:

```json
{
  "app.js": "assets/build/app.js",
}
```

### Update asset references in your templates

Now we'll update the cachable asset references in our templates with twigpacks include functions:

```html
<!-- Scripts are loaded like this -->
{{ craft.twigpack.includeJsModule("app.js") }}

<!-- and stylesheets like this -->
{{ craft.twigpack.includeCssModule("style.css") }}
```
Read more about [how to use Twigpack](https://github.com/nystudio107/craft-twigpack#using-twigpack) on Github.

If you look at the source you'll see that the asset has been replaced with the hashed path in `manifest.json`.

<hr>

And you're done! You now have automatic cache busting assets in your Webpack build.


## Cache busting with Gulp

Here's one of the ways we can add cache busting to a Gulp workflow.

First we need to install some packages to help generate our versioned assets. The [gulp-rename](https://github.com/hparra/gulp-rename) plugin will be used to prepare the filename for the manifest and [gulp-rev](https://github.com/sindresorhus/gulp-rev) will be used to create the manifest:

```bash
npm install gulp-rename gulp-rev --save-dev
```

In each of our gulp tasks containing cachable assets, we need to call the `rev()` function before the stream is saved to the destination.

The following Gulp task will duplicate `app.js` to the build folder and create paths within the versions file.

```js
const gulp = require('gulp');
const rename = require('gulp-rename');
const rev = require('gulp-rev');

gulp.task('scripts', () => (
    // Select the file to work with
    gulp.src('src/js/app.js')
    // Set the asset output path
    .pipe(rename({dirname: 'public/assets/js'}))
    // Start the rev 'listener'
    .pipe(rev())
    // Save the script
    .pipe(gulp.dest('.'))
    // Remove 'public' from the asset name
    .pipe(gulp.rename(path =>
        path.dirname = path.dirname.replace('public', '')
    ),
    // Define the manifest filename and merge with the
    // existing manifest
    .pipe(gulp.rev.manifest('rev-manifest.json', {
        merge: true,
        base: '.',
    }))
    // Save rev-manifest file
    .pipe(gulp.dest('.'))
));
```

Running the task will create a `rev-manifest.json` file that contains the mappings between the assets. It should look similar to this:

```json
{
  "build/js/app.js": "build/js/app-1decbe9347.js",
}
```

### Configure the asset-rev plugin

Now let's install and activate the [asset-rev plugin](https://github.com/clubstudioltd/craft-asset-rev). Either install it within the Craft plugins area or by command line:

```bash
composer require clubstudioltd/craft-asset-rev
./craft install/plugin assetrev
```

Now open `config/assetrev.php` and update the config to these values:

```php
{
    'manifestPath' => 'rev-manifest.json',
    'assetsBasePath' => '',
    'assetUrlPrefix' => '/',
}
```

### Reference assets with the rev function

Now we'll update the cachable asset references in our templates with the `rev` function:

```html
<script src="{{ rev('build/js/app.js') }}"></script>
```

If you look at the source you'll see that the asset has been replaced with the hashed path in `rev-manifest.json`.

<hr>

Congratulations, you now have automatic cache busting assets in your Gulp build!