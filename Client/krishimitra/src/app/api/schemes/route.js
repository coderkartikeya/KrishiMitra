export const runtime = 'nodejs';

const START_URL = 'https://schemes.vikaspedia.in/viewcontent/schemesall/schemes-for-farmers?lgn=en';

export async function GET() {
  // dynamic import (prevents bundling issues)
  let puppeteerMod;
  try {
    puppeteerMod = await import('puppeteer');
  } catch (err) {
    return new Response(JSON.stringify({
      error: 'Failed to import puppeteer. Did you install it? run `npm i puppeteer puppeteer-core`',
      details: String(err)
    }), { status: 500 });
  }
  const puppeteer = puppeteerMod.default ?? puppeteerMod;

  let browser;
  try {
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    await page.setViewport({ width: 1280, height: 900 });

    // load the page and wait for the grid items to appear
    await page.goto(START_URL, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for either the grid items with title attribute OR paper cards to render
    await page.waitForSelector('div.MuiGrid-root.MuiGrid-item[title], div.MuiPaper-root', { timeout: 15000 }).catch(() => { /* ignore, we'll still try evaluate */ });

    // extract card-level info (title, short description if present, and link if present)
    const items = await page.evaluate(() => {
      // prefer grid items that have a `title` attribute (from your screenshot)
      let nodes = Array.from(document.querySelectorAll('div.MuiGrid-root.MuiGrid-item[title]'));

      // fallback: if none found, try the paper-card nodes
      if (nodes.length === 0) {
        nodes = Array.from(document.querySelectorAll('div.MuiPaper-root'));
      }

      // map nodes -> item
      const out = nodes.map((node) => {
        // title: prefer the title attribute on the grid node
        const title = (node.getAttribute && node.getAttribute('title'))?.trim()
          || (node.querySelector && (node.querySelector('h1,h2,h3,h4,h5,h6')?.innerText || node.querySelector('strong')?.innerText))?.trim()
          || null;

        // description: prefer paragraph text inside the card
        let description = node.querySelector?.('p')?.innerText?.trim?.() || '';
        if (!description) {
          // pick the first text block that's longer than a few chars but not the title
          const textCandidates = Array.from(node.querySelectorAll('div, span, p')).map(el => el.innerText?.trim?.() || '').filter(Boolean);
          description = textCandidates.find(t => t.length > 10 && !title || (title && !t.includes(title))) || '';
        }

        // link: try to find an anchor pointing to the content page
        // in browser context, a.href is already absolute
        const anchor = node.querySelector('a[href*="/viewcontent/"], a');
        const url = anchor ? anchor.href : null;

        return { title, description, url };
      });

      // filter out blanks and dedupe by title+url
      const seen = new Set();
      return out.filter(i => i.title).filter(i => {
        const k = (i.url || '') + '|' + i.title.toLowerCase();
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });
    });

    // debug: if nothing found, save a screenshot to /mnt/data for inspection
    if (!items || items.length === 0) {
      try {
        await page.screenshot({ path: '/mnt/data/schemes_debug.png', fullPage: true });
      } catch (e) { /* ignore screenshot errors */ }
    }

    // Option: fetch detail page content for each item (sequential, polite)
    for (let i = 0; i < items.length; i++) {
      const it = items[i];
      if (!it.url) continue;
      try {
        const detailPage = await browser.newPage();
        await detailPage.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)');
        await detailPage.goto(it.url, { waitUntil: 'domcontentloaded', timeout: 60000 });
        await detailPage.waitForTimeout(500); // small wait for any client render

        const detail = await detailPage.evaluate(() => {
          const selectorCandidates = [
            'div.field--name-body',
            'div.node__content',
            'article',
            'main',
            '#content',
            '.content'
          ];
          let container = null;
          for (const sel of selectorCandidates) {
            container = document.querySelector(sel);
            if (container) break;
          }
          if (!container) container = document.body;

          return {
            text: container.innerText?.trim?.() || '',
            html: container.innerHTML || ''
          };
        });

        it.detail = {
          fetched: true,
          textPreview: detail.text ? detail.text.slice(0, 8000) : '',
          // do not bloat response with full HTML by default; full HTML available if needed
        };
        await detailPage.close();
      } catch (e) {
        // keep going even if one detail page fails
        it.detail = { fetched: false, error: String(e) };
      }
    }

    await browser.close();

    return new Response(JSON.stringify({ source: START_URL, count: items.length, items }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (err) {
    if (browser) try { await browser.close(); } catch (_) {}
    return new Response(JSON.stringify({ error: 'Scrape failed', details: String(err) }), { status: 500 });
  }
}
