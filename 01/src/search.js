import React from 'react';
import ReactDOM from 'react-dom';
import logo from '../images/1.jpg';
import './search.less';

class Search extends React.Component {
    render() {
        return <div className="search-text">
            搜索文字的内容!ddddf<img src={ logo } />
        </div>;
    }
}

ReactDOM.render(
    <Search />,
    document.getElementById('root')
);