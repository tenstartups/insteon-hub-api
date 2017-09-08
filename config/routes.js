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
  'get /api/device/:insteon_id': 'DeviceController.show',
  'post /api/device/:insteon_id': 'DeviceController.create',
  'patch /api/device/:insteon_id': 'DeviceController.update',
  'delete /api/device/:insteon_id': 'DeviceController.destroy',

  // Switch controller actions
  'post /api/switch/:insteon_id/on': 'SwitchController.on',
  'post /api/switch/:insteon_id/off': 'SwitchController.off',
  'post /api/switch/:insteon_id/status': 'SwitchController.status',

  // Dimmer controller actions
  'post /api/dimmer/:insteon_id/on': 'DimmerController.on',
  'post /api/dimmer/:insteon_id/off': 'DimmerController.off',
  'post /api/dimmer/:insteon_id/level/:level': 'DimmerController.level',
  'post /api/dimmer/:insteon_id/brighten': 'DimmerController.brighten',
  'post /api/dimmer/:insteon_id/dim': 'DimmerController.dim',
  'post /api/dimmer/:insteon_id/status': 'DimmerController.status',

  // Fan controller actions
  'post /api/fan/:insteon_id/status': 'FanController.status',
  'post /api/fan/:insteon_id/off': 'FanController.off',
  'post /api/fan/:insteon_id/low': 'FanController.low',
  'post /api/fan/:insteon_id/medium': 'FanController.medium',
  'post /api/fan/:insteon_id/high': 'FanController.high'
}
