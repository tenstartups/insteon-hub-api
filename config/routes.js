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

  // SmartThingsAccess controller actions
  'patch /api/smart_things/token/:token': 'SmartThingsController.token',

  // Device controller actions
  'get /api/devices': 'DeviceController.index',
  'get /api/device/:insteonId': 'DeviceController.show',
  'post /api/device/:insteonId': 'DeviceController.create',
  'patch /api/device/:insteonId': 'DeviceController.update',
  'delete /api/device/:insteonId': 'DeviceController.destroy',

  // Switch controller actions
  'get /api/switch/:insteonId/status': 'SwitchController.status',
  'post /api/switch/:insteonId/command/refresh': 'SwitchController.refresh',
  'post /api/switch/:insteonId/command/on': 'SwitchController.on',
  'post /api/switch/:insteonId/command/off': 'SwitchController.off',

  // Dimmer controller actions
  'get /api/dimmer/:insteonId/status': 'DimmerController.status',
  'post /api/dimmer/:insteonId/command/refresh': 'DimmerController.refresh',
  'post /api/dimmer/:insteonId/command/on': 'DimmerController.on',
  'post /api/dimmer/:insteonId/command/off': 'DimmerController.off',
  'post /api/dimmer/:insteonId/command/level/:level': 'DimmerController.level',
  'post /api/dimmer/:insteonId/command/brighten': 'DimmerController.brighten',
  'post /api/dimmer/:insteonId/command/dim': 'DimmerController.dim',

  // Fan controller actions
  'get /api/fan/:insteonId/status': 'FanController.status',
  'post /api/fan/:insteonId/command/refresh': 'FanController.refresh',
  'post /api/fan/:insteonId/command/off': 'FanController.off',
  'post /api/fan/:insteonId/command/low': 'FanController.low',
  'post /api/fan/:insteonId/command/medium': 'FanController.medium',
  'post /api/fan/:insteonId/command/high': 'FanController.high'
}
