import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Row, Col, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from 'react-cookie';
import {customHttpRequestPage} from "./customHttpRequest";
import Paging from "./Paging";

class ProfileParent extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired,
    };

    emptyItem = { // class User
        username: '',
        firstName: '',
        lastName: '',
        phoneNumber: '',
    };

    defaultSort = {
        direction: 'asc',
        field: 'id'
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            user: this.emptyItem,
            csrfToken: cookies.get('XSRF-TOKEN'),
            sort: this.defaultSort,
        };
    }

    async componentDidMount() {
        try {
            let state = {};
            state.user = await (await fetch(`/api/parent/${this.props.match.params.id}`, {credentials: 'include'})).json();
            await customHttpRequestPage(`/api/parent/${state.user.id}/children/page`, 0, this.defaultSort, {credentials: 'include'})
                .then(page => state.children = page,
                    error => this.props.history.push(error.page));
            this.setState(state);
        } catch (error) {
            this.props.history.push('/');
        }
    }

    handleClickSort(pageNumber, fieldName, direction) {
        const {user, children} = this.state;

        if(!!pageNumber && children.pageable.pageNumber === pageNumber) return;

        pageNumber = !pageNumber ? 0 : pageNumber;

        let sort = {
            field: fieldName,
            direction: direction,
        };

        if (!fieldName && !direction ) {
            sort = this.state.sort;
        } else if (!fieldName || !direction ){
            sort = this.defaultSort;
        }
        customHttpRequestPage(`/api/parent/${user.id}/children/page`, pageNumber, sort, {credentials: 'include'})
            .then(children => this.setState({children, isLoading: false, sort}), error => this.props.history.push(error.page));
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
        const {user, children} = this.state;
        console.log(this.state);

        const childrenList = children && children.content && children.content.map((child) => {
            return (
                <tr key={child.id} onClick={() => this.props.history.push(`/parent/${user.id}/child/${child.id}`)}>
                    <td>{child.user && child.user.firstName}</td>
                    <td>{child.user && child.user.lastName}</td>
                    <td>{child.user && child.user.phoneNumber}</td>
                </tr>
            )
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <Row>
                        <Col>
                            <h3>Профиль</h3>
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            Имя:
                        </Col>
                        <Col sm={8}>
                            {user.user && user.user.firstName}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            Фамилия:
                        </Col>
                        <Col sm={8}>
                            {user.user && user.user.lastName}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            Имя пользователя:
                        </Col>
                        <Col sm={8}>
                            {user.user && user.user.username}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            Номер телефона:
                        </Col>
                        <Col sm={8}>
                            {user.user && user.user.phoneNumber}
                        </Col>
                    </Row>
                    <br />
                    {children && children.content && (
                        <Row>
                            <Col>
                                <h4>Дети</h4>
                                <Table className="mt-4" hover>
                                    <thead>
                                    <tr>
                                        {this.headerColumnWithSorting('Имя', 'user.firstName')}
                                        {this.headerColumnWithSorting('Фамилия', 'user.lastName')}
                                        {this.headerColumnWithSorting('Номер телефона', 'user.phoneNumber')}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {childrenList}
                                    </tbody>
                                </Table>
                                <Paging countPagesInRow={9} page={children} onClick={(pageNumber) => this.handleClickSort(pageNumber)}/>
                            </Col>
                        </Row>
                    )}
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(ProfileParent));