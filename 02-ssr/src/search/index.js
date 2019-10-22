import React from 'react';
import ReactDOM from 'react-dom';
import '../../common'
import logo from './images/1.jpg';
import './index.less';

class Search extends React.Component {
    constructor() {
        super(...arguments);

        this.state = {
            Text: null
        };
    }

    loadComponent() {
        import('./text.js').then((Text) => {
            this.setState({
                Text: Text.default
            });
        });
    }

    render() {
        const { Text } = this.state;
        return <div className="search-text">
            {
                Text ? <Text /> : null
            }
            搜索文字的内容!ddddf<img src={ logo } onClick={ this.loadComponent.bind(this)}/>
        </div>;
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('root')
);