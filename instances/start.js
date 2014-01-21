/***
 * instances/start.js - Shawn Rapp 2014-1-4
 * @fileOverview Entry point for instance worker daemon
 * @license GPL version 3.  Read LICENSE for more information.
 */

var
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Obj_ID = Schema.Schema;
    
var
    Instances = mongoose.module('instances', new Schema({
        /** instance identifier */
        id: String,
        /** current state of instance */
        state: String,
        /** short identifier of the game based on repository entry */
        game_type: String,
        /** person directly responsible for this server instance */
        owner_id: String
    }));


Instances.find(function(err, result) {
    require('library/ehs');
    if (result.state == 'run') { // state is set to run
        var instance_path = 'instance/' + result.game_type + '/' + result.id + '/';
        require(instance_path + 'start.js');
    }
});