import React, { Component, Fragment } from "react"
import { BrowserRouter as Router, Switch, Route, Link, useRouteMatch} from "react-router-dom";
import "./App.css";
import CreatePoll from "./components/CreatePoll";
import Home from "./components/Home";
import Logout from "./components/Logout";
import {NavDropdown } from 'react-bootstrap';
import Categories from "./components/Categories";
import OnePoll from "./components/OnePoll";
import Login from "./components/Login";
import Register from "./components/Register";

export default class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      jwt: ""
    }
    this.handleJWTChange(this.handleJWTChange.bind(this))
  }

  componentDidMount() {
    let t = window.localStorage.getItem("jwt");
    if (t) {
      if (this.state.jwt === ""){
        this.setState({jwt: JSON.parse(t)})
      }
    }
  }

  handleJWTChange = (jwt) => {
    this.setState({jwt : jwt});
  }

  logout = () => {
    this.setState({jwt: ""})
    window.localStorage.removeItem("jwt")
  }

  render(){
  return (
    <Router>
    <div className="container">
        <nav className="nav navbar-left navbar navbar-default">
          <div className="container">
            <div className="navbar-header">
              <p className="navbar-brand">VOTE ON A POLL</p>
            </div>
              <ul className="nav navbar navbar-right">
                {this.state.jwt !== "" && (
                <Fragment>
                <li id="home"><Link to="/home">HOME</Link></li>
                <NavDropdown
                  id="nav-dropdown-dark-example"
                  title="CATEGORY"
                >
                  <NavDropdown.Item><Link to="/category/education">Education</Link></NavDropdown.Item>
                  <NavDropdown.Item ><Link to="/category/sports">Sports</Link></NavDropdown.Item>
                  <NavDropdown.Item ><Link to="/category/movies">Movies</Link></NavDropdown.Item>
                </NavDropdown>
                <li id="create"><Link to="/create">CREATE A POLL</Link></li>
                <li id="logout" onClick={this.logout}><Link to="/">LOGOUT</Link></li>
                </Fragment>
                )}
                {this.state.jwt == "" && (
                <Fragment>
                <li id="login" ><Link to="/">LOGIN</Link></li>
                <li id="register"><Link to="/register">REGISTER</Link></li>
                </Fragment>
                )}
              </ul>
          </div>
        </nav>
        {/* <pre>
          {JSON.stringify(this.state, null, 3)}
        </pre> */}

        <div >
          <Switch>
            <Route exact path="/category">
              <CategoryPage />
            </Route>
            
            <Route 
            exact 
            path="/category/education"
            render={(props) => <Categories {...props} title={`EDUCATION`} catId={1} jwt1={this.state.jwt} />}>
            </Route>
            <Route 
            exact 
            path="/category/sports"
            render={(props) => <Categories {...props} title={`SPORTS`} catId={2} jwt1={this.state.jwt} />}>
            </Route>
            <Route 
            exact 
            path="/category/movies"
            render={(props) => <Categories {...props} title={`MOVIES`} catId={3} jwt1={this.state.jwt} />}>
            </Route>
            <Route exact path="/create" component={(props) =>(
              <CreatePoll {...props} jwt={this.state.jwt} />
            )}/>
            <Route exact path="/home/:id" component={OnePoll}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/home" component={(props) => (
              <Home {...props} jwt={this.state.jwt} />
            )} />
            
            <Route exact path="/" component={(props) => <Login {...props} handleJWTChange={this.handleJWTChange} />} />
          </Switch>
        </div>
      </div>
    </Router>

  );
  }
}

function CategoryPage (){
  let {path} = useRouteMatch()

  return(
    <div>
      <h2>CategoryPage</h2>

      <ul>
        <li><Link to={`${path}/education`}>Education</Link></li>
        <li><Link to={`${path}/sports`}>Sports</Link></li>
        <li><Link to={`${path}/movies`}>Movies</Link></li>
      </ul>
    </div>
  )
}
