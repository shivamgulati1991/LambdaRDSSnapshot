//This script creates a manual snapshot of your RDS instance
// Input your RDS instance name and the Snapshot name in the function within the code(lines 14 and 15)
console.log('Initiating snapshot task');

var aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});	//Use the region as per your resources

var rds = new aws.RDS({apiVersion: '2014-10-31'});

exports.handler = function(event, context) {
    
    var timeStamp = Math.floor(Date.now() / 1000);
    var params = {
      DBInstanceIdentifier: '<Name of your RDS instance>',
      DBSnapshotIdentifier: '<Name for the snapshot>-'+timeStamp,    //Snapshot will have the name appended with timestamp
    };
    rds.createDBSnapshot(params, function(err, data) {
        if (err) {
            console.log(err,err.stack);
            context.fail(err);
        } else {
            console.log("Starting snapshot creation...")
            console.log("Snapshot name: "+data.DBSnapshot.DBSnapshotIdentifier);	//print snapshot name
            context.succeed(data);		//output json response
        }
    });
};