#!/usr/bin/env node
/***
 * asmodeus.js
 * 
 * Asmodeus Server
 * License: GPL v3
 * Authors: Sean Arnold, Shawn Rapp
 * Date: 2013-12-19
 */

// WARNING: Everything above this line will be executed twice
require('daemon')();

var cluster = require('cluster');


// global to define super daemon configuration and environment info
var mghs = { config:{}, info:{} };

//stuff os into MGHS... cuz Singleton and globals are fun!
mghs.info = require('os');
mghs.config = require('config');

//fetch number of cpus
mghs.info.number_of_cpus = mghs.info.cpus().length;

/**
 * createWorker - Shawn Rapp 2013-12-29
 * Creates a worker of the specified type.
 * @param {string} worker_type The type of worker to start.
 */
function createWorker(worker_type) {
    if (cluster.isMaster) {
        // Fork a worker if running as cluster master
        var child = cluster.fork();

        // Respawn the child process after exit
        // (ex. in case of an uncaught exception)
        child.on('exit', function (code, signal) {
            createWorker(worker_type);
        });
    }
    // this process is a worker not master
    else {
        var ehs = require("library/ehs");
        var start_script = worker_type+'/start.js';
        if (ehs.FileExists(start_script)) {
            require(start_script);
        } else {
            console.error("Start script "+worker_type+" is missing.");
        }
    }
}

/**
 * createWorkers - Shawn Rapp 2013-12-29
 * Creates n amount of workers of the specified type.
 * @param {string} worker_type The type of worker
 * @param {number} n Number of workers to create.
 */
function createWorkers(worker_type, n) {
    while (n-- > 0) {
        createWorker(worker_type);
    }
}

/**
 * terminateAllWorkers - Shawn Rapp 2013-12-29
 * Sends the signal to terminate all workers and remove all event listeners
 * @param {number} signal Terminate signal to send
 */
function terminateAllWorkers(signal) {
    var uniqueID,
    worker;

    for (uniqueID in cluster.workers) {
        if (cluster.workers.hasOwnProperty(uniqueID)) {
            worker = cluster.workers[uniqueID];
            worker.removeAllListeners();
            worker.process.kill(signal);
        }
    }
}

/**
 * Restarts the workers.
 */
process.on('SIGHUP', function () {
  killAllWorkers('SIGTERM');
  createWorkers(numCPUs * 2);
});

/**
 * Gracefully Shuts down the workers.
 */
process.on('SIGTERM', function () {
  killAllWorkers('SIGTERM');
});

// Create two children for each CPU
createWorkers(numCPUs * 2)