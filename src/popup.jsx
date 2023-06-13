import React from 'react';
import { render } from 'react-dom';

import './styles.css';

export default class Popup extends React.Component {

    constructor(props) {
        super(props);

        this.urlConfig = {
            highlightSentences: false,
            filterSentences: false,
            filteringLevel: 5
        }

        this.state = {
            enable: false,
            filteringLevelControlEnable: false,
        };

        let queryOptions = {
            active: true,
            lastFocusedWindow: true
        };

        chrome.tabs.query(queryOptions)
            .then(async function onQuery(result) {
                if (result.length === 1 && result[0].url.length !== 0) {
                    this.activeUrl = result[0].url;
                    let data;

                    do {
                        await new Promise(resolve => setTimeout(resolve, 500));
                        data = await chrome.storage.local.get(this.activeUrl);
                    } while (!(this.activeUrl in data));

                    Object.assign(this.urlConfig, data[this.activeUrl]);

                    this.setState({
                        filteringLevelControlEnable: this.urlConfig.filterSentences,
                        enable: true
                    });
                }
            }.bind(this));
    }

    handleHighlighSentencesChange = (event) => {
        this.urlConfig.highlightSentences = event.target.checked;
        this.updateConfiguration();
    }

    handleFilterSentencesChange = (event) => {
        this.urlConfig.filterSentences = event.target.checked;
        this.updateConfiguration();
        this.setState({ filteringLevelControlEnable: event.target.checked });
    }

    handleFilteringLevelChange = (event) => {
        this.urlConfig.filteringLevel = event.target.value;
        this.updateConfiguration();
    };

    updateConfiguration = () => {
        this.setState({ enable: false });
        let config = {};
        config[this.activeUrl] = this.urlConfig;
        chrome.storage.local.set(config)
            .then(() => this.setState({ enable: true }));
    }

    render() {
        return (
            <div className='popup'>
                <div className='overlay' style={{ display: this.state.enable ? 'none' : 'block' }}></div>

                <div className='appName'>opinologo.ar</div>

                <input type='checkbox' id='highlightSentences' checked={this.urlConfig.highlightSentences}
                    onChange={this.handleHighlighSentencesChange} />
                <label for='highlightSentences'>Marcar oraciones por nivel de opinion</label>

                <br />

                <input type='checkbox' id='filterSentences' checked={this.urlConfig.filterSentences}
                    onChange={this.handleFilterSentencesChange} />
                <label for='filterSentences'>Filtrar por nivel de opinion</label>

                <br />

                <input type='range' id='filteringLevel' value={this.urlConfig.filteringLevel} min='1' max='10' step='1'
                    onChange={this.handleFilteringLevelChange} disabled={!this.state.filteringLevelControlEnable} />
                <label for='filteringLevel'>Nivel de opinión</label>
            </div>
        );
    }
}

render(<Popup />, document.getElementById('popup-component'));