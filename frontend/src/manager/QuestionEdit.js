import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {Button, Col, Container, Form, FormGroup, Input, Label, Row, InputGroup,
    InputGroupAddon, InputGroupText, FormFeedback} from 'reactstrap';
import {Cookies, withCookies} from 'react-cookie';
import {instanceOf} from 'prop-types';
import AppNavbar from '../AppNavbar';
import {customHttpRequest} from "../customHttpRequest";

class QuestionEdit extends Component {
    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    emptyItem = {
        question: '',
        complexity: undefined,
        questionType: undefined,
        answerList: [],
    };

    emptyAnswer = {
        id: undefined,
        answer: '',
        correct: false,
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
            theme: {},
            changedTheme: {},
            isLoading: true,
            sort: this.defaultSort,
            modal: false,
            complexity: [],
            questionType: [],
            idAnswer: 0,
            formValidation: {
                isValid: true,
                errors: {},
            },
        };

        this.toggle = this.toggle.bind(this);

        this.handleChange = this.handleChange.bind(this);
        this.handleChangeAnswer = this.handleChangeAnswer.bind(this);
        this.handleChangeAnswerCorrect = this.handleChangeAnswerCorrect.bind(this);
        this.handleChangeSelect = this.handleChangeSelect.bind(this);

        this.handleSubmit = this.handleSubmit.bind(this);

        this.addAnswer = this.addAnswer.bind(this);
        this.removeAnswer = this.removeAnswer.bind(this);
    }

    async componentDidMount() {
        let state = {};
        await fetch('/api/theme/' + this.props.match.params.themeId, {credentials: 'include'})
            .then(response => response.json())
            .then(theme => {
                state.theme = theme;
            })
        /*.catch(() => this.props.history.push('/login'))*/;

        if (this.props.match.params.questionId !== 'new') {
            await fetch('/api/question/' + this.props.match.params.questionId, {credentials: 'include'})
                .then(response => response.json())
                .then(question => {
                    state.item = question;
                })
            /*.catch(() => this.props.history.push('/login'))*/;
        }
        await fetch('/api/question/types', {credentials: 'include'})
            .then(response => response.json())
            .then(questionType => {
                state.questionType = questionType;
            });
        await fetch('/api/question/complexity', {credentials: 'include'})
            .then(response => response.json())
            .then(complexity => {
                state.complexity = complexity;
            });
        state.isLoading = false;
        await this.setState(state);
    }

    handleChange(event) {
        this.changeObject('item', event);
    }

    handleChangeAnswer(index, event) {
        const target = event.target;
        const value = target.value;

        let item = {...this.state.item};

        item.answerList[index].answer = value;
        this.setState({item});
    }

    handleChangeSelect(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let state = {};
        let item = {...this.state.item};

        item[name] = [...this.state[name]].filter(element => element.id === parseInt(value))[0];
        state.item = item;

        this.setState(state);
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

    toggle() {
        this.setState({modal: !this.state.modal});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.validateForm();
        const {item, csrfToken, theme, formValidation} = this.state;

        if(!formValidation.isValid) return;

        item.theme = theme;
        customHttpRequest('/api/question', {
            method: this.props.match.params.questionId === 'new' ? 'POST' : 'PUT',
            headers: {
                'X-XSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(item),
            credentials: 'include',
        }).then(() => {});
    }

    handleChangeAnswerCorrect(id) {
        let item = {...this.state.item};
        for (let i = 0; i < item.answerList.length;  i++) {
            item.answerList[i].correct = (i === id);
        }
        this.setState({item});
    }

    addAnswer(event) {
        let item = {...this.state.item};
        item.answerList.push({...this.emptyAnswer});
        this.setState({item});
    }

    removeAnswer(index) {
        let item = {...this.state.item};
        console.log(item);
        item.answerList = [...item.answerList].filter((value, key) => key !== index);
        console.log(item);
        this.setState({item});
    }

    validateForm() {
        const {item} = this.state;
        let formValidation = {...this.state.formValidation};
        if(!item.question) {
            formValidation.isValid = false;
            formValidation.errors.question = true;
        }
        if(!item.complexity) {
            formValidation.isValid = false;
            formValidation.errors.complexity = true;
        }
        if(!item.questionType) {
            formValidation.isValid = false;
            formValidation.errors.questionType = true;
        }
        if(item.questionType && item.questionType.questionType === 'CLOSED') {
            if(item.answerList.length === 0) {
                formValidation.isValid = false;
                formValidation.errors.answerList = true;
            } else {
                let allUnCorrect = true;
                for(let i = 0; i < item.answerList.length; i++) {
                    if(item.answerList[i].correct) allUnCorrect = false;
                    if(!item.answerList[i].answer)  {
                        formValidation.isValid = false;
                        formValidation.errors.answerList = true;
                        break;
                    }
                }
                if(allUnCorrect)  {
                    formValidation.isValid = false;
                    formValidation.errors.answerList = true;
                }
            }
        }

        this.setState({formValidation});
    }

    render() {
        const {item, isLoading, complexity, questionType, formValidation} = this.state;

        if(isLoading) {
            return <p>Loading...</p>;
        }

        const questionComplexityList = complexity.map(complexity => {
            return <option value={complexity.id} key={complexity.id}>{complexity.complexityRu}</option>
        });

        const questionTypeList = questionType.map(type => {
            return <option value={type.id} key={type.id} >{type.questionTypeRu}</option>
        });

        const answerListView = item.questionType && item.questionType.questionType === 'CLOSED' ? item.answerList.map((answer, index) => {
            return (
                <FormGroup row key={index}>
                    <InputGroup >
                        <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                                <Input addon type="radio" name="answer" checked={answer.correct}
                                       onChange={() => this.handleChangeAnswerCorrect(index)}/>
                            </InputGroupText>
                        </InputGroupAddon>
                        <Input type="text" name={'answer' + index} id={'answer' + index}
                               onChange={event => this.handleChangeAnswer(index, event)} value={answer.answer}/>
                        <InputGroupAddon addonType="append">
                            <Button color="danger" onClick={() => this.removeAnswer(index)} className="float-right">x</Button>
                        </InputGroupAddon>
                    </InputGroup>
                </FormGroup>
            );
        }) : '';
        console.log(item);

        return (
            <div>
                <AppNavbar/>
                <Container>
                    <Row>
                        <Col>
                            <Form onSubmit={this.handleSubmit}>
                                <FormGroup row>Вопрос</FormGroup>
                                <FormGroup row>
                                    <Label for="question">Заголовок</Label>
                                    <Input type="text" name="question" id="question" value={item.question || ''}
                                           invalid={!!formValidation.errors.question} onChange={this.handleChange}/>
                                    <FormFeedback>Необходимо заполнить заголовок</FormFeedback>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="questionType">Тип вопроса</Label>
                                    <Input type="select" name="questionType" id="questionType"
                                           invalid={!!formValidation.errors.questionType}
                                           onChange={this.handleChangeSelect}
                                           value={!item.questionType ? '' : item.questionType.id}>
                                        <option value=""/>
                                        {questionTypeList}
                                    </Input>
                                    <FormFeedback>Необходимо выбрать тип вопроса</FormFeedback>
                                </FormGroup>
                                <FormGroup row>
                                    <Label for="complexity">Сложность вопроса</Label>
                                    <Input type="select" name="complexity" id="complexity"
                                           invalid={!!formValidation.errors.complexity}
                                           onChange={this.handleChangeSelect}
                                           value={!item.complexity ? '' : item.complexity.id}>
                                        <option value=""/>
                                        {questionComplexityList}
                                    </Input>
                                    <FormFeedback>Необходимо выбрать сложность вопроса</FormFeedback>
                                </FormGroup>
                                {item.questionType && item.questionType.questionType === 'CLOSED' && (
                                    <FormGroup row>
                                        <Label for="theme">Ответы</Label>
                                    </FormGroup>
                                )}
                                {item.questionType && item.questionType.questionType === 'CLOSED' && answerListView}

                                {item.questionType && item.questionType.questionType === 'CLOSED' && (
                                    <FormGroup row>
                                        <Button color="success" onClick={this.addAnswer} className="float-right w-100">+</Button>
                                    </FormGroup>
                                )}
                                <FormGroup row>
                                    <Button color="primary" type="submit">Save</Button>
                                </FormGroup>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default withCookies(withRouter(QuestionEdit));