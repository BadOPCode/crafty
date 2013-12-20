var OS = (function() {
        var os = {};

        // execute command with blocking return output
        os.Execute = function(command) {
                var sys = require('sys');
                var exec = require('child_process').exec;
                var child;
                var output = {};

                child = exec(command, output.exit_level, output.data, output.error_message);

                return output;
        };

        return os;
}());

console.log(OS.Execute('ls -R *'));