require('dotenv').config();
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const url = "https://www.instagram.com/accounts/login/?source=auth_switcher";
  await page.goto(url);

//   Wait some time 
  await page.waitFor(() => document.querySelectorAll('input').length);

  await page.type('[name=username]', process.env.IG_ID, {delay: 20});
  await page.type('[name=password]', process.env.IG_PASSWORD, {delay: 30});

  await page.waitFor(1235);
  await page.click('button[type="submit"]');

  await page.waitFor(10000);

  await browser.close();
})();