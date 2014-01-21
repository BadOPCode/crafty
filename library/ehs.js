/**
 * ehs.js - Shawn Rapp 2013-12-20
 * @fileOverview Environment Handling System, defines methods to run native 
 * applications; copy, move, delete, link files; set, read, remove environment
 * settings
 * @license GPL version 3.  Read LICENSE for more information.
*/

/**
 * ehs.Execute - Shawn 2013-12-22
 * execute command sets IO stream to a callback as well as a trigger for 
 * termination.
 * @param {string} command The command to execute
 * @param {string} args The arguments to pass to command
 * @param {object} cb_stdout The callback function to call for output
 * @param {object} cb_exit The callback function to call when program exits.
 */
exports.Execute = function(command, args, cb_stdout, cb_exit) {
    var spawn = require('child_process').spawn,
        child= spawn(command,args),
        me = this;
        
    me.exit = 0;
    child.stdout.on('data', function (data) { cb_stdout(me, data) });
    child.stdout.on('end', function() { cb_exit(me) });
};


/**
 * ehs.DeleteFile - Shawn 2013-12-22
 * @param {string} target_file The file path of file to delete.
 */
exports.DeleteFile = function(target_file) {
    var fs = require("fs");
    fs.unlink(target_file,  function(err){
       if (err) return false;
       return true;
    });
};

/**
 * ehs.CopyFile - Shawn 2013-12-22
 * @param {string} source_file The source file to copy.
 * @param {string} target_file The path of where to copy it.
 */
exports.CopyFile = function(source_file, target_file) {
    var fs = require('fs');
    fs.createReadStream(source_file).pipe(fs.createWriteStream(target_file));
};

/**
 * ehs.Movefile - Shawn 2013-12-22
 * @param {string} source_file
 * @param {string} target_file
 */
exports.MoveFile = function(source_file, target_file) {
    if (ehs.CopyFile(source_file, target_file)){
        if (ehs.DeleteFile(source_file)) return true;
        return false;
    } else {
        return false;
    }
};

/**
 * ehs.FileExists - Shawn 2013-12-22
 * @param {string} target_file
 */
exports.FileExists = function(target_file) {
    var fs = require('fs');

    fs.exists(target_file, function(exists){
        return exists;
    });
    
};
