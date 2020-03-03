require('dotenv').config();
const puppeteer = require('puppeteer');

(async () => {

  const myFollowers = []
  const myFollowing = []
  const browser = await puppeteer.launch({headless: false});
  try {
      const page = await browser.newPage();
      const url = "https://www.instagram.com/accounts/login/?source=auth_switcher";
      await page.goto(url);
    
    //   Wait some time 
      await page.waitFor(() => document.querySelectorAll('input').length);
    
      await page.type('[name=username]', process.env.IG_ID, {delay: 20});
      await page.type('[name=password]', process.env.IG_PASSWORD, {delay: 30});
    
      await page.waitFor(1235);
      await page.click('button[type="submit"]');
      await page.waitFor(".aOOlW");
      await page.evaluate(() => {
          document.querySelectorAll(".aOOlW")[1].click()
      })
      await page.waitFor(1500);
      await page.click(`a[href='/${process.env.IG_ID}/']`);
      await page.waitFor('.-nal3', {delay: 20});
      await page.evaluate(() => {
          const headerTabs = document.getElementsByClassName('-nal3');
          headerTabs[1].click()
      })
      await page.waitFor(".PZuss");
      await page.waitFor(10000);
   
  } catch (err) {
      console.error(err.message);
  } finally {
      await browser.close();
  }
})();