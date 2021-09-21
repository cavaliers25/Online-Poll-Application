import React, { Component } from "react"
import "../App.css";
import { withRouter } from 'react-router-dom'
import Alert from "./ui-components/Alert";

class Login extends Component {

  constructor(props){
    super(props)
    this.state = {
        user : {
            email: "",
            password: "",
        },
        alert: {
          type : "d-none",
          message: ""
        }
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
}

handleChange = (evt) => {
    evt.preventDefault()
    let value = evt.target.value
    let name = evt.target.name
    this.setState((prevState) => ({
        user: {
            ...prevState.user,
            [name]: value,
        }
    }))
}


handleSubmit= (evt) => {
    evt.preventDefault();

    const data = new FormData(evt.target);
    const payload = Object.fromEntries(data.entries());
    
    const requestOptions = {
        method: 'Post',
        body : JSON.stringify(payload) 
    }
    console.log(requestOptions.body)
    fetch("http://localhost:4000/v1/login", requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                this.setState({
                    alert: {
                        type: "alert-danger", message: "Unauthorized"
                    },
                });
            } else {
                // console.log(data)
                this.handleJWTChange(Object.values(data)[0])
                window.localStorage.setItem("jwt", JSON.stringify(Object.values(data)[0]))
                this.props.history.push({
                    pathname: "/home"
                });
                
            }
        })
}

handleJWTChange(jwt) {
  this.props.handleJWTChange(jwt)
}

  render(){
    let {user} = this.state;
  return (

    <div >
    <div className="clearfix"></div><br/><br/>
    <Alert
      alertType = {this.state.alert.type}
      alertMessage = {this.state.alert.message}
    />
    <form class="form-signin" onSubmit={this,this.handleSubmit}>
                    <input
                        type="hidden"
                        name="id"
                        id="id"
                        value={user.id}
                        onChange={this.handleChange}
                        />
      <div class="text-center">
      <h1 class="display-5 font-weight-normal">Welcome to the world of Polls!</h1><br/>
      </div>
      <label for="inputEmail" class="sr-only">Email address</label>
      <input type="email" id="email" name="email" value={user.email} className="form-control" placeholder="Email address" onChange={this.handleChange} required autoFocus/>
      <label for="inputPassword" class="sr-only">Password</label>
      <input type="password" id="password" name="password" value={user.password} className="form-control" placeholder="Password" onChange={this.handleChange} required/>
      <button class="btn btn-lg btn-primary btn-block" type="submit">
        Login</button>
    </form>
  </div>

  );
    }
}

export default withRouter(Login)


