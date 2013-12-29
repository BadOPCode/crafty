//Environment is a production environment
if (process.env.NODE_ENV == "production") {
    exports.MongoURL = 'mongodb://nodejitsu_badopcode:9i61f5scada1kuvseoisc73k3u@ds051947.mongolab.com:51947/nodejitsu_badopcode_nodejitsudb9853359572';
    exports.HTTPListenPort = 80;
}
//Environment is a test developer environment
else {
//    exports.MongoURL = 'mongodb://127.0.0.1/tp';
    exports.MongoURL = 'mongodb://nodejitsu_badopcode:9i61f5scada1kuvseoisc73k3u@ds051947.mongolab.com:51947/nodejitsu_badopcode_nodejitsudb9853359572';
//    exports.HTTPListenPort = 3000;
//    exports.HTTPListenPort = process.env.PORT;
};