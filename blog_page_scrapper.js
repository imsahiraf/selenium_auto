const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const firefox = require('selenium-webdriver/firefox');
const axios = require('axios'); // Import axios library

const getRandomBrowser = () => {
    return Math.random() < 0.5 ? 'chrome' : 'firefox';
};

const getRandomWaitTime = () => {
    return Math.floor(Math.random() * 20000) + 10000; // Random time between 10 and 30 seconds
};

async function getRecentBlogPosts() {
    try {
        const response = await axios.get('https://blog.zarsco.com/wp-json/wp/v2/posts'); // Use axios for fetching
        return response.data;
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        throw error;
    }
}

async function main() {
    const blogPosts = await getRecentBlogPosts();

    for (let iteration = 0; iteration < 10; iteration++) {
        const browser = getRandomBrowser();
        const options = new (browser === 'chrome' ? chrome.Options : firefox.Options)();

        const driver = new Builder()
            .forBrowser(browser)
            .setChromeOptions(options)
            .setFirefoxOptions(options)
            .build();

        try {
            await driver.get('https://www.google.com');

            // Perform a Google search using a random blog post title
            const randomBlogPostIndex = Math.floor(Math.random() * blogPosts.length);
            const randomBlogPostTitle = blogPosts[randomBlogPostIndex].title.rendered;
            await driver.findElement(By.name('q')).sendKeys(`"${randomBlogPostTitle}"`, Key.RETURN);

            // Wait for search results to load
            await driver.wait(until.titleContains(randomBlogPostTitle), 10000);

            // Get search result links
            const resultLinks = await driver.findElements(By.css('.tF2Cxc'));

            // Select a random link
            const randomLinkIndex = Math.floor(Math.random() * resultLinks.length);
            const randomLink = resultLinks[randomLinkIndex];

            // Click on the random link
            await driver.wait(until.elementIsVisible(randomLink), 10000);
            await randomLink.click();


            // Wait for page content to load
            await driver.sleep(getRandomWaitTime());

            // Pretend to read the page (scroll, wait)
            await driver.sleep(getRandomWaitTime());

        } catch (error) {
            console.error('An error occurred:', error);
        } finally {
            await driver.quit();
        }

        // Wait for a while before next iteration
        await new Promise(resolve => setTimeout(resolve, getRandomWaitTime()));
    }
}

main();
