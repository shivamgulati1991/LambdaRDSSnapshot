# Schedule RDS snapshots with AWS Lambda function

### Pre-requisites and General setup:

1. The IAM role the function should have access to the RDS resources.
2. The function needs access to RDS resources as well as the internet, hence, the Lambda function has to be VPC enabled. To also allow internet access, please create or check the following if already created.
    1. The VPC should have two or more private subnets with an associated route for 0.0.0.0/0 on the NAT Gateway. Please note that having an Internet Gateway for these subnets will not work.
    2. Choose the above subnets while creating your Lambda function.
    3. The Security Group you choose for the Lambda function should be allowed in the inbound rules of the RDS security group.

### Node.js script

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


### Testing the function

1. Next, create an empty test event for testing the above function. If the test is successful, proceed with the trigger setup. If the test fails, check the CloudWatch logs for the errors. Some sample issues I faced:

If the function is timing out, try to increase the default timeout from 3 seconds to 10 seconds. If it still times out, there's a good chance the issue is with the VPC setup for the Lambda function and the function is not able to access the internet.
If the function gives an error that it isn't able to access RDS or any specific resources, please check the IAM role.

### Trigger setup

Configure Cloudwatch events for this function.
Create a new rule with the schedule expression as per your schedule you want to set. For example, if you need a snapshot every 30 minutes, your schedule expression would be "30 minutes".
Enable the trigger and save the function.
Please refer to the Lambda documentation for more details if you have some issues while creating the function. The script is also attached with the article for a direct download.

Helpful links:

Lambda task creation (https://docs.aws.amazon.com/lambda/latest/dg/get-started-create-function.html)
Node.js AWS APIs (https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html)
