import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label, Row, Col, Table } from 'reactstrap';
import AppNavbar from './AppNavbar';
import { instanceOf } from 'prop-types';
import { Cookies, withCookies } from 'react-cookie';
import {customHttpRequestPage} from "./customHttpRequest";
import Paging from "./Paging";

class Profile extends Component {
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
            child: this.emptyItem,
            csrfToken: cookies.get('XSRF-TOKEN'),
            sort: this.defaultSort,
        };
    }

    async componentDidMount() {
        try {
            let state = {};
            state.child = await (await fetch(`/api/parent/${this.props.match.params.parentId}/child/${this.props.match.params.childId}`, {credentials: 'include'})).json();
            await customHttpRequestPage(`/api/child/${state.child.id}/themes/page`, 0, this.defaultSort, {credentials: 'include'})
                .then(page => state.tests = page,
                    error => this.props.history.push(error.page));
            this.setState(state);
        } catch (error) {
            this.props.history.push('/');
        }
    }

    handleClickSort(pageNumber, fieldName, direction) {
        const {child, tests} = this.state;

        if(!!pageNumber && tests.pageable.pageNumber === pageNumber) return;

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
        customHttpRequestPage(`/api/child/${child.id}/themes/page`, pageNumber, sort, {credentials: 'include'})
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
        const {child, tests} = this.state;
        console.log(this.state);

        const testsList = tests && tests.content && tests.content.map((test) => {
            return (
                <tr key={test.id}>
                    <td>{test.theme}</td>
                    <td>{test.childTests && test.childTests.complexity.complexityRu}</td>
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
                            {child.user && child.user.firstName}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            Фамилия:
                        </Col>
                        <Col sm={8}>
                            {child.user && child.user.lastName}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            Имя пользователя:
                        </Col>
                        <Col sm={8}>
                            {child.user && child.user.username}
                        </Col>
                    </Row>
                    <Row>
                        <Col sm={4}>
                            Номер телефона:
                        </Col>
                        <Col sm={8}>
                            {child.user && child.user.phoneNumber}
                        </Col>
                    </Row>
                    <br />
                    {tests && tests.content && (
                        <Row>
                            <Col>
                                <h4>Тесты</h4>
                                <Table className="mt-4" hover>
                                    <thead>
                                    <tr>
                                        {this.headerColumnWithSorting('Тема', 'theme')}
                                        {this.headerColumnWithSorting('Сложность', 'childrenTests.complexity.complexityNum')}
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {testsList}
                                    </tbody>
                                </Table>
                                <Paging countPagesInRow={9} page={tests} onClick={(pageNumber) => this.handleClickSort(pageNumber)}/>
                            </Col>
                        </Row>
                    )}
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(Profile));