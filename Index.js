const puppeteer = require("puppeteer");
const Tesseract = require("tesseract.js");
const readline = require("readline");
const fs = require('fs');

(async () => {
  const RED_COLORS = [
    "1",
    "3",
    "5",
    "7",
    "9",
    "12",
    "14",
    "16",
    "18",
    "19",
    "21",
    "23",
    "25",
    "27",
    "30",
    "32",
    "34",
    "36",
  ];
  const BLACK_COLORS = [];

  //X & Y FOR LAPTOP
  const START_BUTTON = {
    X: 1324,
    Y: 735,
  };
  const RED_BET = {
    X: 1006,
    Y: 375,
  };
  const SHIP = {
    X: 645,
    Y: 730,
    AMOUNT_:100
  };

  const RESULT_IMAGE = {
    X: 540,
    Y: 126,
    W: 60,
    H: 32,
  };

  const rl = readline.createInterface(process.stdin, process.stdout);

  let CYCLE_COUNT = 1;
  let IMG_COUNT = 0;
  let LOSE_COUNT = 0;
  let NUMER_OF_CLICKS = 1;
  //RESULT_IMAGE

  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: false,
    // executablePath: '/usr/bin/chromium',
    args: ["--no-sandbox", "--disable-infobars"],
    // args: ['--no-sandbox','--disable-infobars'],

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

  // let frame = await page.$('#gameframe');
  // let BOX = await frame.boundingBox()
  // let CENTER_POINT = await frame.clickablePoint()
  // console.log(BOX)
  // console.log(CENTER_POINT)



  await new Promise(resolve => {
    rl.question("START ? ", resolve)
  })
  
  while (true) {
    
    let RESULT = {
      Number_: '',
      Color_: '',
      STATUS_:'',
      IMG_PATH:'',
      CYCLE:0
    };

    if (LOSE_COUNT == 0) {
      NUMER_OF_CLICKS = 1;
    } else {
      if(NUMER_OF_CLICKS == 1){
        NUMER_OF_CLICKS = (NUMER_OF_CLICKS * 2) + 1;
      }else{
        NUMER_OF_CLICKS = ((NUMER_OF_CLICKS - 1) * 2) + 1;
      }
    }


    await page.mouse.click(SHIP.X, SHIP.Y);
    await page.mouse.click(RED_BET.X, RED_BET.Y,{count : NUMER_OF_CLICKS , delay:500});

    await page.waitForTimeout(1500);

    await page.mouse.click(START_BUTTON.X, START_BUTTON.Y);

    await page.waitForTimeout(20000);


    await page.screenshot({
      path: "./IMG/RESULT_IMG_" + IMG_COUNT + ".png",
      clip: {
        x: RESULT_IMAGE.X,
        y: RESULT_IMAGE.Y,
        width: RESULT_IMAGE.W,
        height: RESULT_IMAGE.H,
      },
    });

    await page.waitForTimeout(2000);

        const {data} =  await Tesseract.recognize("./IMG/RESULT_IMG_" + IMG_COUNT + ".png")


         RESULT.Number_ = data.text.replace(/\D/g, "");
         RESULT.Color_ =  RED_COLORS.includes(data.text.replace(/\D/g, "")) ? "RED" : "BLACK";
         RESULT.STATUS_ =  RED_COLORS.includes(data.text.replace(/\D/g, "")) ? "WIN" : "LOSE";
         RESULT.CYCLE = CYCLE_COUNT;
         RESULT.IMG_PATH = "./IMG/RESULT_IMG_" + IMG_COUNT + ".png";
         
         console.log(RESULT)
         fs.appendFile('./LOG/Result.log', '\n'+JSON.stringify(RESULT , null, 2), 'utf8', (err) => { })



        if (RESULT.STATUS_ == "WIN") {
          LOSE_COUNT = 0;
        } else {
          LOSE_COUNT++;
        }


    IMG_COUNT++;
    CYCLE_COUNT++;
    //END WHILE
  }
})();


