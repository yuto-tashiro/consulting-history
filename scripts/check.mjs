import {readdir,readFile,access} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {chapters,sources} from '../content/history.mjs';
assert.equal(new Set(chapters.map(c=>c.slug)).size,chapters.length,'Duplicate chapter slug');
for(const chapter of chapters) for(const ref of chapter.refs) assert(sources.some(s=>s[0]===ref),`Missing source ${ref}`);
const pages=(await readdir('dist',{recursive:true})).filter(p=>p.endsWith('.html'));
for(const path of pages){
const html=await readFile(`dist/${path}`,'utf8');
assert.equal((html.match(/<h1[ >]/g)||[]).length,1,`${path}: exactly one h1`);
for(const [,link] of html.matchAll(/(?:href|src)="(\/[^"#]*)(?:#[^"]*)?"/g)){
const file=link.endsWith('/')?`${link}index.html`:link;
await access(`dist${file}`).catch(()=>assert.fail(`${path}: missing ${link}`));
}
}
console.log(`PASS: ${pages.length} HTML pages, local links/assets, headings, chapter IDs and references.`);
