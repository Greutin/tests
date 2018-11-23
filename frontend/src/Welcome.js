import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {withCookies} from 'react-cookie';
import './App.css';

class Welcome extends Component {
    render() {
        return (
            <div>
                Welcome
            </div>
        );
    }
}

export default withCookies(withRouter(Welcome));