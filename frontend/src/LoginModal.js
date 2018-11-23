import React, {Component} from 'react';
import {Alert, Button, Form, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';
import {withCookies} from 'react-cookie';
import {Link} from 'react-router-dom';
import {customHttpRequest} from "./customHttpRequest";

class LoginModal extends Component {
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
        }).then(this.props.toggleLoginModal, () => this.setState({isError: true}));
    }

    render() {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={this.props.toggleLoginModal} backdrop={true}>
                    <Form onSubmit={this.handleSubmit}>
                        <ModalHeader toggle={this.props.toggleLoginModal}>Вход</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                {
                                    this.state.isError &&
                                    <Alert color="danger">
                                        Имя пользователя или пароль не верны
                                    </Alert>
                                }
                            </FormGroup>
                            <FormGroup>
                                <Label for="username">Имя пользователя</Label>
                                <Input type="text" name="username" id="username" onChange={this.handleChange}
                                       autoComplete="username"/>
                            </FormGroup>
                            <FormGroup>
                                <Label for="password">Пароль</Label>
                                <Input type="password" name="password" id="password" onChange={this.handleChange}
                                       autoComplete="password"/>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <FormGroup>
                                <Button color="success" type="submit">Вход</Button>{' '}
                                <Button color="primary" tag={Link} to="/registration">Регистрация</Button>
                            </FormGroup>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default withCookies(LoginModal);