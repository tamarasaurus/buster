/**
 * Submission
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  types: {
    // location: function(location) {
    //   location = JSON.parse(location);
    //   return (location.latitude && location.longitude);
    // }
  },
  attributes: {
    stop_id: {
      type: 'string',
      required: true
    },
    user_fingerprint: {
      type: 'text',
      required: true
    },
    user_accuracy: {
      type: 'integer',
      required: false
    },
    latitude: {
      type: 'float',
      required: true
    },
    longitude: {
      type: 'float',
      required: true
    },
    route_id: {
      type: 'string',
      required: true
    },
    route_short_name: {
      type: 'string',
      required: true
    },
    late: {
      type: 'boolean',
      required: true
    },
    capacity: {
      type: 'integer',
      required: true
    }
  },

  beforeCreate: function(values, cb){
    console.log(values);
    cb();
  }
  


};

