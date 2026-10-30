// CinePulse Web Bridge - declarativeNetRequest Media Header Relay
const RULE_ID = 1001;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message?.type === 'CINEPULSE_SET_STREAM_HEADERS') {
    const { urlPattern, referer, origin } = message;
    if (!urlPattern) {
      sendResponse({ ok: false, error: 'urlPattern eksik' });
      return;
    }

    const requestHeaders = [];
    if (referer) {
      requestHeaders.push({ header: 'Referer', operation: 'set', value: referer });
    }
    if (origin) {
      requestHeaders.push({ header: 'Origin', operation: 'set', value: origin });
    }

    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [RULE_ID],
      addRules: [{
        id: RULE_ID,
        priority: 1,
        action: {
          type: 'modifyHeaders',
          requestHeaders: requestHeaders.length > 0 ? requestHeaders : undefined,
          responseHeaders: [
            { header: 'Access-Control-Allow-Origin', operation: 'set', value: '*' },
            { header: 'Access-Control-Allow-Methods', operation: 'set', value: 'GET, HEAD, OPTIONS' },
            { header: 'X-Frame-Options', operation: 'remove' },
            { header: 'Content-Security-Policy', operation: 'remove' }
          ]
        },
        condition: {
          urlFilter: urlPattern,
          resourceTypes: ['xmlhttprequest', 'media', 'sub_frame']
        }
      }]
    }, () => {
      sendResponse({ ok: true });
    });
    return true; // async yanıt döneceğiz
  }

  if (message?.type === 'CINEPULSE_CLEAR_STREAM_HEADERS') {
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [RULE_ID]
    }, () => {
      sendResponse({ ok: true });
    });
    return true;
  }
});
