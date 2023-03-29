const puppeteer = require('puppeteer');
const { executablePath } =  require('puppeteer');
const path = require('path');
//remove this line later when testing is done 💀
const cookies = require('./cookies.json');
const fs = require('fs');

async function test() {
  const Nullify = path.join(process.cwd(), 'Nullify');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      `--disable-extensions-except=${Nullify}`,
      `--load-extension=${Nullify}`
    ],
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

  console.log('taking screenshot...');
  await page.screenshot({
    path: 'screenshot.jpg'
  });
  await browser.close();
};

test();