require('dotenv').config();
const puppeteer = require('puppeteer');

(async () => {

    const browser = await puppeteer.launch({headless: false});
    try {
      const page = await browser.newPage();
      const url = "https://www.instagram.com/accounts/login/?source=auth_switcher";
      await page.goto(url);
    //   Wait some time 
      await page.waitFor(() => document.querySelectorAll('input').length);
    
    //   Log In
      await page.type('[name=username]', process.env.IG_ID, {delay: 20});
      await page.type('[name=password]', process.env.IG_PASSWORD, {delay: 30});
    
      await page.waitFor(3250);
      await page.click('button[type="submit"]');

    //  Get passed save Info Page
      await page.waitFor('.cmbtv')
      await page.waitFor(".sqdOP.yWX7d.y3zKF");  
      await page.evaluate(() => {
        document.querySelectorAll(".sqdOP.yWX7d.y3zKF")[0].click()
      })

      await page.waitFor(".aOOlW");
      await page.evaluate(() => {
          document.querySelectorAll(".aOOlW")[1].click()
      })
      
      await page.waitFor(5000);
      // TODO: make IG ID dynamic
      console.log(process.env.IG_ID)
      let tagLine = `img[alt="${process.env.IG_ID}\'s profile picture"]`;
      await page.evaluate((tagLine) => {
        document
          .querySelectorAll(tagLine)[1]
          .click();
      }, tagLine)
      await page.waitFor(1000);
      await page.click(`a[href='/${process.env.IG_ID}/']`);
      await page.waitFor('.-nal3', {delay: 20});
      let followingCount = await page.evaluate(() => {
          const headerTabs = document.getElementsByClassName("-nal3");
          return parseInt(headerTabs[2].innerText.split(" ")[0])
      })
      let followersCount = await page.evaluate(() => {
        const headerTabs = document.getElementsByClassName("-nal3");
        return parseInt(headerTabs[1].innerText.split(" ")[0]);
      });

      await page.evaluate(() => {
          const headerTabs = document.getElementsByClassName('-nal3');
          headerTabs[2].click()
      })
      await page.waitFor(5000);

      await scrollToEnd(page, followingCount);
      const iAmFollowing = await page.evaluate(() => {
          const scrollable_div = document.getElementsByClassName("PZuss")[0]
          const followingList = scrollable_div.children
          const followingListArr = [...followingList].map(liElement => liElement.innerText.split(/(\r\n|\n|\r)/gm)[0]);
          return followingListArr
      });

      await page.evaluate(() => {
          document.getElementsByClassName('wpO6b')[1].click()
        });

      await page.evaluate(() => {
        const headerTabs = document.getElementsByClassName("-nal3");
        headerTabs[1].click();
      });
      await page.waitFor(5000);
      
      await scrollToEnd(page, followersCount)
      const myFollowers = await page.evaluate(() => {
        const scrollable_div = document.getElementsByClassName("PZuss")[0];
        const followersList = scrollable_div.children;
        const followersListArr = [...followersList].map(
          liElement => liElement.innerText.split(/(\r\n|\n|\r)/gm)[0]
        );
        return followersListArr;
      });
      let {notFollowingMeBack, imNotFollowingBack} = getFollowData(iAmFollowing, myFollowers);
      console.log('Number of people not following me back', notFollowingMeBack.length)
      console.log('NOT FOLLOWING ME BACK: ', notFollowingMeBack)
      console.log('Number of people I am not following back', imNotFollowingBack.length)
      console.log('I AM NOT FOLLOWING BACK', imNotFollowingBack)
  } catch (err) {
      console.error(err.message);
  } finally {
      await browser.close();
  }
})();

async function scrollToEnd(page, numberOfItems) {
    let items = 0
    // sometimes following list says a certain number but smaller count is returned.
    let lastItemCount
    try {
        while (items < numberOfItems && items !== lastItemCount) {
            console.log('scrolling', items, 'items out of', numberOfItems)
            console.log('items:', items, 'last Item Count:', lastItemCount)
            lastItemCount = items
            items = await page.evaluate(() => {
                let scrollable_div = document.getElementsByClassName("PZuss")[0];
                scrollable_div.scrollIntoView({ block: "end" });
                return document.getElementsByClassName("PZuss")[0].children.length
            })
            await page.waitFor(3000);
        }
    } catch(err) {
        console.error(err)
    }
}

function getFollowData(iAmFollowing, myFollowers) {
    let iAmFollowingObject = {};
    let notFollowingMeBack
    let imNotFollowingBack = []
    iAmFollowing.forEach(following => {
    iAmFollowingObject[following] = false;
    });
    myFollowers.forEach(follower => {
        if(iAmFollowingObject[follower] !== undefined) {
            iAmFollowingObject[follower] = true
        } else {
            imNotFollowingBack.push(follower)
        }
    });
    
    notFollowingMeBack = iAmFollowing.filter(person => !iAmFollowingObject[person])
    
    return {notFollowingMeBack, imNotFollowingBack}
}