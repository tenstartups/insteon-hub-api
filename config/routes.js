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
  'get /api/device/:insteonId': 'DeviceController.show',
  'post /api/device/:insteonId': 'DeviceController.create',
  'patch /api/device/:insteonId': 'DeviceController.update',
  'delete /api/device/:insteonId': 'DeviceController.destroy',

  // Switch controller actions
  'post /api/switch/:insteonId/on': 'SwitchController.on',
  'post /api/switch/:insteonId/off': 'SwitchController.off',
  'post /api/switch/:insteonId/status': 'SwitchController.status',

  // Dimmer controller actions
  'post /api/dimmer/:insteonId/on': 'DimmerController.on',
  'post /api/dimmer/:insteonId/off': 'DimmerController.off',
  'post /api/dimmer/:insteonId/level/:level': 'DimmerController.level',
  'post /api/dimmer/:insteonId/brighten': 'DimmerController.brighten',
  'post /api/dimmer/:insteonId/dim': 'DimmerController.dim',
  'post /api/dimmer/:insteonId/status': 'DimmerController.status',

  // Fan controller actions
  'post /api/fan/:insteonId/status': 'FanController.status',
  'post /api/fan/:insteonId/off': 'FanController.off',
  'post /api/fan/:insteonId/low': 'FanController.low',
  'post /api/fan/:insteonId/medium': 'FanController.medium',
  'post /api/fan/:insteonId/high': 'FanController.high'
}