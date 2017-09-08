/**
 * Device.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    insteon_id: { type: 'string', primaryKey: true, required: true },
    type: { type: 'string', required: true },
    name: { type: 'string', required: true },
    description: { type: 'text' },
    udn: { type: 'string', required: true, unique: true }
  }
}
