import { Given, When, Then,  } from "@cucumber/cucumber";
import {page} from '../support/hooks';
import { expect } from "@playwright/test";
import {login} from "../locators/loginpages";
import dotenv from "dotenv";



dotenv.config({
  path:`.env`
})

Given('User navigative to Tailtrix application',  async ()=>{
  await page.goto(process.env.Base_url!);
  await page.waitForTimeout(2000);
});

When('User enter valid Email address', async ()=>{
  await page.locator(login.Inputfeild.email).fill(process.env.User_name!);
  await page.waitForTimeout(4000);
});

When('User enter valid password', async ()=>{
  await page.locator(login.Inputfeild.password).fill(process.env.Pass!);
});

Then('User able to click on Login button', async ()=>{
  await page.locator(login.Button.login).click();
  await page.waitForTimeout(10000);
 
});
When('User is able to render Talitrix Application',async ()=>{
  await expect(page.locator(login.Button.Global)).toHaveText('Global');
  await page.waitForTimeout(6000);
});

Then('User should be able to go to the right top of the page and click on manage account icon',async ()=>{
  await page.locator(login.Button.manageaccount).click();
  await page.waitForTimeout(1000);
})

When('User should be able to click on the icon to view below records Profile Settings Logout',async ()=>{
  await expect(page.locator(login.Button.profile)).toHaveText('Profile');
  await expect(page.locator(login.Button.settings)).toHaveText('Settings');
  await expect(page.locator(login.Button.logout)).toHaveText('Logout');
  await page.waitForTimeout(1000);
})

Then('User should be able to click on Logout button',async ()=>{
  await page.locator(login.Button.logout).click();
  await page.waitForTimeout(1000);
})

When('User should be able to Logout from the application and should appear login page',async ()=>{
  await expect(page.locator(login.Button.logtoaccount)).toHaveText('Log in to your account');
  await page.waitForTimeout(2000);
})