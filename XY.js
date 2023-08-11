const puppeteer = require("puppeteer");
const Tesseract = require("tesseract.js");
const readline = require("readline");
const fs = require('fs');

(async () => {


  const rl = readline.createInterface(process.stdin, process.stdout);


  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    executablePath: '/usr/bin/chromium',
    args: ["--no-sandbox", "--disable-infobars"],

    ignoreDefaultArgs: ["--enable-automation", "--disable-extensions"],
  });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(0);
  // Navigate the page to a URL
  await page.goto("https://www.grandx.com/");

  let search_icon = await page.$x(
    "/html/body/div[2]/div[3]/div[1]/ul/li[1]/div/img"
  );
  await search_icon[0].click();

  let Game = await page.$x(
    "/html/body/div[2]/div[3]/div[1]/section[4]/nav/div/div[173]/a"
  );
  await Game[0].click();

  await new Promise(resolve => {
    rl.question("START ? ", resolve)
  })

  let frame = await page.$('#gameframe');
  let BOX = await frame.boundingBox()
  let CENTER_POINT = await frame.clickablePoint()
  console.log(BOX)
  console.log(CENTER_POINT)



})();


