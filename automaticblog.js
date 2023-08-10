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
        await driver.quit();
    }
}

async function main() {
    const startTime = Date.now();
    const oneHour = 60 * 60 * 1000; // One hour in milliseconds

    while (Date.now() - startTime < oneHour) {
        const blogLinks = await fetchBlogLinks();
        if (blogLinks.length === 0) {
            console.log('No blog links found.');
            break;
        }

        const randomIndex = Math.floor(Math.random() * blogLinks.length);
        const randomUrl = blogLinks[randomIndex];
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
