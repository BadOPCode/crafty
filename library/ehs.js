/*
ehs.js - Shawn Rapp 2013-12-20
Description: Environment Handling System, defines methods to run native 
applications; copy, move, delete, link files; set, read, remove environment
settings
License: GPL version 3.  Read LICENSE for more information.
*/
var EHS = (function() {
        var ehs = {};

//----------------------------------------------------------------------------
//  ehs.Execute - Shawn 2013-12-22
//  execute command sets IO stream to a callback as well as a trigger for 
//  termination.
//----------------------------------------------------------------------------
        ehs.Execute = function(command, args, cb_stdout, cb_exit) {
            var spawn = require('child_process').spawn,
                child= spawn(command,args),
                me = this;
                
            me.exit = 0;
            child.stdout.on('data', function (data) { cb_stdout(me, data) });
            child.stdout.on('end', function() { cb_exit(me) });
        };


//----------------------------------------------------------------------------
//  ehs.DeleteFile - Shawn 2013-12-22
//----------------------------------------------------------------------------
        ehs.DeleteFile = function(target_file) {
            var fs = require("fs");
            fs.unlink(target_file,  function(err){
               if (err) return false;
               return true;
            });
        };

//----------------------------------------------------------------------------
//  ehs.CopyFile - Shawn 2013-12-22
//----------------------------------------------------------------------------
        ehs.CopyFile = function(source_file, target_file) {
            var fs = require('fs');
            fs.createReadStream(source_file).pipe(fs.createWriteStream(target_file));
        };
        
//----------------------------------------------------------------------------
//  ehs.Movefile - Shawn 2013-12-22
//----------------------------------------------------------------------------
        ehs.MoveFile = function(source_file, target_file) {
            if (ehs.CopyFile(source_file, target_file)){
                if (ehs.DeleteFile(source_file)) return true;
                return false;
            } else {
                return false;
            }
        };
        
        return ehs;
}());