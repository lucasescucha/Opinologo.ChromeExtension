const defaultURLConfiguration = {
    highlightSentences: false,
    filterSentences: false,
    filteringLevel: 5
};

chrome.tabs.onUpdated.addListener((_tabId, info, tab) => {
    if (info.status === 'loading') {
        chrome.storage.local.get(tab.url)
            .then(data => {
                if ((tab.url !== undefined) && !(tab.url in data)) {
                    let urlConfig = {};
                    urlConfig[tab.url] = defaultURLConfiguration;
                    chrome.storage.local.set(urlConfig);
                }
            });
    }
});