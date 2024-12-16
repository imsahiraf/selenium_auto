const axios = require('axios');
const { Builder, By } = require('selenium-webdriver');
var count = 0;

async function fetchBlogLinks() {
    try {
        const response = await axios.get('https://blog.zarsco.com/wp-json/wp/v2/posts');
        const blogLinks = response.data.map(post => post.link);
        return blogLinks;
    } catch (error) {
        console.error('Error fetching blog links:', error.message);
        return [];
    }
}

async function performScroll(url) {
    const driver = new Builder().forBrowser('chrome').build();

    try {
        await driver.get(url);

        await driver.sleep(5000); // Wait for 5 seconds

        // Simulate scrolling down the page
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        await driver.sleep(3000); // Wait for 3 seconds

    } finally {
        // await driver.quit();
    }
}

async function openAndRedirect(urls) {
    const startTime = Date.now();
    const endTime = startTime + (Math.floor(Math.random() * 241 + 60) * 1000); // Random time between 1 to 5 minutes (60 to 300 seconds)

    while (Date.now() < endTime) {
        for (let i = 0; i < urls.length; i++) {
            const url = urls[i];
            await performScroll(url);
            console.log(`Opened URL: ${url}`);

            const redirectTime = Math.floor(Math.random() * 31 + 10); // Random time between 10 to 40 seconds
            console.log(`Waiting for ${redirectTime} seconds before redirecting...\n`);
            await new Promise(resolve => setTimeout(resolve, redirectTime * 1000));
        }
    }
}

async function main() {
    const startTime = Date.now();
    const oneHour = 60 * 60 * 1000; // One hour in milliseconds
    const urls = await fetchBlogLinks();

    while (Date.now() - startTime < oneHour) {
        if (urls.length === 0) {
            console.log('No blog links found.');
            break;
        }

        if (count !== 0 && count % 3 === 0) {
            console.log(`Running iteration for ${count} with random URLs.`);
            await openAndRedirect(urls.slice(count - 3, count));
            count = 0; // Reset count after every 3 iterations
        }

        const randomIndex = Math.floor(Math.random() * urls.length);
        const randomUrl = urls[randomIndex];
        count++;
        console.log(`Running iteration for ${count} with URL: ${randomUrl}`);
        await performScroll(randomUrl);
        console.log('Iteration complete');

        console.log(`Waiting for 10 seconds before next iteration...\n`);
        await new Promise(resolve => setTimeout(resolve, 10000));
    }

    console.log('Script execution completed.');
}

main();
