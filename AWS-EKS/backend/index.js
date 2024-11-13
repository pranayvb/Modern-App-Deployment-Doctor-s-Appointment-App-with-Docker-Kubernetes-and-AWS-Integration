require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');
const AWS = require('aws-sdk');
const cors = require("cors");
const corsOptions = {
  origin: '*', // Replace '*' with specific domains if you want to restrict access
  methods: ['GET', 'POST'], // Allow only GET and POST methods
  allowedHeaders: ['Content-Type'], // Specify any headers you want to allow
};
const app = express();
app.use(express.json());
app.use(cors(corsOptions));

const secretsClient = new SecretsManagerClient({ region: 'us-east-1' }); // Specify your region
const SECRET_ARN = "arn:aws:secretsmanager:us-east-1:977099003828:secret:prod/doctor/dynamo-YFSvFy"; // Replace with your actual secret ARN

// Route to check if the backend is running
app.get('/', (req, res) => {
  res.status(200).send('Backend is running');
});

// Function to load AWS credentials
async function loadAWSCredentials() {
  try {
    // Attempt to retrieve credentials from Secrets Manager
    const command = new GetSecretValueCommand({ SecretId: SECRET_ARN });
    const secret = await secretsClient.send(command);
    const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } = JSON.parse(secret.SecretString);

    // Set the AWS credentials
    AWS.config.update({
      region: 'us-east-1',
      accessKeyId: AWS_ACCESS_KEY_ID,
      secretAccessKey: AWS_SECRET_ACCESS_KEY
    });

    console.log('AWS credentials loaded from Secrets Manager');
  } catch (error) {
    console.error('Failed to load AWS credentials from Secrets Manager:', error);

    // Fallback to dotenv if Secrets Manager fails
    if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
      AWS.config.update({
        region: 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      });

      console.log('AWS credentials loaded from .env file');
    } else {
      throw new Error('AWS credentials not found in Secrets Manager or .env file');
    }
  }
}

// Initialize AWS services after loading credentials
loadAWSCredentials().then(() => {
  const dynamodb = new AWS.DynamoDB.DocumentClient();
  const dynamodbRaw = new AWS.DynamoDB(); // For describeTable method
  const TABLE_NAME = 'Appointments';

  // Route to get all appointments
  app.get('/appointments', async (req, res) => {
    const params = {
      TableName: TABLE_NAME
    };

    try {
      const data = await dynamodb.scan(params).promise();
      res.json(data.Items);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: 'Could not retrieve appointments' });
    }
  });

  // Route to create a new appointment
  app.post('/appointments', async (req, res) => {
    const params = {
      TableName: TABLE_NAME,
      Item: {
        id: Date.now().toString(), // Using timestamp as a simple unique ID
        patientName: req.body.patientName,
        doctorName: req.body.doctorName,
        date: req.body.date
      }
    };

    try {
      await dynamodb.put(params).promise();
      res.json(params.Item);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: 'Could not create appointment' });
    }
  });

  // Health check route for Express app and DynamoDB
  app.get('/health', async (req, res) => {
    const params = {
      TableName: TABLE_NAME
    };

    try {
      // Check DynamoDB connection by describing the table
      await dynamodbRaw.describeTable(params).promise();
      res.status(200).json({ status: 'Healthy', service: 'Express & DynamoDB' });
    } catch (error) {
      console.error("DynamoDB Health Check Failed:", error);
      res.status(500).json({ status: 'Unhealthy', service: 'DynamoDB', error: error.message });
    }
  });

  // Start the server
  app.listen(3000, () => {
    console.log('Server running on port 3000');
  });
}).catch(error => {
  console.error("Application startup failed:", error);
});
