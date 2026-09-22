import {test,expect} from '@playwright/test';
const base=process.env.TEST_URL||'http://127.0.0.1:8787';
test('chapter navigation, filters and accessible source links',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await expect(page.locator('h1')).toContainText('他者に');
 await expect(page.locator('.chapter-card:visible')).toHaveCount(8);
 await page.getByRole('button',{name:'日本・現場の知',exact:true}).click();
 await expect(page.locator('.chapter-card:visible')).toHaveCount(2);
 await page.getByRole('button',{name:'すべて'}).click();
 await page.locator('.chapter-card').first().click();
 await expect(page).toHaveURL(/chapters\/dialogue/);
 await expect(page.locator('h1')).toContainText('問いを立てる');
 await expect(page.locator('.sources a')).toHaveAttribute('href','https://plato.stanford.edu/entries/socrates/');
 expect(errors).toEqual([]);
});
test('notes remain separate, persist on reload, and can be exported',async({page})=>{
 await page.goto(base+'/#future');
 await page.locator('#reflection').fill('判断と現場への実装に時間を使いたい。');
 await page.locator('[data-question="1"]').click();
 await expect(page.locator('#reflection')).toHaveValue('');
 await page.locator('#reflection').fill('若手が仮説を検証できる場をつくる。');
 await page.reload();await expect(page.locator('#reflection')).toHaveValue('判断と現場への実装に時間を使いたい。');
 await page.locator('[data-question="1"]').click();await expect(page.locator('#reflection')).toHaveValue('若手が仮説を検証できる場をつくる。');
 const download=page.waitForEvent('download');await page.locator('#download-note').click();
 expect((await download).suggestedFilename()).toBe('consulting-history-notes.md');
});
test('all articles load and unknown URLs return 404',async({request})=>{
 for(const slug of ['dialogue','measurement','profession','strategy','japan','implementation','knowledge','ai']){const response=await request.get(base+'/chapters/'+slug+'/');expect(response.status()).toBe(200);expect(await response.text()).toContain('この章の参考文献');}
 expect((await request.get(base+'/does-not-exist')).status()).toBe(404);
});
test('mobile has no horizontal overflow and core content works without JS',async({browser})=>{
 const page=await browser.newPage({viewport:{width:390,height:844},javaScriptEnabled:false});
 await page.goto(base);await expect(page.locator('.chapter-card')).toHaveCount(8);
 const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,width:innerWidth}));expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.width);
 await page.locator('.chapter-card').nth(7).click();await expect(page.locator('h1')).toContainText('何を引き受けるか');await page.close();
});
