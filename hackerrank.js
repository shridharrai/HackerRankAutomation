const puppeteer = require('puppeteer');

let browser;
let page;
let code;
let language;
puppeteer
  .launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
    // slowMo: 30 //To slow down the automation processes
  })
  .then(function(b) {
    browser = b;
    return browser.pages();
  })
  .then(function(pages) {
    page = pages[0];

    return page.goto(
      'https://www.hackerrank.com/auth/login?h_l=body_middle_left_button&h_r=login'
    );
  })
  .then(function() {
    return page.type('#input-1', 'tibine8516@87708b.com');
  })
  .then(function() {
    return page.type('#input-2', '123456');
  })
  .then(function() {
    return waitClickNavigate(
      '.ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled'
    );
  })
  .then(function() {
    return waitClickNavigate('[title="Interview Preparation Kit"]');
  })
  //wait until the selector get loaded on page and after that click on that
  .then(function() {
    return waitClickNavigate('[data-attr1="warmup"]');
  })
  .then(function() {
    return waitClickNavigate(
      '.ui-btn.ui-btn-normal.primary-cta.ui-btn-primary.ui-btn-styled'
    );
  })
  .then(function() {
    return page.waitForSelector('[data-attr2="Editorial"]', { visible: true });
  })
  .then(function() {
    return page.click('[data-attr2="Editorial"]');
  })
  .then(function() {
    return handleLockBtn();
  })
  .then(function() {
    return page.waitForSelector(
      '.challenge-editorial-block.editorial-setter-code pre'
    );
  })
  .then(function() {
    return page.evaluate(function() {
      return document.querySelector(
        '.challenge-editorial-block.editorial-setter-code pre'
      ).innerText;
    });
  })
  .then(function(data) {
    code = data;
    return page.evaluate(function() {
      return document.querySelector(
        '.challenge-editorial-block.editorial-setter-code h3'
      ).innerText;
    });
  })
  .then(function(title) {
    language = title.trim();
    console.log(language);
    return page.click('[data-attr2="Problem"]');
  })
  .then(function() {
    return pasteCode();
  })
  .catch(function(err) {
    console.log(err);
  });

function handleLockBtn() {
  return new Promise(function(resolve, reject) {
    page
      .waitForSelector('.ui-btn.ui-btn-normal.ui-btn-primary.ui-btn-styled', {
        visible: true
      })
      .then(function() {
        return page.click('.ui-btn.ui-btn-normal.ui-btn-primary.ui-btn-styled');
      })
      .then(function() {
        resolve();
      })
      .catch(function(err) {
        console.log(err);
        resolve();
      });
  });
}

function waitClickNavigate(selector) {
  return new Promise(function(resolve, reject) {
    page
      .waitForSelector(selector, { visible: true })
      .then(function() {
        return Promise.all([page.click(selector), page.waitForNavigation()]);
      })
      .then(function() {
        resolve();
      })
      .catch(function(err) {
        reject(err);
      });
  });
}

function pasteCode() {
  return new Promise(function(resolve, reject) {
    page
      .waitForSelector('[type="checkbox"]')
      .then(function() {
        return page.click('[type="checkbox"]');
      })
      .then(function() {
        return page.waitForSelector('#input-1');
      })
      .then(function() {
        return page.type('#input-1', code);
      })
      .then(function() {
        return page.keyboard.down('Control');
      })
      .then(function() {
        return page.keyboard.press('A');
      })
      .then(function() {
        return page.keyboard.press('X');
      })
      .then(function() {
        return page.click('.css-1hwfws3');
      })
      .then(function() {
        return page.keyboard.up('Control');
      })
      .then(function() {
        return page.type('.css-1hwfws3', language);
      })
      .then(function() {
        return page.keyboard.press('Enter');
      })
      .then(function() {
        return page.keyboard.down('Control');
      })
      .then(function() {
        return page.click('.monaco-editor.no-user-select.vs');
      })
      .then(function() {
        return page.keyboard.press('A');
      })
      .then(function() {
        return page.keyboard.press('V');
      })
      .then(function() {
        return page.keyboard.up('Control');
      })
      .then(function() {
        return page.click(
          '.ui-btn.ui-btn-normal.ui-btn-primary.pull-right.hr-monaco-submit.ui-btn-styled'
        );
      })
      .then(function() {
        resolve();
      })
      .catch(function(err) {
        reject(err);
      });
  });
}
