/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  // '/': {
  //   view: 'homepage'
  // }

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  * If a request to a URL doesn't match any of the custom routes above, it   *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

  // Device controller actions
  'get /api/devices': 'DeviceController.index',
  'get /api/device/:id': 'DeviceController.show',
  'patch /api/device/:id': 'DeviceController.update',

  // Switch controller actions
  'get /api/switch/:id/status': 'SwitchController.status',
  'post /api/switch/:id/refresh': 'SwitchController.refresh',
  'post /api/switch/:id/on': 'SwitchController.on',
  'post /api/switch/:id/off': 'SwitchController.off',

  // Dimmer controller actions
  'get /api/dimmer/:id/status': 'DimmerController.status',
  'post /api/dimmer/:id/refresh': 'DimmerController.refresh',
  'post /api/dimmer/:id/on': 'DimmerController.on',
  'post /api/dimmer/:id/off': 'DimmerController.off',
  'post /api/dimmer/:id/level/:level': 'DimmerController.level',
  'post /api/dimmer/:id/brighten': 'DimmerController.brighten',
  'post /api/dimmer/:id/dim': 'DimmerController.dim',

  // Fan controller actions
  'get /api/fan/:id/status': 'FanController.status',
  'post /api/fan/:id/refresh': 'FanController.refresh',
  'post /api/fan/:id/off': 'FanController.off',
  'post /api/fan/:id/low': 'FanController.low',
  'post /api/fan/:id/medium': 'FanController.medium ',
  'post /api/fan/:id/high': 'FanController.high'
}
