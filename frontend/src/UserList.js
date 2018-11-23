import React, {Component} from 'react';
import {Button, ButtonGroup, Container, Table} from 'reactstrap';
import {Link, withRouter} from 'react-router-dom';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import AppNavbar from './AppNavbar';
import Paging from './Paging';
import {customHttpRequest, customHttpRequestPage} from "./customHttpRequest";

class UserList extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    defaultSort = {
        direction: 'asc',
        field: 'id'
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            user: {},
            page: [],
            csrfToken: cookies.get('XSRF-TOKEN'),
            isLoading: true,
            sort: this.defaultSort
        };
        this.remove = this.remove.bind(this);
    }

    async componentDidMount() {
        this.setState({isLoading: true});
        await customHttpRequest('api/user', {credentials: 'include'}, this.props.history)
            .then(user => {
                console.log(user);
                this.setState({user});
            }, error => this.props.history.push(error.page));

        await customHttpRequest('api/users/page', {credentials: 'include'})
            .then(page => {console.log(page); this.setState({page, isLoading: false});},
                    error => {this.props.history.push(error.page)});

        // fetch('api/user', {credentials: 'include'})
        //     .then(response => response.json())
        //     .then(user => this.setState({user}))
        //     .catch(() => this.props.history.push('/'));
    }

    async remove(id) {
        await fetch(`api/user/${id}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': this.state.csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        }).then(() => {
            const {page} = this.state;
            page.content = [...page.content].filter(i => i.id !== id);
            this.setState({page});
        });
    }

    handleClickSort(pageNumber, fieldName, direction) {
        const {page} = this.state;

        if(!!pageNumber && page.pageable.pageNumber === pageNumber) return;

        let sort = {
          field: fieldName,
          direction: direction,
        };

        if (!fieldName && !direction ) {
            sort = this.state.sort;
        } else if (!fieldName || !direction ){
            sort = this.defaultSort;
        }
        customHttpRequestPage('api/users/page', pageNumber, sort, {credentials: 'include'})
            .then(page => this.setState({page, isLoading: false, sort}), error => this.props.history.push(error.page));
    }


    headerColumnWithSorting(title, name) {
        const {sort} = this.state;
        if (name === sort.field) {
            const nextDirection = (sort.direction === 'asc' ? 'desc' : '');
            const sortArrow = (sort.direction === 'asc' ? '▾' : sort.direction === 'desc' ? '▴' : '');
            return <th onClick={() => this.handleClickSort(0, name, nextDirection)}>{title} {sortArrow}</th>
        }

        return <th onClick={() => this.handleClickSort(0, name, 'asc')}>{title}</th>
    }

    render() {
        const {user, page, isLoading} = this.state;

        if(isLoading) {
            return <p>Loading...</p>;
        }

        const users = page.content;

        //{'▾':'▴'}
        const userList = users.map(lUser => {
            return (
                <tr key={lUser.id}>
                    <td>{lUser.username}</td>
                    <td>{lUser.firstName}</td>
                    <td>{lUser.phoneNumber}</td>
                    <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={'/user/' + lUser.id}>Edit</Button>
                        {lUser.id !== user.id &&
                        <Button size="sm" color="danger" onClick={() => this.remove(lUser.id)}>Delete</Button>
                        }
                    </ButtonGroup>
                    </td>
                </tr>
            )
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/user/new">Add User</Button>
                    </div>
                    <h3>Users</h3>
                    <Table className="mt-4">
                        <thead>
                            <tr>
                                {this.headerColumnWithSorting('Имя пользователя', 'username')}
                                {this.headerColumnWithSorting('Имя', 'firstName')}
                                {this.headerColumnWithSorting('Номер телефона', 'phoneNumber')}
                                <th width="10%">Действия</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userList}
                        </tbody>
                    </Table>
                    <Paging countPagesInRow={9} page={page} onClick={(pageNumber) => this.handleClickSort(pageNumber)}/>
                </Container>
            </div>
        )
    }
}

export default withCookies(withRouter(UserList));