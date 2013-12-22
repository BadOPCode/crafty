/*
ehs.js - Shawn Rapp 12/20/2013
Description:
License: GPL version 3.  Read LICENSE for more information.
*/
var EHS = (function() {
        var ehs = {};

        // execute command
        ehs.Execute = function(command, output) {
            var sys = require('sys');
            var exec = require('child_process').exec;
            var child;

            child = exec(command, output.exit_level, output.data, output.error_message);
        };
        
        ehs.ExecuteBlockTillExit = function(command) {
            var output = {};
            
            ehs.Execute()
        }

        return ehs;
}());

console.log(EHS.Execute('ls -R *'));