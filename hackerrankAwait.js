const puppeteer = require('puppeteer');

let url =
  'https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login';
let page;

async function automate() {
  try {
    let browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      args: ['--start-maximized']
      // slowMo: 30 //To slow down the automation processes
    });
    let pagesArr = await browser.pages();
    page = pagesArr[0];
    await page.goto(url);
    await page.type('#input-1', 'jobif18724@labebx.com', { delay: 100 });
    await page.type('#input-2', '123456', { delay: 100 });
    //login btn
    await waitClickNavigate(
      '.ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled'
    );
    await waitClickNavigate('[title="Interview Preparation Kit"]');
    await waitClickNavigate('[data-attr1="warmup"]');

    //get link of all the questions in an array and then call submit code for each questions
    await page.waitForSelector('.js-track-click.challenge-list-item', {
      visible: true
    });
    let hrefArr = await page.evaluate(function() {
      let allBtns = document.querySelectorAll(
        '.js-track-click.challenge-list-item'
      );
      let hrefArr = [];
      for (let i = 0; i < allBtns.length; ++i) {
        let href = allBtns[i].getAttribute('href');
        hrefArr.push(href);
      }
      return hrefArr;
    });
    // console.log(hrefArr);

    for (let i = 0; i < hrefArr.length; ++i) {
      let link = 'https://www.hackerrank.com/' + hrefArr[i];
      await submitCode(link);
    }
  } catch (err) {
    console.log(err);
  }
}

automate();

async function waitClickNavigate(selector) {
  try {
    await page.waitForSelector(selector, { visible: true });
    await Promise.all([page.click(selector), page.waitForNavigation()]);
  } catch (error) {
    console.log(error);
  }
}

async function handleLockBtn(selector) {
  try {
    await page.waitForSelector(selector, {
      visible: true,
      timeout: 5000
    });
    await page.click(selector);
  } catch (error) {
    console.log(error);
  }
}

async function pasteCode(code, language) {
  await page.waitForSelector('[type="checkbox"]');
  await page.click('[type="checkbox"]');
  await page.waitForSelector('#input-1');
  await page.type('#input-1', code);
  await page.keyboard.down('Control');
  await page.keyboard.press('A');
  await page.keyboard.press('X');
  await page.click('.css-1hwfws3');
  await page.keyboard.up('Control');
  await page.type('.css-1hwfws3', language);
  await page.keyboard.press('Enter');
  await page.keyboard.down('Control');
  await page.click('.monaco-editor.no-user-select.vs');
  await page.keyboard.press('A');
  await page.keyboard.press('V');
  await page.keyboard.up('Control');
  await page.click(
    '.ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled'
  );
}

async function submitCode(link) {
  await page.goto(link);
  await page.waitForSelector('[data-attr2="Editorial"]', { visible: true });
  await page.click('[data-attr2="Editorial"]');
  await handleLockBtn('.ui-btn.ui-btn-normal.ui-btn-primary.ui-btn-styled');
  await page.waitForSelector(
    '.challenge-editorial-block.editorial-setter-code pre',
    { visible: true }
  );
  let code = await page.evaluate(function() {
    return document.querySelector(
      '.challenge-editorial-block.editorial-setter-code pre'
    ).innerText;
  });
  await page.waitForSelector(
    '.challenge-editorial-block.editorial-setter-code h3',
    { visible: true }
  );
  let language = await page.evaluate(function() {
    return document
      .querySelector('.challenge-editorial-block.editorial-setter-code h3')
      .innerText.trim();
  });
  console.log(language);
  await page.waitForSelector('[data-attr2="Problem"]', { visible: true });
  await page.click('[data-attr2="Problem"]');
  await pasteCode(code, language);
}
