#!/usr/bin/node
/*
rcon-cmd.js - Shawn Rapp 2013-12-22
Description: Command line scripte for sending commands to a game instance via
rconsole and getting the server respons to command line console.
Meant to be used for CLI management.
License: GPL version 3.  Read LICENSE for more information.
*/
var Rcon = require('../library/rcon').newHandle;
var rcon = new Rcon();

//retrieve the instance from the command line
var inst = process.argv.slice(2,3);

//look up instance configuration for rcon

rcon.connect("localhost", 25575, "supersecret", onConnected);


function onConnected(err, response){
        if(err){console.error(err);return;}

        console.log("connected", response);

        rcmd = process.argv.slice(3, process.argv.length).join(" ");

        rcon.sendCommand(rcmd, function(err, response){
                console.log(response);
        });


        rcon.end();
}