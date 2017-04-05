# To set up a new application for building with Webpack:

1. Ensure node, npm, and bower is installed
2. Use the following files from this repository as a starting point:  
```
.babelrc
webpack.config.js
package.json
resources/assets
```
3. Configure the above as necessary, which will mainly be tweaking `webpack.config.js`

Defaults are:
- Context, `./resources/assets` which is the base directory that Webpack works from.
- Bower installs *must* be performed in and from `/resources/assets`.
- The build process separates vendor from application content (see `vendor` and `app` entry points) to ensure that
changes to custom-developed code don't cause third-party libraries to be invalidated.

# Installing:
```
$ cd resources/assets          # get ready to install packages from Bower
$ bower init; bower install # install
$ cd ../..                  # back to initial directory
$ npm install --save        # install all Node stuff, including Webpack and its plugins
``` 
**Note:** the default `resources/assets/bower.json` brings in bootstrap 4 alpha, font-awesome and intercooler-js, none of which may be needed.

# Building:
Output goes to by default into `public/assets`
The build process removes outdated .css and .js files, but only once.

1. To compile files once:
```
$ npm run dev
```
2. To compile files and watch for changes:
```
$ npm run watch
```
**Note:** this **does not** remove old .css and .js files beyond the initial build.

3. To prepare for production, which minifies everything
```
$ npm run production
```
# Other notes

Files produced by building have hashes to aid with cache busting.

There is a `public/assets/manifest.json` which can be used to create server-side code to bring in the correct file given a `filename.ext` filename.

See example of this in `manifest-parser.php`

# With thanks to:

- https://blog.madewithenvy.com/getting-started-with-webpack-2-ed2b86c68783#.hyxiqhrhk
- http://webpackcasts.com