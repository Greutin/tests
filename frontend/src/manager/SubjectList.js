import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table} from 'reactstrap';
import {Cookies, withCookies} from 'react-cookie';
import {instanceOf} from 'prop-types';
import AppNavbar from '../AppNavbar';
import Paging from "../Paging";
import {customHttpRequestPage} from "../customHttpRequest";

class SubjectList extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    emptyItem = {
        subject: '',
        classNumber: 1,
    };

    defaultSort = {
        direction: 'asc',
        field: 'id'
    };

    constructor(props) {
        super(props);
        const {cookies} = props;
        this.state = {
            csrfToken: cookies.get('XSRF-TOKEN'),
            user: {},
            item: this.emptyItem,
            page: {},
            isLoading: true,
            sort: this.defaultSort,
            modal: false,
        };

        this.toggle = this.toggle.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    componentDidMount() {
        this.setState({isLoading: true});
        this.reloadPage();
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let item = {...this.state.item};
        item[name] = value;
        this.setState({item});
    }

    reloadPage() {
        this.setState({isLoading: true});

        customHttpRequestPage('api/subjects/page', 0, this.defaultSort, {credentials: 'include'})
            .then(page => this.setState({page, isLoading: false}),
                    error => this.props.history.push(error.page));
    }

    toggle() {
        this.setState({modal: !this.state.modal});
    }

    handleSubmit(event) {
        event.preventDefault();
        const {item, csrfToken} = this.state;
        item.classNumber = parseInt(item.classNumber);
        fetch('/api/subject', {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
            credentials: 'include',
        }).then(() => {
            this.reloadPage();
            this.toggle();
        });
    }

    handleClickSort(pageNumber, fieldName, direction) {
        const {page} = this.state;

        if(!!pageNumber && page.pageable.pageNumber === pageNumber) return;

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
        customHttpRequestPage('api/subjects/page', pageNumber, sort, {credentials: 'include'})
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
        const {item, page, isLoading} = this.state;
        const subjects = page.content;

        if(isLoading) {
            return <p>Loading...</p>;
        }

        const subjectList = subjects.map(subject => {
            return (
                <tr key={subject.id} onClick={() => this.props.history.push('/subjects/' + subject.id)}>
                    <td>{subject.subject}</td>
                    <td>{subject.classNumber}</td>
                </tr>
            );
        });

        return (
            <div>
                <AppNavbar/>
                <Modal isOpen={this.state.modal} toggle={this.toggle} backdrop={true}>
                    <Form onSubmit={this.handleSubmit}>
                        <ModalHeader toggle={this.toggle}>Create Subject</ModalHeader>
                        <ModalBody>
                                <FormGroup>
                                    <Label for="subject">Title</Label>
                                    <Input type="text" name="subject" id="subject" value={item.subject || ''}
                                           onChange={this.handleChange} autoComplete="username"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="classNumber">Class number</Label>
                                    <Input type="select" name="classNumber" id="classNumber" onChange={this.handleChange}>
                                        <option value={1}>1</option>
                                        <option value={2}>2</option>
                                        <option value={3}>3</option>
                                        <option value={4}>4</option>
                                        <option value={5}>5</option>
                                        <option value={6}>6</option>
                                        <option value={7}>7</option>
                                        <option value={8}>8</option>
                                        <option value={9}>9</option>
                                        <option value={10}>10</option>
                                        <option value={11}>11</option>
                                    </Input>
                                </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" onClick={this.toggle}>Add Subject</Button>
                    </div>
                    <h3>Subjects</h3>
                    <Table className="mt-4" hover>
                        <thead>
                            <tr>
                                {this.headerColumnWithSorting('Наименование', 'subject')}
                                {this.headerColumnWithSorting('Номер класса', 'classNumber')}
                            </tr>
                        </thead>
                        <tbody>
                            {subjectList}
                        </tbody>
                    </Table>
                    <Paging countPagesInRow={9} page={page} onClick={(pageNumber) => this.handleClickSort(pageNumber)}/>
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(SubjectList));