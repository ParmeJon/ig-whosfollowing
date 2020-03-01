const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({headless: false});
  const page = await browser.newPage();
  const url = "https://www.instagram.com/accounts/login/?source=auth_switcher";
  await page.goto(url);

  await page.waitFor(3000);

  await browser.close();
})();