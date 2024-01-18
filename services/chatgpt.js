const apiKey = require('../config.json').chatGPT_key;

if (!apiKey) { return; }

const { ChatGPTAPI } = require('chatgpt');
const chatgpt = new ChatGPTAPI({
	apiKey: apiKey
});

module.exports = chatgpt;