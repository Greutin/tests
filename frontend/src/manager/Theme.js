import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Button, ButtonGroup, Container, Form, FormGroup, Input, Label, Table, Row, Col} from 'reactstrap';
import {Cookies, withCookies} from 'react-cookie';
import {instanceOf} from 'prop-types';
import AppNavbar from '../AppNavbar';
import Paging from "../Paging";
import {customHttpRequestPage} from "../customHttpRequest";

class Theme extends Component {
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
            csrfToken: cookies.get('XSRF-TOKEN'),
            theme: {},
            changedTheme: {},
            page: {},
            isLoading: true,
            sort: this.defaultSort,
        };

        this.handleChangeTheme = this.handleChangeTheme.bind(this);

        this.handleSubmitTheme = this.handleSubmitTheme.bind(this);
    }

    async componentDidMount() {
        this.setState({isLoading: true});

        await fetch('/api/theme/' + this.props.match.params.id, {credentials: 'include'})
            .then(response => response.json())
            .then(theme => {this.setState({theme, changedTheme: theme}); console.log(theme)})
            /*.catch(() => this.props.history.push('/login'))*/;


        await customHttpRequestPage(`/api/theme/${this.props.match.params.id}/questions/page`, 0, this.defaultSort, {credentials: 'include'})
            .then(page => this.setState({page}),
                error => this.props.history.push(error.page));

        await this.setState({isLoading: false});
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

    handleChangeTheme(event) {
        this.changeObject('changedTheme', event);
    }

    handleSubmitTheme(event) {
        event.preventDefault();

        const {csrfToken, changedTheme, theme} = this.state;

        if(changedTheme.theme === theme.theme) return;

        fetch('/api/theme', {
            method: 'PUT',
            headers: {
                'X-XSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(changedTheme),
            credentials: 'include',
        }).then(() => {
            fetch('/api/theme/' + this.props.match.params.id, {credentials: 'include'})
                .then(response => response.json())
                .then(theme => {this.setState({theme, changedTheme: theme}); console.log(theme)})
                /*.catch(() => this.props.history.push('/login'))*/;
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

        customHttpRequestPage(`/api/theme/${this.props.match.params.id}/questions/page`, pageNumber, sort, {credentials: 'include'})
            .then(page => this.setState({page, sort}),
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
        const {page, changedTheme, isLoading} = this.state;
        const questions = page.content;

        if(isLoading) {
            return <p>Loading...</p>;
        }
        const questionList = questions && questions.map(question => {
            return (
                <tr key={question.id} onClick={() => {/*this.props.history.push('/questions/' + question.id)*/}} >
                    <td>{question.question}</td>
                    <td>{question.questionType.questionTypeRu}</td>
                    <td>{question.complexity.complexityRu}</td>
                    <td>
                        <ButtonGroup>
                            <Button size="sm" color="primary" tag={Link} to={`/themes/${this.props.match.params.id}/question/${question.id}`}>Edit</Button>
                        </ButtonGroup>
                    </td>
                </tr>
            );
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <Row>
                        <Col>
                            <Form onSubmit={this.handleSubmitTheme}>
                                <FormGroup>Theme</FormGroup>
                                <FormGroup>
                                    <Label for="theme">Title</Label>
                                    <Input type="text" name="theme" id="theme" value={changedTheme.theme || ''}
                                           onChange={this.handleChangeTheme}/>
                                </FormGroup>
                                <FormGroup>
                                    <Button color="primary" type="submit">Change</Button>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                    <div className="float-right">
                        <Button color="success" tag={Link} to={"/themes/" + this.props.match.params.id + "/question/new"}>Add Question</Button>
                    </div>
                    <h3>Questions</h3>
                    <Table className="mt-4" hover>
                        <thead>
                            <tr>
                                {this.headerColumnWithSorting('Наименование', 'question')}
                                {this.headerColumnWithSorting('Тип вопроса', 'questionType')}
                                {this.headerColumnWithSorting('Сложность вопроса', 'complexity')}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {questionList}
                        </tbody>
                    </Table>
                    <Paging countPagesInRow={9} page={page} onClick={(pageNumber) => this.handleClickSort(pageNumber)}/>
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(Theme));