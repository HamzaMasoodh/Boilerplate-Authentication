const puppeteer = require('puppeteer');

const fetchData = async (keyword, itemConditions, itemStatuses, minPrice, maxPrice, categoryIds) => {

    const encodedKeyword = encodeURIComponent(keyword);
    const url = `https://www.mercari.com/search/?keyword=${encodedKeyword}&itemConditions=${itemConditions.join('-')}&itemStatuses=${itemStatuses}&minPrice=${minPrice}&maxPrice=${maxPrice}&categoryIds=${categoryIds}&sortBy=2`;
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    
    // const url = 'https://www.mercari.com/search/';

    // Replace 'your_token_here' with your actual Bearer token

    try {
        await page.goto(url, { waitUntil: 'networkidle0' }); // wait until page load
        
        // If you need to set a Bearer token or other headers
        // await page.setExtraHTTPHeaders({
        //     'Authorization': `Bearer ${token}`
        // });

        // If you need to execute JavaScript to retrieve the data
        const data = await page.evaluate(() => {
            // Your code to extract data goes here
            // For example, you might need to trigger a fetch request and return its response
            // return fetch('your_api_endpoint', {headers: {'Authorization': `Bearer ${token}`}})
            //     .then(response => response.json());
        });

        console.log(data); // Process and output the data

        await browser.close();
        return data;
    } catch (error) {
        console.error('Error:', error);
        await browser.close();
    }
};


module.exports = {fetchData}