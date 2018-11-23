import React, {Component} from 'react';
import {withCookies} from 'react-cookie';
import {Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink,
    UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import {Link, withRouter} from 'react-router-dom';
import {customHttpRequest} from "./customHttpRequest";
import LoginModal from "./LoginModal";

class AppNavbar extends Component {
    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            isOpen: false,
            csrfToken: cookies.get('XSRF-TOKEN'),
            loginModal: false,
            isLoading: false,
            user: undefined,
        };
        this.toggle = this.toggle.bind(this);
        this.toggleLoginModal = this.toggleLoginModal.bind(this);

        this.logout = this.logout.bind(this);
    }

    componentDidMount() {
        fetch('/api/user', {credentials: 'include'})
            .then(response => response.json())
            .then(user => this.setState({user, isLoading: false}))
        .catch(() => {/*this.props.history.push('/login')*/});
    }

    toggle() {
        this.setState({isOpen: !this.state.isOpen,});
    }

    toggleLoginModal() {
        const {cookies} = this.props;
        fetch('/api/user', {credentials: 'include'})
            .then(response => response.json())
            .then(user => this.setState({csrfToken: cookies.get('XSRF-TOKEN'), user}))
            .catch(() => {/*this.props.history.push('/login')*/});

        this.setState({loginModal: !this.state.loginModal,});
    }

    logout() {
        customHttpRequest('/logout', {
            method: 'POST', credentials: 'include',
            headers: {'X-XSRF-TOKEN': this.state.csrfToken},
        }).then(() => {this.props.history.push("/"); this.setState({user: undefined})},
            error => {/*this.props.history.push(error.page)*/});
    }

    render() {
        const {user} = this.state;
        const role = user && user.role.role.substr(5).toLowerCase();
        const loginButton = !user ? /*tag={Link} to='/login'*/ (
            <NavItem><NavLink className="pointer"  onClick={this.toggleLoginModal}>Login</NavLink></NavItem>
        ) : (
            <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret>
                    Пользователь
                </DropdownToggle>
                <DropdownMenu right>
                    <DropdownItem tag={Link} to={`/${role}/${user.id}`}>
                        Профиль
                    </DropdownItem>
                    <DropdownItem divider/>
                    <DropdownItem onClick={this.logout}>
                        Выход
                    </DropdownItem>
                </DropdownMenu>
            </UncontrolledDropdown>
        );

        return (
            <div>
                <Navbar color="dark" dark expand="md">
                    <NavbarBrand tag={Link} to="/">Home</NavbarBrand>
                    <NavbarToggler onClick={this.toggle}/>
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink tag={Link} to='/users'>Пользователи</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to='/subjects'>Предметы</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink tag={Link} to='/movies'>Movie (Redis example)</NavLink>
                            </NavItem>
                            {loginButton}
                        </Nav>
                    </Collapse>
                </Navbar>
                <LoginModal isOpen={this.state.loginModal} toggleLoginModal={this.toggleLoginModal}/>
            </div>
        );
    }
}

export default withRouter(withCookies(AppNavbar));