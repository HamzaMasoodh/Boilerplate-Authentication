const axios = require('axios');
const cheerio = require('cheerio');
const MercariProducts = require('../models/products/products');
const Token = require('../models/token/token.js')
const Filter = require('../models/filters/filter');
const logger = require('../utils/logger');
require('dotenv').config()
const { sendNotification } = require('../utils/sendNotifications');
const { stopAutomation } = require('./automationManager.js');

//Start Automation Processing
const processAndStoreProducts = async (payload, userId) => {

    try {
        const token = await Token.findOne()
        const sha256Hash = token ? token.sha256 : process.env.sha256Hash;

        logger.info(`Starting product processing for user ${userId} of Filter : ${payload.search} after ${payload.refreshIntervals} seconds`);
        let initializationResponseObj = {}
        try {
            //Initialize the Tokens
            let initializationResponseUrl = await fetch("https://www.mercari.com/v1/initialize");
            let initializationResponseText = await initializationResponseUrl.text();
            initializationResponseObj = JSON.parse(initializationResponseText);
        } catch (error) {
            logger.error(`Error Occured: ${error.message}`)
            throw new Error(error.message)
        }
        let offset = 0;
        const batchSize = 50;
        let allProductDetails = [];
        let hasMoreProducts = true;
        try {
            while (hasMoreProducts) {
                logger.info(`Fetching batch of products with offset ${offset} and batch size ${batchSize}...`);
                let data = await fetchData(payload, initializationResponseObj, offset, batchSize, sha256Hash);
                const products = data.data.search.itemsList;

                if (products.length > 0) {
                    logger.info(`Fetched ${products.length} products. Checking for new products...`);
                    // Filter products that do not exist in the database
                    const newProductsPromises = products.map(async product => {
                        const exists = await productExists(product.id,payload._id);
                        if (!exists) {
                            return product;
                        }
                        return null;
                    });
                    let newProduct = (await Promise.all(newProductsPromises)).filter(product => product !== null);


                    if (newProduct.length > 0) {
                        logger.info(`Fetched ${newProduct.length} products. Processing details...`);
                        const fetchDetailsPromises = newProduct.map(product => fetchProductDetails(product.id, initializationResponseObj, sha256Hash));
                        const productsDetailsResponses = await Promise.all(fetchDetailsPromises);

                        // Since you're using axios, you'd directly get the JSON response
                        const productsDetails = productsDetailsResponses.map(productData => ({
                            productId: productData.itemId, // Adjust according to actual response structure
                            name: productData.name,
                            description: productData.description,
                            price: parseInt(productData.price) / 100,
                            shippingPrice: productData.shippingClass ? parseInt(productData.shippingClass.fee) / 100 : null,
                            images: productData.photos.map(photo => photo.thumbnail),
                            checkout: 'https://www.mercari.com/transaction/buy/' + productData.itemId
                        }));

                        // Accumulate all processed details
                        allProductDetails.push(...productsDetails);

                        // Save or update products in batch
                        let newProducts = await saveOrUpdateProduct(productsDetails, payload._id, userId);

                        if (newProducts > 0) {
                            await sendNotification(userId, `${newProducts} New product added for Query ${payload.search}`, "product", ``)
                        }

                        logger.info(`Processed and updated ${productsDetails.length} products for query: ${payload.keywords}`);
                    } else {
                        logger.info("No new products found. Skipping the process.");
                    }
                    if (products.length >= batchSize) {
                        logger.info("Reached the end of the product list. Ending product fetch loop.");
                        hasMoreProducts = false;
                    }

                    offset += products.length;
                } else {
                    logger.info("No more products found. Ending product fetch loop.");
                    hasMoreProducts = false;
                }
                if (allProductDetails.length >= 50) {
                    logger.info("Maximum product processing limit reached. Stopping further processing.");
                    hasMoreProducts = false;
                }

            }

        } catch (error) {
            logger.error(`Error Occured: ${error.message}`)
            throw new Error(error.message)
        }

        logger.info(`Completed processing all products for user ${userId}. Total products processed: ${allProductDetails.length}`);

        return "Success"

    } catch (error) {
        logger.error(`${error.message}`)

        let filter = await Filter.findById(payload._id)
        filter.isStart = false
        await filter.save()
        stopAutomation(filter._id)
        logger.info(`Stopped The Automation of Filter ${filter.search} Due to Error: ${error.message} for user ${userId}.`);
        await sendNotification(userId, `Stopped The Automation of Filter ${filter.search} Due to Error: ${error.message} for user ${userId}.`, 'notification', '')
    }
};

//Start Fetching Data With Query
const fetchData = async (query, initializationResponseObj, offset = 0, length = 50, sha256Hash) => {
    try {
        logger.info("Starting to fetch data with query conditions...");
        //Applying Filters
        const conditionMapping = {
            "New": 1,
            "Like New": 2,
            "Good": 3,
            "Fair": 4,
            "Poor": 5
        };
        let conditionIntegers = []
        if (query.condition && query.condition.length > 0) {
            conditionIntegers = query.condition.map((condition) => {
                if (conditionMapping[condition]) {
                    return conditionMapping[condition];
                } else {
                    return [];
                }
            });
        }


        const url = 'https://www.mercari.com/v1/api';
        let accessToken = initializationResponseObj.accessToken
        let payload = {
            operationName: 'searchFacetQuery',
            variables: {
                criteria: {
                    offset: offset,
                    soldItemsOffset: 0,
                    promotedItemsOffset: 0,
                    sortBy: 2,
                    length: length,
                    query: query.keywords,
                    categoryIds: query.categoryId,
                    itemConditions: conditionIntegers,
                    shippingPayerIds: [],
                    sizeGroupIds: [],
                    sizeIds: [],
                    itemStatuses: [1],
                    customFacets: [],
                    facets: [1, 2, 3, 5, 7, 8, 9, 10, 11, 13, 16, 18],
                    authenticities: [],
                    deliveryType: 'all',
                    state: null,
                    locale: null,
                    shopPageUri: null,
                    withCouponOnly: null,
                    showDescription: false
                },
                categoryId: 0
            },
            extensions: {
                persistedQuery: {
                    version: 1,
                    sha256Hash: '038c4f52f0f4d5d73db00df065828e2d94ad9c19d67e337d9fa8922db8613fec'
                }
            }
        };

        if (query.minPrice !== null && query.minPrice !== undefined && query.minPrice !== '') {
            payload.variables.criteria.minPrice = parseInt(query.minPrice) * 100;
        }

        if (query.maxPrice !== null && query.maxPrice !== undefined && query.maxPrice !== '') {
            payload.variables.criteria.maxPrice = parseInt(query.maxPrice) * 100;
        }

        const config = {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        };
        logger.info(`Sending request to fetch products with offset ${offset} and length ${length}`);

        try {
            const response = await axios.post(url, payload, config);
            logger.info(`Successfully fetched data for ${query.keywords} with ${response.data.data.search.itemsList.length} items.`);

            if (response.data && response.data.errors) {
                logger.error(`API returned errors: ${JSON.stringify(response.data.errors)}`);
                throw new Error(`API errors: ${response.data.errors.map(err => err.message).join('; ')}`);
            }

            if (response.data && response.data.data && response.data.data.search && response.data.data.search.itemsList) {
                logger.info(`Successfully fetched data for ${query.keywords} with ${response.data.data.search.itemsList.length} items.`);
                return response.data;
            } else if (response.data.data && response.data.data.search && response.data.data.search.itemsList.length === 0) {
                logger.error(`API did not return any results for query: ${query.keywords}`);
                throw new Error('API does not contain any result for the given query.');
            } else {
                logger.error('Unexpected response structure from API');
                throw new Error('Unexpected response structure from API');
            }


        } catch (error) {
            logger.error(`Error fetching data: ${error}`);
            throw new Error(error.message)
        }
    } catch (error) {
        logger.error(`Error Occured: ${error.message}`)
        throw new Error(error.message)
    }
};

// Fetchinf Each Product
const fetchProductDetails = async (productId, initializationResponseObj, sha256Hash) => {
    const baseAPIUrl = 'https://www.mercari.com/v1/api';

    let accessToken = initializationResponseObj.accessToken
    let userAgent = initializationResponseObj.user.userAgent;
    userAgent = 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_3 like Mac OS X) AppleWebKit/603.3.8 (KHTML, like Gecko) Version/10.0 Mobile/14G60 Safari/602.1'
    let csrfToken = initializationResponseObj.csrf;

    const operationName = 'productQuery';
    const id = productId;
    const limit = 60;
    const version = 1;
    const includePublicComments = false;
    const includeSimilarItems = true;
    // const sha256Hash = '112c98aa52fd00c55fcf7741ec831e7e636c297f0aa4800ae40a976f4c4042dc';


    const variables = encodeURIComponent(JSON.stringify({ id, includeSimilarItems, limit }));
    const extensions = encodeURIComponent(JSON.stringify({ persistedQuery: { version, sha256Hash: sha256Hash } }));

    const url = `${baseAPIUrl}?operationName=${operationName}&variables=${variables}&extensions=${extensions}`;
    // let url = 'https://www.mercari.com/v1/api?operationName=productQuery&variables=%7B%22id%22%3A%22m92728467837%22%2C%22includeSimilarItems%22%3Atrue%2C%22limit%22%3A60%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22af272ef479f305cb50e47111281c9eaf9c81512494f3dba5a673b9bdc18a243b%22%7D%7D'
    // const url = 'https://www.mercari.com/v1/api?operationName=productQuery&variables=%7B%22id%22%3A%22m12276283160%22%2C%22includeSimilarItems%22%3Atrue%2C%22limit%22%3A60%2C%22includePublicComments%22%3Atrue%2C%22publicCommentsInput%22%3A%7B%22pageSize%22%3A1%2C%22sortOrder%22%3A%22oldest_first%22%7D%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22112c98aa52fd00c55fcf7741ec831e7e636c297f0aa4800ae40a976f4c4042dc%22%7D%7D'

    try {

        const response = await axios.get(url, {
            headers: {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "apollo-require-preflight": "true",
                "authorization": `Bearer ${accessToken}`,
                "content-type": "application/json",
                "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Google Chrome\";v=\"116\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-app-version": "1",
                "x-csrf-token": csrfToken,
                "x-double-web": "1",
                "x-ld-variants": "delightful-tracking:1;web-throttle-sold-out-items-in-search-result:4;web-promote-items-lane:2;web-to-app-post-reg:1;sell-now-web-to-app-post-reg:2;search-experiment-master-1:0;search-experiment-master-2:1;search-suggest-with-lux-filter:0;web-anon-home-phase-one:0;search_re_rank_v2_web:3;search_re_rank_facet_web:2;search_re_rank_promote_web:2;Local-web-purchase-funnel-optimization:0;send-ld-variant-to-braze:0;web-intro-second-photo-on-hover:0;web-intro-apple-express-checkout:2;web-new-paypal-popup:0;us-web-checkout-payments-zip-banner:2;us-web-checkout-payments-zip-widget:2;web-intro-gift-card:2;search_synonyms_web:0;web-intro-small-dollar-sign:0;web-home-nav-browse-for-anon:2;web_merchat_ai_dogfooding:2;web-full-bleed-thumbnail:3;venmo-enable-on-web:2;web-saved-search-thumbnail:0;web_search_promote_without_predefined_lane:0;search_rerank_listwise_web:1;search_qup0_v2_web:5;web_search_zone_shipping:4;web-seller-profile-update:0;SWITCH_facebook_oauth_hide:1;web-home-browse-zero-category:2;web-home-browse-one-category:2;web-for-you-pagination:1;cents:1;web-hashtag-in-search:2",
                "x-platform": "web",
                "x-web-device-info": "{\"iovation\":\"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\"}",
                "x-double-web": "1",
                "x-platform": "web",
                "User-Agent": userAgent,
            },
        });

        if (response.data && response.data.errors) {
            logger.error(`API returned errors: ${JSON.stringify(response.data.errors)}`);
            throw new Error(`API errors: ${response.data.errors.map(err => err.message).join('; ')}`);
        }

        if (response.data && response.data.data && response.data.data.item) {
            logger.info(`Successfully fetched product ${response.data.data.item.name} for ${id}.`);
            return response.data.data.item;
        } else if (response.data.data && response.data.data.item) {
            logger.error(`API did not return any results for query: ${query.keywords}`);
            throw new Error('API does not contain any result for the given query.');
        } else {
            logger.error('Unexpected response structure from API');
            throw new Error('Unexpected response structure from API');
        }

    } catch (error) {
        logger.error(`Error fetching product details: ${error}`);
        throw new Error(`${error.message}`)
    }
};

async function productExists(productId,filterIds) {
    const count = await MercariProducts.countDocuments({ productId: productId,filterId: { $in: filterIds } });
    return count > 0;
}
//Save all the data in the database
const saveOrUpdateProduct = async (productsDetails, filter, userId) => {
    const filterIds = [filter._id];

    const initialCount = await MercariProducts.countDocuments({ filterId: { $in: filterIds } });

    const bulkOps = productsDetails.map(productDetails => {
        return {
            updateOne: {
                filter: { productId: productDetails.productId },
                update: {
                    $set: {
                        site: productDetails.site,
                        name: productDetails.name,
                        price: productDetails.price,
                        shippingPrice: productDetails.shippingPrice,
                        description: productDetails.description,
                        checkout: productDetails.checkout,
                        images: productDetails.images,
                    },
                    $addToSet: {
                        filterId: { $each: [filter._id] }
                    }
                },
                upsert: true
            }
        };
    });

    try {
        await MercariProducts.bulkWrite(bulkOps);

        const finalCount = await MercariProducts.countDocuments({ filterId: { $in: filterIds } });

        const netIncrease = finalCount - initialCount;

        const totalNewOrUpdatedProducts = Math.max(0, netIncrease);
        logger.info(`Total new products scrapped for filter ${filter.search}: ${totalNewOrUpdatedProducts}`);
        return totalNewOrUpdatedProducts;

    } catch (error) {
        logger.error(`Error in bulk operation: ${error.message}`);
        throw new Error(`Error in bulk operation: ${error.message}`);
    }
};

module.exports = { processAndStoreProducts }