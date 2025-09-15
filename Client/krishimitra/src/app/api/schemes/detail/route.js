import puppeteer from 'puppeteer';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const target = decodeURIComponent(searchParams.get('url') || '');

  if (!target) {
    return new Response(JSON.stringify({ error: 'Missing url parameter' }), { status: 400 });
  }

  let browser;
  try {
    // No Redis caching
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    );
    await page.goto(target, { waitUntil: 'networkidle2', timeout: 60000 });

    // wait for content to appear
    await page.waitForSelector('.MuiBox-root', { timeout: 15000 });

    const data = await page.evaluate(() => {
      function getText(el) {
        return (el?.innerText || '').replace(/\s+/g, ' ').trim();
      }

      const titleEl =
        document.querySelector('h1, h2, h3') ||
        document.querySelector('[class*="title" i]');
      const title = getText(titleEl);

      const sections = {};
      const headings = Array.from(
        document.querySelectorAll('h2, h3, h4, strong')
      );
      const targets = ['Eligibility', 'Benefits', 'How to apply'];

      function matchesTarget(text) {
        return targets.find((t) =>
          new RegExp('^' + t + '$', 'i').test(text.trim())
        );
      }

      for (let i = 0; i < headings.length; i++) {
        const headingText = getText(headings[i]);
        const matched = matchesTarget(headingText);
        if (!matched) continue;

        let text = '';
        let node = headings[i].nextElementSibling;
        while (node && !matchesTarget(getText(node))) {
          const paraText = getText(node);
          if (paraText) {
            text += (text ? '\n' : '') + paraText;
          }
          node = node.nextElementSibling;
        }
        sections[matched.toLowerCase().replace(/\s+/g, '_')] = text;
      }

      // fallback plain content
      let content = '';
      if (Object.keys(sections).length === 0) {
        content = getText(document.querySelector('main') || document.body);
      }

      return { title, sections, content };
    });

    const payload = { url: target, ...data };
    return new Response(JSON.stringify(payload), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Detail scrape failed', details: String(err) }),
      { status: 500 }
    );
  } finally {
    if (browser) await browser.close();
  }
}
