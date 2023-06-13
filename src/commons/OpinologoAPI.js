export default class OpinologoAPI {
    constructor() {
        this.urlBase = "http://localhost:5000/api/v0/";
    }

    async getSelectors() {
        let url = this.urlBase + "selectors/";

        return fetch(url).then(response => response.json());
    }

    async classifyNewsSentences(newsText) {
        let url = this.urlBase + "classify/";

        return fetch(url, {
            method: 'POST',
            body: JSON.stringify({ newsText })
        }).then(response => response.json());
    }
}