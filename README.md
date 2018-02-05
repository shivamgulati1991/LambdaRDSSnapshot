# Schedule RDS snapshots with AWS Lambda function

#### Pre-requisites and General setup:

1. The IAM role the function should have access to the RDS resources.
2. The function needs access to RDS resources as well as the internet, hence, the Lambda function has to be VPC enabled. To also allow internet access, please create or check the following if already created.
    1. The VPC should have two or more private subnets with an associated route for 0.0.0.0/0 on the NAT Gateway. Please note that having an Internet Gateway for these subnets will not work.
    2. Choose the above subnets while creating your Lambda function.
    3. The Security Group you choose for the Lambda function should be allowed in the inbound rules of the RDS security group.

#### Node.js script


#### Testing the function

Create an empty test event for testing the above function. If the test is successful, proceed with the trigger setup. If the test fails, check the CloudWatch logs for the errors.

#### Trigger setup

1. Configure Cloudwatch events for this function.
2. Create a new rule with the schedule expression as per your schedule you want to set. For example, if you need a snapshot every 30 minutes, your schedule expression would be "30 minutes".
3. Enable the trigger and save the function.

#### Helpful links:

Lambda task creation (https://docs.aws.amazon.com/lambda/latest/dg/get-started-create-function.html)
Node.js AWS APIs (https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/RDS.html)
