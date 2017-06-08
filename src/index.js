import React from 'react';
import {render} from 'react-dom';

import './style/css/bootstrap.min.css';
import './index.css';

import {sampleText} from './sampleText';
import jsbeautifier from 'js-beautify';

class App extends React.Component {
    state = {
        text: sampleText
    };

    componentWillMount() {
        const text = localStorage.getItem('text');

        if (text) {
            this.setState({text: text});
        }
    }

    componentWillUpdate(nextProps, nextState) {
        localStorage.setItem('text', nextState.text);
    }

    saveTextAsFile() {
        let textToWrite = jsbeautifier(this.state.text);
        const textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
        const fileNameToSaveAs = "file" + Date.now() + ".js";
        const downloadLink = document.createElement("a");
        downloadLink.download = fileNameToSaveAs;
        downloadLink.innerHTML = "Download File";
        if (window.webkitURL !== null) {
            downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
        }
        else {
            downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
            downloadLink.style.display = "none";
            document.body.appendChild(downloadLink);
        }
        downloadLink.click();
    }

    editText = (event) => {
        const text = event.target.value;
        this.setState({text: text});
    };

    renderText = (text) => {
        let str = jsbeautifier(text);
        str = str.replace(/ /g, '&nbsp;');
        str = str.replace(/(?:\r\n|\r|\n)/g, '<br />');
        return {__html: str};
    };

    render() {
        return (
            <div className="container">
                <h1 className="title">JavaScript Realtime Indent</h1>
                <h3 className="title">Made with <a href="https://facebook.github.io/react/">React</a></h3>
                <div className="row">

                    <div className="col-sm-6">
                        <textarea className="form-control" value={this.state.text} rows="30"
                                  onChange={(e) => this.editText(e)}/>
                    </div>

                    <div className="col-sm-6">
                        <div dangerouslySetInnerHTML={this.renderText(this.state.text)}/>
                    </div>
                </div>

                <div className="col-md-6">
                    <button className="form-control" onClick={(e) => this.saveTextAsFile()}>
                        Download your indent file
                    </button>
                </div>

            </div>
        )
    }
}

render(
    <App/>,
    document.getElementById('root')
);