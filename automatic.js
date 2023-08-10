const { Builder, By } = require('selenium-webdriver');

async function performScroll() {
    const driver = new Builder().forBrowser('chrome').build();

    try {
        await driver.get('https://blog.zarsco.com/the-future-of-artificial-intelligence-trends-and-predictions/'); // Replace with the website you want to scroll

        await driver.sleep(5000); // Wait for 5 seconds

        // Simulate scrolling down the page
        await driver.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        await driver.sleep(3000); // Wait for 3 seconds

    } finally {
        await driver.quit();
    }
}

async function main() {
    const repeatCount = 10;
    const delayBetweenRuns = 10000; // 10 seconds

    for (let i = 0; i < repeatCount; i++) {
        console.log(`Running iteration ${i + 1}`);
        await performScroll();
        console.log(`Iteration ${i + 1} complete`);

        if (i < repeatCount - 1) {
            console.log(`Waiting for ${delayBetweenRuns / 1000} seconds before next iteration...\n`);
            await new Promise(resolve => setTimeout(resolve, delayBetweenRuns));
        }
    }
}

main();
