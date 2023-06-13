import { getTextNodes, transformNewsNodes } from './utils';
import { getStyleFromOpinionLevel, generatorToList } from './utils';
import OpinologoAPI from './commons/OpinologoAPI';

const filteredSentenceStyle = 'display:none';

let api = new OpinologoAPI();

api.getSelectors()
    .then(selectors => {
        let selector = selectors.find(s => (new RegExp(s.url))
            .test(document.URL));

        if (selector !== undefined) {
            let newsSentencesNode = document.querySelector(selector.selector);
            let textNodes = generatorToList(getTextNodes(newsSentencesNode));

            api.classifyNewsSentences(newsSentencesNode.textContent)
                .then(sentencesOpinionLevel => transformNewsNodes(textNodes, sentencesOpinionLevel))
                .then(() => {
                    readConfigurationAndFormatNews();
                    installConfigurationChangeHandler();
                });
        }
    });

function installConfigurationChangeHandler() {
    chrome.storage.local.get(document.URL)
        .then(configs => {
            if (document.URL in configs) {
                formatNews(configs[document.URL]);
            }
        });
}

function readConfigurationAndFormatNews() {
    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'local') {
            if (document.URL in changes) {
                formatNews(changes[document.URL].newValue);
            }
        }
    });
}

function formatNews(urlConfig) {
    let tags = Array.prototype.filter.call(document.querySelectorAll('span'),
        span => span.hasAttribute('tag-opinologo'));

    if (!urlConfig.highlightSentences && !urlConfig.filterSentences) {
        tags.forEach(tag => tag.setAttribute('style', ''));
    } else {
        tags.forEach(tag => {
            let opinionLevel = tag.getAttribute('tag-opinologo');
            let style = '';

            if (opinionLevel != 'None') {
                if (urlConfig.filterSentences && opinionLevel > urlConfig.filteringLevel) {
                    style = filteredSentenceStyle;
                } else if (urlConfig.highlightSentences) {
                    style = getStyleFromOpinionLevel(opinionLevel);
                }
            }

            tag.setAttribute('style', style);
        });
    }
}