import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {CookiesProvider} from 'react-cookie';
import './App.css';
import Home from './Home';
import UserList from './UserList';
import UserEdit from "./UserEdit";
import Welcome from "./Welcome";
import Login from "./Login";
import MovieList from "./MovieList";
import Registration from "./Registration";
import SubjectList from "./manager/SubjectList";
import Subject from "./manager/Subject";
import Theme from "./manager/Theme";
import QuestionEdit from "./manager/QuestionEdit";
import ProfileParent from "./ProfileParent";
import ProfileChild from "./ProfileChild";

class App extends Component {
    render() {
        return (
            <CookiesProvider>
                <Router>
                    <Switch>
                        <Route path='/' exact={true} component={Home}/>
                        <Route path='/login' exact={true} component={Login}/>
                        <Route path='/users' exact={true} component={UserList}/>
                        <Route path='/welcome' exact={true} component={Welcome}/>
                        <Route path='/user/:id' exact={true} component={UserEdit}/>
                        <Route path='/parent/:id' exact={true} component={ProfileParent}/>
                        <Route path='/parent/:parentId/child/:childId' exact={true} component={ProfileChild}/>
                        <Route path='/child/:childId' exact={true} component={ProfileChild}/>
                        <Route path='/subjects' exact={true} component={SubjectList}/>
                        <Route path='/subjects/:id' exact={true} component={Subject}/>
                        <Route path='/themes/:id' exact={true} component={Theme}/>
                        <Route path='/movies' exact={true} component={MovieList}/>
                        <Route path='/registration' exact={true} component={Registration}/>
                        <Route path='/themes/:themeId/question/:questionId' exact={true} component={QuestionEdit}/>
                    </Switch>
                </Router>
            </CookiesProvider>
        );
    }
}

export default App;
