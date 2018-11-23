import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Container, Form, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Table, Row, Col, Alert} from 'reactstrap';
import {Cookies, withCookies} from 'react-cookie';
import {instanceOf} from 'prop-types';
import AppNavbar from '../AppNavbar';
import Paging from "../Paging";
import {customHttpRequestPage} from "../customHttpRequest";

class Subject extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    emptyItem = {
        theme: '',
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
            item: this.emptyItem,
            subject: {},
            changedSubject: {},
            page: {},
            isLoading: true,
            sort: this.defaultSort,
            modal: false,
            successChange: false,
            errorChange: false,
            successSave: false,
            errorSave: false,
        };

        this.toggleModal = this.toggleModal.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeSubject = this.handleChangeSubject.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSubmitSubject = this.handleSubmitSubject.bind(this);

        this.toggleAlertChange = this.toggleAlertChange.bind(this);
        this.toggleAlertSave = this.toggleAlertSave.bind(this);
    }

    async componentDidMount() {
        await this.setState({isLoading: true});

        await fetch('/api/subject/' + this.props.match.params.id, {credentials: 'include'})
            .then(response => response.json())
            .then(subject => {this.setState({subject, changedSubject: subject}); console.log(subject)})
            /*.catch(() => this.props.history.push('/login'))*/;

        await customHttpRequestPage(`/api/subject/${this.props.match.params.id}/themes/page`, 0, this.defaultSort, {credentials: 'include'})
            .then(page => this.setState({page, isLoading: false}),
                error => this.props.history.push(error.page));

        await this.setState({isLoading: false});
    }

    handleChange(event) {
        this.changeObject('item', event);
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

    handleChangeSubject(event) {
        this.changeObject('changedSubject', event);
    }

    toggleModal() {
        this.setState({modal: !this.state.modal});
    }

    toggleAlertChange() {
        this.setState({successChange: false, errorChange: false});
    }

    toggleAlertSave() {
        this.setState({successSave: false, errorSave: false});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.toggleAlertSave();
        const {item, csrfToken, subject} = this.state;
        item.subject = subject;
        fetch('/api/theme', {
            method: 'POST',
            headers: {
                'X-XSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
            credentials: 'include',
        }).then(() => {
            this.setState({successSave: true});

            customHttpRequestPage(`/api/subject/${this.props.match.params.id}/themes/page`, 0, this.defaultSort, {credentials: 'include'})
                .then(page => this.setState({page, isLoading: false}),
                    error => this.props.history.push(error.page));

            this.toggleModal();
        }, () => this.setState({errorSave: true}));
    }

    handleSubmitSubject(event) {
        event.preventDefault();
        this.toggleAlertChange();
        const {csrfToken, changedSubject, subject} = this.state;
        changedSubject.classNumber = parseInt(changedSubject.classNumber);

        if(changedSubject.subject === subject.subject && changedSubject.classNumber === subject.classNumber) return;

        fetch('/api/subject', {
            method: 'PUT',
            headers: {
                'X-XSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(changedSubject),
            credentials: 'include',
        }).then(() => {
            this.setState({successChange:true});
            fetch('/api/subject/' + this.props.match.params.id, {credentials: 'include'})
                .then(response => response.json())
                .then(subject => this.setState({subject, changedSubject: subject}))
                /*.catch(() => this.props.history.push('/login'))*/;
        }, () => this.setState({errorChange: true}));
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

        customHttpRequestPage(`/api/subject/${this.props.match.params.id}/themes/page`, pageNumber, sort, {credentials: 'include'})
            .then(page => this.setState({page, isLoading: false, sort}),
                error => this.props.history.push(error.page));
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
        const {item, page, changedSubject, isLoading} = this.state;
        const themes = page.content;

        if(isLoading) {
            return <p>Loading...</p>;
        }
        const themeList = themes.map(theme => {
            return (
                <tr key={theme.id} onClick={() => this.props.history.push('/themes/' + theme.id)}>
                    <td>{theme.theme}</td>
                </tr>
            );
        });

        return (
            <div>
                <AppNavbar/>
                <Modal isOpen={this.state.modal} toggle={this.toggleModal} backdrop={true}>
                    <Form onSubmit={this.handleSubmit}>
                        <ModalHeader toggle={this.toggleModal}>Create Theme</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Alert color="danger" isOpen={this.state.errorSave} toggle={this.toggleAlertSave} fade={false}>
                                    Данные не сохранены!
                                </Alert>
                            </FormGroup>
                            <FormGroup>
                                <Label for="theme">Title</Label>
                                <Input type="text" name="theme" id="theme" value={item.theme || ''}
                                       onChange={this.handleChange} autoComplete="username"/>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit">Save</Button>{' '}
                            <Button color="secondary" onClick={this.toggleModal}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
                <Container fluid>
                    <Row>
                        <Col>
                            <Alert color="success" isOpen={this.state.successSave} toggle={this.toggleAlertSave} fade={false}>
                                Данные успешно сохранены!
                            </Alert>
                            <Form onSubmit={this.handleSubmitSubject}>
                                <FormGroup>
                                    <Alert color="success" isOpen={this.state.successChange} toggle={this.toggleAlertChange} fade={false}>
                                        Данные успешно изменены!
                                    </Alert>
                                    <Alert color="danger" isOpen={this.state.errorChange} toggle={this.toggleAlertChange} fade={false}>
                                        Данные не изменены!
                                    </Alert>
                                </FormGroup>
                                <FormGroup>Subject</FormGroup>
                                <FormGroup>
                                    <Label for="subject">Title</Label>
                                    <Input type="text" name="subject" id="subject" value={changedSubject.subject || ''}
                                           onChange={this.handleChangeSubject} autoComplete="username"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="classNumber">Class number</Label>
                                    <Input type="select" name="classNumber" id="classNumber" onChange={this.handleChangeSubject} value={changedSubject.classNumber}>
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
                                <FormGroup>
                                    <Button color="primary" type="submit">Change</Button>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="float-right">
                                <Button color="success" onClick={this.toggleModal}>Add Theme</Button>
                            </div>
                            <h3>Themes</h3>
                            <Table className="mt-4" hover>
                                <thead>
                                    <tr>
                                        {this.headerColumnWithSorting('Наименование', 'theme')}
                                    </tr>
                                </thead>
                                <tbody>
                                    {themeList}
                                </tbody>
                            </Table>
                            <Paging countPagesInRow={9} page={page} onClick={(pageNumber) => this.handleClickSort(pageNumber)}/>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(Subject));