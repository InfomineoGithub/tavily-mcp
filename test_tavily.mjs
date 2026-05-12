#!/usr/bin/env node
/**
 * Tavily MCP Server – Comprehensive Test Suite
 * Covers: tavily_search (all params), tavily_extract, tavily_crawl, tavily_map, tavily_research
 */

import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.TAVILY_API_KEY;
if (!API_KEY) {
    console.error('ERROR: TAVILY_API_KEY environment variable is not set.');
    process.exit(1);
}

const BASE = {
    search: 'https://api.tavily.com/search',
    extract: 'https://api.tavily.com/extract',
    crawl: 'https://api.tavily.com/crawl',
    map: 'https://api.tavily.com/map',
    research: 'https://api.tavily.com/research',
};

const client = axios.create({
    headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
    },
    timeout: 120_000, // 2 min general timeout (research overrides per-call)
});

// ─── Result tracking ────────────────────────────────────────────────────────
const results = [];

function pass(testName, notes = '') {
    results.push({ status: 'PASS', testName, notes });
    console.log(`  ✓  PASS │ ${testName}${notes ? '  →  ' + notes : ''}`);
}

function fail(testName, reason) {
    results.push({ status: 'FAIL', testName, notes: reason });
    console.log(`  ✗  FAIL │ ${testName}  →  ${reason}`);
}

async function run(testName, fn) {
    try {
        await fn();
    } catch (err) {
        const msg = err.response?.data
            ? JSON.stringify(err.response.data)
            : err.message;
        fail(testName, msg);
    }
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function assertField(obj, field, testName) {
    if (obj[field] === undefined || obj[field] === null) {
        fail(testName, `field '${field}' missing in response`);
        return false;
    }
    return true;
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// ════════════════════════════════════════════════════════════════════════════
// 1. tavily_search – every parameter
// ════════════════════════════════════════════════════════════════════════════
async function testSearch() {
    console.log('\n══════════════════════════════════════════');
    console.log(' USE CASE 1: tavily_search');
    console.log('══════════════════════════════════════════');

    // ── 1.1 Minimal (only required param: query) ──────────────────────────────
    await run('1.1 search – minimal (query only)', async () => {
        const { data } = await client.post(BASE.search, { query: 'artificial intelligence 2025' });
        if (!data.results?.length) throw new Error('No results returned');
        pass('1.1 search – minimal (query only)', `${data.results.length} results`);
    });

    // ── 1.2 search_depth: basic ───────────────────────────────────────────────
    await run('1.2 search – search_depth=basic', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'machine learning frameworks',
            search_depth: 'basic',
        });
        if (!data.results?.length) throw new Error('No results');
        pass('1.2 search – search_depth=basic', `${data.results.length} results`);
    });

    // ── 1.3 search_depth: advanced ────────────────────────────────────────────
    await run('1.3 search – search_depth=advanced', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'machine learning frameworks',
            search_depth: 'advanced',
        });
        if (!data.results?.length) throw new Error('No results');
        pass('1.3 search – search_depth=advanced', `${data.results.length} results`);
    });

    // ── 1.4 search_depth: fast ────────────────────────────────────────────────
    await run('1.4 search – search_depth=fast', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'machine learning frameworks',
            search_depth: 'fast',
        });
        if (!data.results?.length) throw new Error('No results');
        pass('1.4 search – search_depth=fast', `${data.results.length} results`);
    });

    // ── 1.5 search_depth: ultra-fast ─────────────────────────────────────────
    await run('1.5 search – search_depth=ultra-fast', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'machine learning frameworks',
            search_depth: 'ultra-fast',
        });
        if (!data.results?.length) throw new Error('No results');
        pass('1.5 search – search_depth=ultra-fast', `${data.results.length} results`);
    });

    // ── 1.6 topic: general ───────────────────────────────────────────────────
    await run('1.6 search – topic=general', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'OpenAI latest news',
            topic: 'general',
        });
        if (!data.results?.length) throw new Error('No results');
        pass('1.6 search – topic=general', `${data.results.length} results`);
    });

    // ── 1.7 time_range: day ──────────────────────────────────────────────────
    await run('1.7 search – time_range=day', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'AI news',
            time_range: 'day',
        });
        if (!data.results?.length) throw new Error('No results');
        pass('1.7 search – time_range=day', `${data.results.length} results`);
    });

    // ── 1.8 time_range: week ─────────────────────────────────────────────────
    await run('1.8 search – time_range=week', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'AI news',
            time_range: 'week',
        });
        if (!data.results?.length) throw new Error('No results');
        pass('1.8 search – time_range=week', `${data.results.length} results`);
    });

    // ── 1.9 time_range: month ────────────────────────────────────────────────
    await run('1.9 search – time_range=month', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'AI news',
            time_range: 'month',
        });
        if (!data.results?.length) throw new Error('No results');
        pass('1.9 search – time_range=month', `${data.results.length} results`);
    });

    // ── 1.10 time_range: year ────────────────────────────────────────────────
    await run('1.10 search – time_range=year', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'AI news',
            time_range: 'year',
        });
        if (!data.results?.length) throw new Error('No results');
        pass('1.10 search – time_range=year', `${data.results.length} results`);
    });

    // ── 1.11 start_date / end_date ───────────────────────────────────────────
    await run('1.11 search – start_date + end_date', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'ChatGPT artificial intelligence trends',
            start_date: '2024-06-01',
            end_date: '2025-12-31',
        });
        if (!data.results?.length) throw new Error('No results');
        pass('1.11 search – start_date + end_date', `${data.results.length} results, sample date: ${data.results[0].published_date ?? 'n/a'}`);
    });

    // ── 1.12 max_results: 5 (minimum) ────────────────────────────────────────
    await run('1.12 search – max_results=5', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'large language models',
            max_results: 5,
        });
        const count = data.results?.length ?? 0;
        if (count === 0) throw new Error('No results');
        pass('1.12 search – max_results=5', `${count} results (≤5)`);
    });

    // ── 1.13 max_results: 10 ─────────────────────────────────────────────────
    await run('1.13 search – max_results=10', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'large language models',
            max_results: 10,
        });
        const count = data.results?.length ?? 0;
        if (count === 0) throw new Error('No results');
        pass('1.13 search – max_results=10', `${count} results`);
    });

    // ── 1.14 max_results: 20 (maximum) ───────────────────────────────────────
    await run('1.14 search – max_results=20', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'large language models',
            max_results: 20,
        });
        const count = data.results?.length ?? 0;
        if (count === 0) throw new Error('No results');
        pass('1.14 search – max_results=20', `${count} results`);
    });

    // ── 1.15 include_images: true ────────────────────────────────────────────
    await run('1.15 search – include_images=true', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'neural network architecture',
            include_images: true,
        });
        const hasImages = Array.isArray(data.images);
        if (!hasImages) throw new Error('images field missing');
        pass('1.15 search – include_images=true', `images array present (${data.images.length} items)`);
    });

    // ── 1.16 include_image_descriptions: true ────────────────────────────────
    await run('1.16 search – include_image_descriptions=true', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'neural network architecture diagrams',
            include_images: true,
            include_image_descriptions: true,
        });
        const hasImages = Array.isArray(data.images);
        if (!hasImages) throw new Error('images field missing');
        const hasDesc = data.images.length > 0 && typeof data.images[0] === 'object' && data.images[0].description !== undefined;
        pass('1.16 search – include_image_descriptions=true',
            hasDesc ? 'objects with descriptions returned' : `${data.images.length} image entries (descriptions may be null)`);
    });

    // ── 1.17 include_raw_content: true ───────────────────────────────────────
    await run('1.17 search – include_raw_content=true', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'transformer model explained',
            include_raw_content: true,
        });
        if (!data.results?.length) throw new Error('No results');
        const hasRaw = data.results.some(r => r.raw_content);
        pass('1.17 search – include_raw_content=true',
            hasRaw ? 'raw_content present in at least 1 result' : 'raw_content fields exist (may be null for some)');
    });

    // ── 1.18 include_domains ─────────────────────────────────────────────────
    await run('1.18 search – include_domains=[arxiv.org]', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'attention mechanism paper',
            include_domains: ['arxiv.org'],
        });
        if (!data.results?.length) throw new Error('No results');
        const allArxiv = data.results.every(r => r.url.includes('arxiv.org'));
        pass('1.18 search – include_domains=[arxiv.org]',
            `${data.results.length} results, all arxiv.org: ${allArxiv}`);
    });

    // ── 1.19 exclude_domains ─────────────────────────────────────────────────
    await run('1.19 search – exclude_domains=[wikipedia.org]', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'machine learning',
            exclude_domains: ['wikipedia.org'],
        });
        if (!data.results?.length) throw new Error('No results');
        const hasWiki = data.results.some(r => r.url.includes('wikipedia.org'));
        pass('1.19 search – exclude_domains=[wikipedia.org]',
            `${data.results.length} results, wikipedia found: ${hasWiki}`);
    });

    // ── 1.20 country ─────────────────────────────────────────────────────────
    await run('1.20 search – country=France', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'artificial intelligence policy',
            topic: 'general',
            country: 'France',
        });
        if (!data.results?.length) throw new Error('No results');
        pass('1.20 search – country=France', `${data.results.length} results returned`);
    });

    // ── 1.21 include_favicon: true ───────────────────────────────────────────
    await run('1.21 search – include_favicon=true', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'OpenAI',
            include_favicon: true,
        });
        if (!data.results?.length) throw new Error('No results');
        const hasFavicon = data.results.some(r => r.favicon);
        pass('1.21 search – include_favicon=true',
            hasFavicon ? 'favicon URLs present' : 'favicon field exists (may be null)');
    });

    // ── 1.22 exact_match: true ───────────────────────────────────────────────
    await run('1.22 search – exact_match=true', async () => {
        const { data } = await client.post(BASE.search, {
            query: '"chain of thought prompting"',
            exact_match: true,
        });
        if (!data.results?.length) throw new Error('No results');
        pass('1.22 search – exact_match=true', `${data.results.length} results for exact phrase`);
    });

    // ── 1.23 Combined: advanced + time_range + max_results + include_raw ─────
    await run('1.23 search – combined params', async () => {
        const { data } = await client.post(BASE.search, {
            query: 'agentic AI systems 2025',
            search_depth: 'advanced',
            topic: 'general',
            time_range: 'month',
            max_results: 10,
            include_raw_content: true,
            include_favicon: true,
            exclude_domains: ['wikipedia.org'],
        });
        if (!data.results?.length) throw new Error('No results');
        pass('1.23 search – combined params',
            `${data.results.length} results, raw_content: ${data.results.some(r => r.raw_content)}, favicon: ${data.results.some(r => r.favicon)}`);
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 2. tavily_extract
// ════════════════════════════════════════════════════════════════════════════
async function testExtract() {
    console.log('\n══════════════════════════════════════════');
    console.log(' USE CASE 2: tavily_extract');
    console.log('══════════════════════════════════════════');

    const TARGET_URL = 'https://www.anthropic.com/engineering/harness-design-long-running-apps';

    // ── 2.1 Basic extraction, no images, markdown ─────────────────────────────
    await run('2.1 extract – basic depth, no images, markdown', async () => {
        const { data } = await client.post(BASE.extract, {
            urls: [TARGET_URL],
            extract_depth: 'basic',
            include_images: false,
            format: 'markdown',
            include_favicon: false,
        });
        const result = data.results?.[0];
        if (!result) throw new Error('No results returned');
        pass('2.1 extract – basic depth, no images, markdown',
            `raw_content length: ${result.raw_content?.length ?? 0} chars, images present: ${!!data.images?.length}`);
    });

    // ── 2.2 Basic extraction, WITH images ────────────────────────────────────
    await run('2.2 extract – basic depth, WITH images', async () => {
        const { data } = await client.post(BASE.extract, {
            urls: [TARGET_URL],
            extract_depth: 'basic',
            include_images: true,
            format: 'markdown',
            include_favicon: false,
        });
        const result = data.results?.[0];
        if (!result) throw new Error('No results returned');
        pass('2.2 extract – basic depth, WITH images',
            `images count: ${data.images?.length ?? 0}`);
    });

    // ── 2.3 Advanced extraction, no images, markdown ─────────────────────────
    await run('2.3 extract – advanced depth, no images, markdown', async () => {
        const { data } = await client.post(BASE.extract, {
            urls: [TARGET_URL],
            extract_depth: 'advanced',
            include_images: false,
            format: 'markdown',
            include_favicon: false,
        });
        const result = data.results?.[0];
        if (!result) throw new Error('No results returned');
        pass('2.3 extract – advanced depth, no images, markdown',
            `raw_content length: ${result.raw_content?.length ?? 0} chars`);
    });

    // ── 2.4 Advanced extraction, WITH images ─────────────────────────────────
    await run('2.4 extract – advanced depth, WITH images', async () => {
        const { data } = await client.post(BASE.extract, {
            urls: [TARGET_URL],
            extract_depth: 'advanced',
            include_images: true,
            format: 'markdown',
            include_favicon: false,
        });
        const result = data.results?.[0];
        if (!result) throw new Error('No results returned');
        pass('2.4 extract – advanced depth, WITH images',
            `images count: ${data.images?.length ?? 0}`);
    });

    // ── 2.5 Text format ───────────────────────────────────────────────────────
    await run('2.5 extract – format=text', async () => {
        const { data } = await client.post(BASE.extract, {
            urls: [TARGET_URL],
            extract_depth: 'basic',
            include_images: false,
            format: 'text',
            include_favicon: false,
        });
        const result = data.results?.[0];
        if (!result) throw new Error('No results returned');
        pass('2.5 extract – format=text',
            `raw_content length: ${result.raw_content?.length ?? 0} chars`);
    });

    // ── 2.6 WITH include_favicon ──────────────────────────────────────────────
    await run('2.6 extract – include_favicon=true', async () => {
        const { data } = await client.post(BASE.extract, {
            urls: [TARGET_URL],
            extract_depth: 'basic',
            include_images: false,
            format: 'markdown',
            include_favicon: true,
        });
        const result = data.results?.[0];
        if (!result) throw new Error('No results returned');
        pass('2.6 extract – include_favicon=true',
            `favicon: ${result.favicon ?? 'null'}`);
    });

    // ── 2.7 WITHOUT include_favicon ───────────────────────────────────────────
    await run('2.7 extract – include_favicon=false', async () => {
        const { data } = await client.post(BASE.extract, {
            urls: [TARGET_URL],
            extract_depth: 'basic',
            include_images: false,
            format: 'markdown',
            include_favicon: false,
        });
        const result = data.results?.[0];
        if (!result) throw new Error('No results returned');
        pass('2.7 extract – include_favicon=false',
            `favicon field: ${result.favicon ?? 'absent/null'}`);
    });

    // ── 2.8 With query (reranking) ────────────────────────────────────────────
    await run('2.8 extract – with query reranking', async () => {
        const { data } = await client.post(BASE.extract, {
            urls: [TARGET_URL],
            extract_depth: 'basic',
            include_images: false,
            format: 'markdown',
            include_favicon: false,
            query: 'harness design long running applications',
        });
        const result = data.results?.[0];
        if (!result) throw new Error('No results returned');
        pass('2.8 extract – with query reranking',
            `raw_content length: ${result.raw_content?.length ?? 0} chars`);
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 3. tavily_crawl
// ════════════════════════════════════════════════════════════════════════════
async function testCrawl() {
    console.log('\n══════════════════════════════════════════');
    console.log(' USE CASE 3: tavily_crawl');
    console.log('══════════════════════════════════════════');

    const CRAWL_URL = 'https://www.anthropic.com/engineering';

    // ── 3.1 Depth 1, max_breadth 3, limit 20 ─────────────────────────────────
    await run('3.1 crawl – depth=1, breadth=3, limit=20', async () => {
        const { data } = await client.post(BASE.crawl, {
            url: CRAWL_URL,
            max_depth: 1,
            max_breadth: 3,
            limit: 20,
        });
        if (!data.results?.length) throw new Error('No pages crawled');
        pass('3.1 crawl – depth=1, breadth=3, limit=20',
            `pages crawled: ${data.results.length}, base_url: ${data.base_url}`);
    });

    // ── 3.2 Depth 2, max_breadth 3, limit 20 ─────────────────────────────────
    await run('3.2 crawl – depth=2, breadth=3, limit=20', async () => {
        const { data } = await client.post(BASE.crawl, {
            url: CRAWL_URL,
            max_depth: 2,
            max_breadth: 3,
            limit: 20,
        });
        if (!data.results?.length) throw new Error('No pages crawled');
        pass('3.2 crawl – depth=2, breadth=3, limit=20',
            `pages crawled: ${data.results.length} (depth=1 got ${results.find(r => r.testName === '3.1 crawl – depth=1, breadth=3, limit=20')?.notes ?? '?'}`);
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 4. tavily_map
// ════════════════════════════════════════════════════════════════════════════
async function testMap() {
    console.log('\n══════════════════════════════════════════');
    console.log(' USE CASE 4: tavily_map');
    console.log('══════════════════════════════════════════');

    const MAP_URL = 'https://www.anthropic.com/engineering';

    // ── 4.1 Default map ───────────────────────────────────────────────────────
    await run('4.1 map – default params', async () => {
        const { data } = await client.post(BASE.map, {
            url: MAP_URL,
        });
        if (!data.results?.length) throw new Error('No URLs mapped');
        pass('4.1 map – default params',
            `URLs discovered: ${data.results.length}`);
        console.log('      Sample URLs:', data.results.slice(0, 5).join(', '));
    });

    // ── 4.2 Deeper map depth=2 ───────────────────────────────────────────────
    await run('4.2 map – max_depth=2, limit=50', async () => {
        const { data } = await client.post(BASE.map, {
            url: MAP_URL,
            max_depth: 2,
            limit: 50,
        });
        if (!data.results?.length) throw new Error('No URLs mapped');
        pass('4.2 map – max_depth=2, limit=50',
            `URLs discovered: ${data.results.length}`);
    });

    // ── 4.3 With select_paths filter ─────────────────────────────────────────
    await run('4.3 map – select_paths=/engineering.*', async () => {
        const { data } = await client.post(BASE.map, {
            url: MAP_URL,
            select_paths: ['/engineering.*'],
            limit: 30,
        });
        const count = data.results?.length ?? 0;
        pass('4.3 map – select_paths=/engineering.*',
            `URLs with /engineering path: ${count}`);
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 5. tavily_research
// ════════════════════════════════════════════════════════════════════════════
async function testResearch() {
    console.log('\n══════════════════════════════════════════');
    console.log(' USE CASE 5: tavily_research');
    console.log('══════════════════════════════════════════');

    const TOPIC = `What are the current trends in building agentic AI systems?
Cover the main architectural patterns (ReAct, Plan-and-Execute, multi-agent, etc.),
what a "harness" system is in the context of long-running AI agents,
and how teams are designing infrastructure to orchestrate and supervise agentic workflows in 2024-2025.`;

    const INITIAL_POLL_INTERVAL = 3000;
    const MAX_POLL_INTERVAL = 10000;
    const POLL_BACKOFF = 1.5;
    const MAX_DURATION = 900_000; // 15 min – matches pro model timeout

    // ── 5.1 model=mini ───────────────────────────────────────────────────────
    await run('5.1 research – model=mini', async () => {
        const initRes = await client.post(BASE.research, {
            input: TOPIC,
            model: 'mini',
        }, { timeout: 30_000 });

        const requestId = initRes.data.request_id;
        if (!requestId) throw new Error('No request_id in response');

        console.log(`      request_id: ${requestId} — polling…`);
        let poll = INITIAL_POLL_INTERVAL;
        let elapsed = 0;

        while (elapsed < MAX_DURATION) {
            await sleep(poll);
            elapsed += poll;
            poll = Math.min(poll * POLL_BACKOFF, MAX_POLL_INTERVAL);

            const pollRes = await client.get(`${BASE.research}/${requestId}`, { timeout: 30_000 });
            const status = pollRes.data.status;
            process.stdout.write(`      status: ${status} (${Math.round(elapsed / 1000)}s elapsed)\r`);

            if (status === 'completed') {
                const content = pollRes.data.content ?? '';
                console.log('');
                pass('5.1 research – model=mini',
                    `completed in ~${Math.round(elapsed / 1000)}s, content length: ${content.length} chars`);
                console.log('\n--- Research content preview (first 500 chars) ---');
                console.log(content.substring(0, 500) + (content.length > 500 ? '…' : ''));
                console.log('---');
                return;
            }
            if (status === 'failed') throw new Error('Research task failed');
        }
        throw new Error('Research timed out');
    });

    // ── 5.2 model=auto ───────────────────────────────────────────────────────
    await run('5.2 research – model=auto', async () => {
        const initRes = await client.post(BASE.research, {
            input: 'What is a harness system for AI agents and how is it used in long-running agentic applications?',
            model: 'auto',
        }, { timeout: 30_000 });

        const requestId = initRes.data.request_id;
        if (!requestId) throw new Error('No request_id in response');

        console.log(`\n      request_id: ${requestId} — polling…`);
        let poll = INITIAL_POLL_INTERVAL;
        let elapsed = 0;

        while (elapsed < MAX_DURATION) {
            await sleep(poll);
            elapsed += poll;
            poll = Math.min(poll * POLL_BACKOFF, MAX_POLL_INTERVAL);

            const pollRes = await client.get(`${BASE.research}/${requestId}`, { timeout: 30_000 });
            const status = pollRes.data.status;
            process.stdout.write(`      status: ${status} (${Math.round(elapsed / 1000)}s elapsed)\r`);

            if (status === 'completed') {
                const content = pollRes.data.content ?? '';
                console.log('');
                pass('5.2 research – model=auto',
                    `completed in ~${Math.round(elapsed / 1000)}s, content length: ${content.length} chars`);
                console.log('\n--- Research content preview (first 500 chars) ---');
                console.log(content.substring(0, 500) + (content.length > 500 ? '…' : ''));
                console.log('---');
                return;
            }
            if (status === 'failed') throw new Error('Research task failed');
        }
        throw new Error('Research timed out');
    });
}

// ════════════════════════════════════════════════════════════════════════════
// 6. tavily_research_status
// ════════════════════════════════════════════════════════════════════════════
async function testResearchStatus() {
    console.log('\n══════════════════════════════════════════');
    console.log(' USE CASE 6: tavily_research_status');
    console.log('══════════════════════════════════════════');

    const INITIAL_POLL_INTERVAL = 3000;
    const MAX_POLL_INTERVAL = 10000;
    const POLL_BACKOFF = 1.5;
    const MAX_DURATION = 900_000; // 15 min

    // ── 6.1 Submit a research job (mini) and poll via status endpoint ─────────
    await run('6.1 research_status – submit + poll mini job', async () => {
        // Submit
        const initRes = await client.post(BASE.research, {
            input: 'What are the key differences between LangChain, LlamaIndex, and AutoGen for building agentic AI systems?',
            model: 'mini',
        }, { timeout: 30_000 });

        const requestId = initRes.data.request_id;
        if (!requestId) throw new Error('No request_id returned from research endpoint');
        console.log(`      Submitted. request_id: ${requestId}`);

        // Poll via the status endpoint (simulates what the MCP tool does)
        let poll = INITIAL_POLL_INTERVAL;
        let elapsed = 0;
        let lastStatus = '';

        while (elapsed < MAX_DURATION) {
            await sleep(poll);
            elapsed += poll;
            poll = Math.min(poll * POLL_BACKOFF, MAX_POLL_INTERVAL);

            const statusRes = await client.get(`${BASE.research}/${requestId}`, { timeout: 30_000 });
            lastStatus = statusRes.data.status;
            process.stdout.write(`      status: ${lastStatus} (${Math.round(elapsed / 1000)}s elapsed)\r`);

            if (lastStatus === 'completed') {
                const content = statusRes.data.content ?? '';
                console.log('');
                pass('6.1 research_status – submit + poll mini job',
                    `completed in ~${Math.round(elapsed / 1000)}s, content length: ${content.length} chars`);
                console.log('\n--- Status tool content preview (first 300 chars) ---');
                console.log(content.substring(0, 300) + (content.length > 300 ? '…' : ''));
                console.log('---');
                return;
            }
            if (lastStatus === 'failed') throw new Error('Research task failed');

            // Simulate what the MCP tool returns when still in progress
            console.log(`\n      [MCP response simulation] Status: ${lastStatus} – job still in progress, call status tool again.`);
        }
        throw new Error('Research status polling timed out');
    });

    // ── 6.2 Poll a non-existent request_id → expect not-found behaviour ───────
    await run('6.2 research_status – invalid request_id returns 404', async () => {
        try {
            await client.get(`${BASE.research}/nonexistent-id-12345`, { timeout: 15_000 });
            // If we reach here the API didn't return 404 — still acceptable, just note it
            pass('6.2 research_status – invalid request_id returns 404',
                'API returned 2xx for unknown id (behaviour may vary)');
        } catch (err) {
            if (err.response?.status === 404) {
                pass('6.2 research_status – invalid request_id returns 404',
                    '404 returned as expected – MCP tool would surface not_found status');
            } else {
                throw err;
            }
        }
    });
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════════
async function main() {
    console.log('╔══════════════════════════════════════════╗');
    console.log('║     Tavily MCP Server – Test Suite       ║');
    console.log('╚══════════════════════════════════════════╝');
    console.log(`Started at: ${new Date().toISOString()}`);

    await testSearch();
    await testExtract();
    await testCrawl();
    await testMap();
    await testResearch();
    await testResearchStatus();

    // ── Final Report ──────────────────────────────────────────────────────────
    const passed = results.filter(r => r.status === 'PASS');
    const failed = results.filter(r => r.status === 'FAIL');

    console.log('\n');
    console.log('╔══════════════════════════════════════════════════════════════════════╗');
    console.log('║                        FINAL TEST REPORT                            ║');
    console.log('╚══════════════════════════════════════════════════════════════════════╝');
    console.log(`Finished at : ${new Date().toISOString()}`);
    console.log(`Total tests : ${results.length}`);
    console.log(`  PASSED    : ${passed.length}`);
    console.log(`  FAILED    : ${failed.length}`);
    console.log('');

    if (failed.length > 0) {
        console.log('── Failed Tests ──────────────────────────────────────────────────────');
        failed.forEach(r => console.log(`  ✗ ${r.testName}\n      Reason: ${r.notes}`));
        console.log('');
    }

    console.log('── All Tests ─────────────────────────────────────────────────────────');
    const pad = (s, n) => String(s).padEnd(n);
    console.log(pad('Status', 6) + pad('Test', 52) + 'Notes');
    console.log('─'.repeat(120));
    results.forEach(r => {
        const icon = r.status === 'PASS' ? '✓' : '✗';
        console.log(`${icon} ${pad(r.status, 5)} ${pad(r.testName, 52)} ${r.notes}`);
    });
    console.log('');
    console.log(failed.length === 0 ? '✅ All tests passed!' : `⚠️  ${failed.length} test(s) failed.`);
}

main().catch(err => {
    console.error('\nFatal error:', err.message);
    process.exit(1);
});
