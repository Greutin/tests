import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from 'react-cookie';

class UserEdit extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
    };

    emptyItem = { // class User
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            item: this.emptyItem,
            csrfToken: cookies.get('XSRF-TOKEN'),
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            try {
                const user = await (await fetch(`/api/user/${this.props.match.params.id}`, {credentials: 'include'})).json();
                this.setState({item: user});
            } catch (error) {
                this.props.history.push('/');
            }
        }
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    async handleSubmit(event) {
        event.preventDefault();
        const {item, csrfToken} = this.state;

        await fetch('/api/user', {
            method: item.id || item.id === 0 ? 'PUT' : 'POST',
            headers: {
                'X-XSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
            credentials: 'include',
        });
        this.props.history.push('/users');
    }

    render() {
        const {item} = this.state;
        const title = <h2>{item.id || item.id === 0 ? 'Edit user' : 'Add user'}</h2>;

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    {title}
                    <Form onSubmit={this.handleSubmit}>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input type="text" name="username" id="username" value={item.username || ''}
                                   onChange={this.handleChange} autoComplete="username"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="firstName">First name</Label>
                            <Input type="text" name="firstName" id="firstName" value={item.firstName || ''}
                                   onChange={this.handleChange} autoComplete="firstName"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="lastName">Last name</Label>
                            <Input type="text" name="lastName" id="lastName" value={item.lastName || ''}
                                   onChange={this.handleChange} autoComplete="lastName"/>
                        </FormGroup>
                        <FormGroup>
                            <Label for="phoneNumber">Phone number</Label>
                            <Input type="text" name="phoneNumber" id="phoneNumber" value={item.phoneNumber || ''}
                                   onChange={this.handleChange} autoComplete="phoneNumber"/>
                        </FormGroup>
                        <FormGroup>
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" tag={Link} to="/users">Cancel</Button>
                        </FormGroup>
                    </Form>
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(UserEdit));