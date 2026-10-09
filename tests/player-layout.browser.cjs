const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { PLAYER_ONLY_CSS } = require('../electron/playerFrame.cjs');
(async () => {
 const browser = await chromium.launch({headless:true});
 const page = await browser.newPage({viewport:{width:1000,height:600}});
 await page.setContent(`<header>Provider header</header><main><div id="playerMenu">Menu</div><div style="position: absolute;inset:0;display:grid;place-items:center"><button onclick="this.textContent='Clicked'">Tıkla izle</button></div><div id="embed"><iframe srcdoc="Player"></iframe></div></main>`);
 await page.addStyleTag({content:PLAYER_ONLY_CSS});
 await page.getByRole('button',{name:'Tıkla izle'}).click({timeout:3000});
 if(await page.getByRole('button').textContent() !== 'Clicked') throw Error('Gate not clickable');
 if(await page.locator('header').evaluate(e=>getComputedStyle(e).visibility) !== 'hidden') throw Error('Provider chrome visible');
 console.log('PASS: source gate clickable; provider header hidden');
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
