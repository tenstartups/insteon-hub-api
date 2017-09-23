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
  'post /api/fan/:insteonId/command/light_on': 'FanController.lightOn',
  'post /api/fan/:insteonId/command/light_off': 'FanController.lightOff',
  'post /api/fan/:insteonId/command/light_level/:level': 'FanController.lightLevel',
  'post /api/fan/:insteonId/command/brighten_light': 'FanController.brightenLight',
  'post /api/fan/:insteonId/command/dim_light': 'FanController.dimLight',
  'post /api/fan/:insteonId/command/fan_off': 'FanController.fanOff',
  'post /api/fan/:insteonId/command/fan_low': 'FanController.fanLow',
  'post /api/fan/:insteonId/command/fan_medium': 'FanController.fanMedium',
  'post /api/fan/:insteonId/command/fan_high': 'FanController.fanHigh'
}
