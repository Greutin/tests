import React, {Component} from 'react';
import {Button, Col, Container, Form, FormGroup, Input, Label, Row, Table} from 'reactstrap';
import {withRouter} from 'react-router-dom';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import AppNavbar from './AppNavbar';
import Paging from './Paging';
import {customHttpRequest} from "./customHttpRequest";

class MovieList extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    defaultSort = {
        field: "title",
        direction: "asc",
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            page: [],
            item: {},
            csrfToken: cookies.get('XSRF-TOKEN'),
            isLoading: true,
            sort: this.defaultSort
        };
        this.remove = this.remove.bind(this);
        this.handleSubmitMovie = this.handleSubmitMovie.bind(this);
        this.handleClickSort = this.handleClickSort.bind(this);
        this.handleChangeMovie = this.handleChangeMovie.bind(this);
    }

    async componentDidMount() {
        this.setState({isLoading: true});

        await customHttpRequest('/redis/movies', {credentials: 'include'})
            .then(page => {console.log(page); this.setState({page, isLoading: false});},
                    error => {this.props.history.push(error.page)});
    }

    async remove(id) {
        await fetch(`redis/movie/${id}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': this.state.csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
        }).then(response => {
            if(response.status === 200) {
                const {page} = this.state;
                let newPage = [...page].filter((value, key) => key !== id);
                this.setState({page: newPage});
            }
        });
    }

    handleClickSort(pageNumber, fieldName, direction) {
        // const {page} = this.state;
        //
        // if(!!pageNumber && page.pageable.pageNumber === pageNumber) return;
        //
        // let sort = {
        //   field: fieldName,
        //   direction: direction,
        // };
        //
        // if (!fieldName && !direction ) {
        //     sort = this.state.sort;
        // } else if (!fieldName || !direction ){
        //     sort = this.defaultSort;
        // }
        //
        // let data = '';
        // data += sort.field + '.dir=' + sort.direction + '&';
        // data += 'sort=' + sort.field + '&';
        // data += 'page=' + pageNumber;
        // fetch('api/users/page?' + data, {credentials: 'include'})
        //     .then(response => response.json())
        //     .then(page => {this.setState({page, isLoading: false, sort}); console.log(page);})
        //     .catch(() => this.props.history.push('/login'));
    }



    handleSubmitMovie(event) {
        event.preventDefault();
        // this.toggleAlertChange();
        const {csrfToken, item} = this.state;
        fetch('/redis/movie', {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
            credentials: 'include',
        }).then(() => {
            // this.setState({successChange:true});
            fetch('/redis/movies', {credentials: 'include'})
                .then(response => response.json())
                .then(page => this.setState({page}))
            /*.catch(() => this.props.history.push('/login'))*/;
        }, () => {/*this.setState({errorChange: true})*/});
    }

    changeObject(nameObject, event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        let state = {};
        let item = {...this.state[nameObject]};

        item[name] = value;
        state[nameObject] = item;

        this.setState(state);
    }

    handleChangeMovie(event) {
        this.changeObject('item', event);
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
        const {page, isLoading} = this.state;

        if(isLoading) {
            return <p>Loading...</p>;
        }

        console.log(page);

        //{'▾':'▴'}
        const movieList = !page ? [] : page.map(movie => {
            return (
                <tr key={movie.id}>
                    <td>{movie.id}</td>
                    <td>{movie.name}</td>
                </tr>
            )
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <Row>
                        <Col sm={4}>
                            <Form onSubmit={this.handleSubmitMovie}>
                                {/*<FormGroup>*/}
                                    {/*<Alert color="success" isOpen={this.state.successChange} toggle={this.toggleAlertChange} fade={false}>*/}
                                        {/*Данные успешно изменены!*/}
                                    {/*</Alert>*/}
                                    {/*<Alert color="danger" isOpen={this.state.errorChange} toggle={this.toggleAlertChange} fade={false}>*/}
                                        {/*Данные не изменены!*/}
                                    {/*</Alert>*/}
                                {/*</FormGroup>*/}
                                <FormGroup>Movie</FormGroup>
                                <FormGroup>
                                    <Label for="id">ID</Label>
                                    <Input type="text" name="id" id="id" onChange={this.handleChangeMovie}/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="name">Title</Label>
                                    <Input type="onChange" name="name" id="name" onChange={this.handleChangeMovie}/>
                                </FormGroup>
                                <FormGroup>
                                    <Button color="success" type="submit">Add</Button>
                                </FormGroup>
                            </Form>
                        </Col>
                        <Col sm={8}>
                            <h3>Movies</h3>
                            <Table className="mt-4">
                                <thead>
                                    <tr>
                                        {this.headerColumnWithSorting('Идентификатор', 'id')}
                                        {this.headerColumnWithSorting('Наименование', 'name')}
                                    </tr>
                                </thead>
                                <tbody>
                                    {movieList}
                                </tbody>
                            </Table>
                            <Paging countPagesInRow={9} page={page} onClick={(pageNumber) => this.handleClickSort(pageNumber)}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default withCookies(withRouter(MovieList));