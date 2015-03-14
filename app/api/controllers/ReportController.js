/**
 * SubmissionController
 *
 * @module      :: Controller
 * @description :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
   

  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to SubmissionController)
   */
  _config: {},

  // Later put grades into a prepopulated model
  grades:  {
    // Minimum grades?
    'A': {
      min: '',
      max: '',
      desc: '',
      message: ''
    },
    'B': {
      min: '',
      max: '',
      desc: '',
      message: ''
    },
    'C': {
      min: '',
      max: '',
      desc: '',
      message: ''
    },
    'D': {
      min: '',
      max: '',
      desc: '',
      message: ''
    },
    'E': {
      min: '',
      max: '',
      desc: '',
      message: ''
    },
    'F': {
      min: '',
      max: '',
      desc: '',
      message: ''
    },
  },

  capacity_grades: {

  },

  getReport: function(req, res) {
    if(!req.param('route_id')) {
      res.send('please include the route id');
      return;
    }

    var _this = sails.controllers.report;

    var route = req.param('route_id');
    var submissions = Submission.find()
    .where({
      route_id: route
    }).exec(function(err, subs){

      if(err) {
        res.send(err);
        return;
      }

      var late_count = _this.getLateCount(subs);

      // var report = {
      //   punctGrad: _this.getPunctGrade(subs),
      //   capacity: _this.getCapacityGrade(subs),
      //   late_count: _this.getLateCount(subs),
      //   late_usual_time: _this.getLateTime(subs),
      //   people_count: _this.getPeopleCount(subs),
      //   desc: _this.constructDescription(subs)
      // }

      res.json({
        late: late_count,
        capacity: 5,
        count: 12,
        people: 1
      });

    }); 

   

  },


  getPunctGrade: function() {

  },

  getCapacityGrade: function() {

  },

  getLateCount: function(subs) {
    var count = 0;
    for(i in subs) {
      if (subs[i].late) {
        count = count + 1;
      }
    }
    return count;
  },

  getLateTime: function() {
    // Get all the times it was late
    // Summarise the hour of the day
  },

  getPeopleCount: function() {
    // Find submissions by unique fingerprint
    // Find all submissions and group by fingerprint
  },  

  constructDescription: function() {

  }

  
};

