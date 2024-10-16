const { exec } = require('child_process');
const cron = require('node-cron');
require('dotenv').config();

const runTests = () => {
  console.log('Running tests...');
  exec('npm test', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
  });
};

const UTC_SCHEDULED_START = process.env.UTC_SCHEDULED_START;

if (UTC_SCHEDULED_START) {
  const [hours, minutes] = UTC_SCHEDULED_START.split(':');
  const cronExpression = `${minutes} ${hours} * * *`;

  console.log(`Scheduling tests to run daily at ${UTC_SCHEDULED_START} UTC`);
  cron.schedule(cronExpression, runTests, {
    scheduled: true,
    timezone: "UTC"
  });
} else {
  console.log('UTC_SCHEDULED_START not set. Running tests immediately.');
  runTests();
}
