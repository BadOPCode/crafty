#!/usr/bin/env node
/***
 * asmodeus.js - Shawn Rapp 2013-12-19
 * Asmodeus Server
 * @license GPL version 3.  Read LICENSE for more information.
 * @fileOverview Super daemon game hosting server.
 * Project Authors: Sean Arnold (GIBson3), Shawn Rapp (BadOPCode)
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
        this.workerType = worker_type;
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
 * terminateWorker - Shawn Rapp 2014-1-15
 * Terminates the worker specified with a signal.
 * @param {number} uniqueID Unique identifier that specifies the worker position in the cluster stack
 * @param {string} signal The signal to send to process.
 */
function terminateWorker(uniqueID, signal) {
    var worker;
    if (cluster.workers.hasOwnProperty(uniqueID)) {
        worker = cluster.workers[uniqueID];
        worker.removeAllListeners();
        worker.process.kill(signal);
    }
}

/**
 * terminateAllWorkers - Shawn Rapp 2013-12-29
 * Sends the signal to terminate all workers and remove all event listeners
 * @param {number} signal Terminate signal to send
 */
function terminateAllWorkers(signal) {
    var uniqueID;

    for (uniqueID in cluster.workers) {
        terminateWorker(uniqueID, signal);
    }
}

/**
 * resetWorker - Shawn Rapp 2014-1-16
 * Terminates and starts a fresh worker of the same type.
 * @param {number} uniqueID Unique identifier that specifies the worker in the stack to restart
 */
function resetWorker(uniqueID) {
    var worker, worker_type;
    
    worker = cluster.workers[uniqueID];
    worker_type = worker.workerType;
    terminateWorker(uniqueID, 'SIGTERM');
    createWorker(worker_type);
}

/**
 * resetAllWorkers - Shawn Rapp 2014-1-16
 * Resets all workers in cluster stack.
 */
function resetAllWorkers() {
    var uniqueID;

    for (uniqueID in cluster.workers) {
        resetWorker(uniqueID);
    }
}

/**
 * Restarts the workers.
 */
process.on('SIGHUP', function () {
    resetAllWorkers();
});

/**
 * Gracefully Shuts down the workers.
 */
process.on('SIGTERM', function () {
  terminateAllWorkers('SIGTERM');
});

// Create a web child processor
createWorkers('web', mghs.info.number_of_cpus);

// Create a instance manager processor
createWorker('instance');
