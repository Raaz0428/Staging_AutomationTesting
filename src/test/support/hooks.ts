import { Before, BeforeAll, AfterAll, After, setDefaultTimeout, setWorldConstructor, Status, World } from "@cucumber/cucumber";
import { chromium, firefox, Browser, BrowserContext, Page } from "playwright";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import cucumberHtmlReporter from 'cucumber-html-reporter';

let browser: Browser;
let page: Page;
let context: BrowserContext;

setDefaultTimeout(600000);

// CustomWorld class
class CustomWorld extends World {
    public page: Page;
    public browser: Browser;
    public context: BrowserContext;
    public resetCode: string | undefined;

    constructor(options: any) {
        super(options);
        this.page = page;
        this.browser = browser;
        this.context = context;
    }
}

setWorldConstructor(CustomWorld);

// Launch the browser
BeforeAll(async function () {
    dotenv.config();
    const browserType = process.env.BROWSER || 'chromium'; // Default to chrome if not specified

    switch (browserType) {
        case 'chrome':
        case 'gc':
            browser = await chromium.launch({ headless: false, channel: "chrome", args: ['--start-maximized'] });
            break;
        case 'firefox':
        case 'ff':
            browser = await firefox.launch({ headless: false, args: ['--start-maximized'] });
            break;
        default:
            browser = await chromium.launch({ headless: false, args: ['--start-maximized'] });
            break;
    }
});

// Create a new browser context and page per scenario
Before(async function () {
    context = await browser.newContext({ viewport: null });
    page = await context.newPage();
});

// Cleanup after each scenario
After(async function ({ pickle, result }) {
    if (result?.status === Status.FAILED) {
        const screenshotPath = path.join(__dirname, '../../reports/screenshots', `${pickle.name}.png`);
        const image = await page.screenshot({ path: screenshotPath, type: "png" });
        await this.attach(image, "image/png");
    }
    await page.close();
    await context.close();
});

// Function to generate HTML report
function generateHtmlReport() {
    const jsonFile = path.join(__dirname, '../../e2etests/reports/cucumber_report.json');
    if (fs.existsSync(jsonFile)) {
        const options: cucumberHtmlReporter.Options = {
            theme: 'bootstrap',
            jsonFile,
            output: path.join(__dirname, '../../e2etests/reports/cucumber_report_bootstrap.html'),
            reportSuiteAsScenarios: true,
            launchReport: true,
            metadata: {
                "App Version": "1.0.0",
                "Test Environment": "STAGING",
                "Browser": process.env.BROWSER || "Chromium",
                "Platform": "Windows 10"
            }
        };

        cucumberHtmlReporter.generate(options);
    } else {
        console.error(`JSON report file not found at path: ${jsonFile}`);
    }
}

// Close the browser and generate the report
AfterAll(async function () {
    await browser.close();
    generateHtmlReport();
});

export { page, browser, CustomWorld };
