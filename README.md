# Installing

Before running the following commands, make sure you have navigated into the project root directory first:

    $ cd react-har-viewer

Install the `npm` modules:

    $ npm install

# Running

## `webpack-dev-server`

Run on a local development server (and watch for changes):

    # if necessary, change port number in `package.json`
    $ npm run dev

*The above command is the recommended way to run the application locally, since the repo does not contain the actual* `build/app.bundle.js` *file.*

You should now be able to access your application at <http://localhost:8082/build>

## `webpack` + `http-server`

Alternatively, you can also run it using npm's `http-server`, but make sure that you have run the npm script for building and bundling:

    $ npm run build    # doesn't watch for changes
    $ npm run watch    # watches for changes

Run `http-server`:

    $ npm install http-server        # if it isn't installed yet
                                     # (add -g parameter for global installation)

    $ http-server build -p 8082      # feel free to modify options as appropriate

You should now be able to access your application at <http://localhost:8082>
