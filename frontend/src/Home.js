import React, {Component} from 'react';
import {withCookies} from 'react-cookie';
import './App.css';
import AppNavbar from './AppNavbar';
import {customHttpRequest} from "./customHttpRequest";

class Home extends Component {
    state = {
        isLoading: true,
        user: undefined,
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state.csrfToken = cookies.get('XSRF-TOKEN');
    }

    render() {
        return (
            <div>
                <AppNavbar/>
            </div>
        );
    }
}

export default withCookies(Home);