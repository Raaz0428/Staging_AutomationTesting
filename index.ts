import * as fs from 'fs';
import * as path from 'path';
import moment from 'moment';
import cucumberHtmlReporter from 'cucumber-html-reporter';

const reportFile = path.join(__dirname, 'reports', 'cucumber_report.json');
const outputHtmlFile = path.join(__dirname, 'reports', 'cucumber_report_bootstrap.html');

if (fs.existsSync(reportFile)) {
  const options: cucumberHtmlReporter.Options = {
    theme: 'bootstrap',
    jsonFile: reportFile,
    output: outputHtmlFile,
    reportSuiteAsScenarios: true,
    launchReport: true,
    metadata: {
      Environment: 'STAGING',
      Browser: 'Chromium',
      Platform: 'Windows 11',
      Url: 'https://staging.talitrix.com/login',
      ExecutionDate: moment().format('MMMM Do YYYY, h:mm:ss a'),
    },
  };

  cucumberHtmlReporter.generate(options, () => {
    console.log(`Cucumber HTML report generated at: ${outputHtmlFile}`);
  });
} else {
  console.error('Cucumber JSON report not found. Please run your tests first.');
}
