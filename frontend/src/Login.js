import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label, Alert, Row, Col} from 'reactstrap';
import {withCookies} from 'react-cookie';
import AppNavbar from './AppNavbar';
import {customHttpRequest} from "./customHttpRequest";

class Login extends Component {
    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            user: {
                _csrf: cookies.get('XSRF-TOKEN')
            },
            isError: false,
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        // let port = (window.location.port ? ':' + window.location.port : '');
        // if (port === ':3000') {
        //     port = ':48080';
        //     window.location.href = '//' + window.location.hostname + port + '/login';
        // }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let user = {...this.state.user};
        user[name] = value;
        this.setState({user});
    }

    async handleSubmit(event) {
        event.preventDefault();

        const {user} = this.state;

        await customHttpRequest('/login', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:
                '_csrf=' + user._csrf
                + '&username=' + user.username
                + '&password=' + user.password,
        }).then(() => this.props.history.push('/'))
            .catch(() => this.setState({isError: true}));
    }

    render() {
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <Row>
                        <Col xs={{size: 4, offset: 4}}>
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup row>
                                    <Label for="exampleEmail">Вход</Label>
                                </FormGroup>
                                <FormGroup row>
                                    {
                                        this.state.isError &&
                                        <Alert color="danger">
                                            Имя пользователя или пароль не верны
                                        </Alert>
                                    }
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="username">Имя пользователя</Label>
                                    <Input type="text" name="username" id="username" onChange={this.handleChange}
                                           autoComplete="username"/>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="password">Пароль</Label>
                                    <Input type="password" name="password" id="password" onChange={this.handleChange}
                                           autoComplete="password"/>
                                </FormGroup>
                                <FormGroup row>
                                    <Button color="primary" type="submit">Log in</Button>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(Login));