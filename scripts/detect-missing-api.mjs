import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';

const DOCUMENTATION_URL = 'https://developer.matomo.org/api-reference/tracking-javascript';
const TRACKER_FILE_PATH = 'projects/ngx-matomo-client/src/lib/tracker/matomo-tracker.service.ts';
const GLOBAL_METHOD_PREFIX = 'Matomo.';
const ACCEPTED_METHOD_PREFIXES = ['matomoTracker.', 'tracker.'];
const EXCLUSIONS = /\//;

async function scrapMethods() {
  const response = await fetch(DOCUMENTATION_URL);
  const body = await response.text();

  const $ = cheerio.load(body);
  const codes$ = $('.documentation li code:first-of-type');
  const methods = [];

  codes$.each((_, codeEl) => {
    const $el = $(codeEl);
    let text = $el.text().trim();

    for (const prefix of ACCEPTED_METHOD_PREFIXES) {
      if (text.startsWith(prefix)) {
        text = text.slice(prefix.length).trim();
        break;
      }
    }

    if (!text.startsWith(GLOBAL_METHOD_PREFIX)) {
      const methodName = text.includes('(') ? text.slice(0, text.indexOf('(')).trim() : text;

      if (!EXCLUSIONS.test(methodName) && !methods.some(method => method.name === methodName)) {
        const $ul = $el.parentsUntil('.documentation', 'ul').last();
        const section$ = $ul.prevAll('h3').first();

        methods.push({
          name: methodName,
          signature: text,
          section: section$.text(),
          link: DOCUMENTATION_URL + '#' + section$.attr('id'),
        });
      }
    }
  });

  return methods;
}

async function loadTrackerFile() {
  return fs.readFile(TRACKER_FILE_PATH, 'utf-8');
}

const trackerFile = await loadTrackerFile();
const methods = await scrapMethods();
const missingMethods = methods.filter(method => !trackerFile.includes(method.name));

if (missingMethods.length > 0) {
  console.log('Found ' + missingMethods.length + ' missing method(s):');
  console.table(missingMethods, ['signature', 'section', 'link']);
} else {
  console.log('All methods defined!');
}

process.exit(missingMethods.length > 0 ? 1 : 0);
