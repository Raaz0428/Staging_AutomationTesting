import { Given, When, Then } from "@cucumber/cucumber";
import { page } from '../support/hooks';
import { expect } from "@playwright/test";
import { login } from "./loginpages";
import dotenv from "dotenv";

dotenv.config({
  path: `.env`
});

const MAX_RETRIES = 3;

Given('User navigates to the Tailtrix application and logs in', async () => {
  await retryLogin(MAX_RETRIES);
});

async function retryGoto(maxRetries: number) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      // Navigate to the base URL
      await page.goto(process.env.Base_url!);
      await page.waitForTimeout(2000);

      // Check if page loaded successfully
      if (await page.title()) {
        console.log('Page loaded successfully');
        return;
      } else {
        throw new Error('Page load failed');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Page load attempt ${attempt + 1} failed: ${error.message}`);
      } else {
        console.error(`Page load attempt ${attempt + 1} failed with an unknown error`);
      }

      if (attempt < maxRetries - 1) {
        console.log('Retrying page load...');
      } else {
        console.error('Max retries reached. Page load failed.');
        throw error;
      }
    }
    attempt++;
  }
}

async function retryLogin(maxRetries: number) {
  await retryGoto(MAX_RETRIES);

  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      // Fill in email
      await page.locator(login.Inputfeild.email).fill(process.env.User_name!);
      await page.waitForTimeout(1000);

      // Fill in password
      await page.locator(login.Inputfeild.password).fill(process.env.Pass!);
      await page.waitForTimeout(1000);

      // Click the login button
      await page.locator(login.Button.login).click();
      await page.waitForTimeout(8000);

      // Check if login was successful by verifying the presence of an element only visible after login
      if (await page.locator("//span[@title='Global']").isVisible()) {
        console.log('Login successful');
        return;
      } else {
        throw new Error('Login failed');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Login attempt ${attempt + 1} failed: ${error.message}`);
      } else {
        console.error(`Login attempt ${attempt + 1} failed with an unknown error`);
      }

      if (attempt < maxRetries - 1) {
        console.log('Retrying login...');
      } else {
        console.error('Max retries reached. Login failed. Possible password change.');
        throw error;
      }
    }
    attempt++;
  }
}
