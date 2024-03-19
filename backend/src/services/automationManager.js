const automationIntervals = {};
const logger = require('../utils/logger')
const startAutomation = (filterId, intervalFunction, intervalMilliseconds) => {
    const intervalId = setInterval(intervalFunction, intervalMilliseconds);
    automationIntervals[filterId] = intervalId;
    logger.info(`Automation started for filter ID ${filterId}`);
};

const stopAutomation = (filterId) => {
    if (automationIntervals[filterId]) {
        clearInterval(automationIntervals[filterId]);
        delete automationIntervals[filterId];
        logger.info(`Automation stopped for filter ID ${filterId}`);
    } else {
        logger.info(`No active automation found for filter ID ${filterId}`);
    }
};

module.exports = { startAutomation, stopAutomation };