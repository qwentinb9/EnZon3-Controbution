const puppeteer = require('puppeteer');
const { executablePath } =  require('puppeteer');
//remove this line later when testing is done 💀
const cookies = require('./cookies.json');
const fs = require('fs');

async function test() {
  const browser = await puppeteer.launch({
    ignoreDefaultArgs: ['--disable-extensions'],
    executablePath: executablePath(),
  });
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);

  console.log('setting cookies...');
  await page.setCookie(...cookies);

  console.log('loading i-ready...')
  await page.goto('https://login.i-ready.com/student/dashboard/home', { waitUntil: 'networkidle0' });
  console.log('I-Ready loaded, now going to Reading subject...');

  let reading = await page.$x("/html/body/div/div[1]/section/div/div[2]/main/div/div/div/div/div/div[1]/span/div/button")
  await reading[0].click({ waitUntil: 'domcontentloaded'})

  await page.waitForTimeout(4000)

  console.log('Injecting Nullify')
  let bookmarklet = fs.readFileSync('./bookmarklet.txt', 'utf8');
  await page.evaluate(function() {
    eval(bookmarklet);
  }, { waitUntil: 'domcontentloaded'})

  console.log('taking screenshot...');
  await page.screenshot({
    path: 'screenshot.jpg'
  });
  await browser.close();
};

test();