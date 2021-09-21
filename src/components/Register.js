import { thisExpression } from '@babel/types';
import React, {Component} from 'react';
import {default as UUID} from "node-uuid"


export default class Register extends Component {
    constructor(props){
        super(props)
        this.state = {
            user : {
                id: UUID.v4(),
                name: "",
                email: "",
                password: "",
            },
            isLoaded: false,
            error : null,
            errors: [],
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

        //client side validation

        const data = this.state.user
        console.log(data)
        
        const requestOptions = {
            method: 'Post',
            body : JSON.stringify(data) 
        }
        console.log(requestOptions.body)
        fetch("http://localhost:4000/v1/register", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.setState({
                        alert: {
                            type: "alert-danger", message: data.error.message
                        },
                    });
                } else {
                    // this.setState({
                    //     alert : { type: "alert-success", message: "Poll created successfully!"},
                    // })
                    this.props.history.push({
                        pathname: "/"
                    });
                }
            })
    }

    render() {
        let {user} = this.state;
        return (

            <div >
            <div className="clearfix"></div><br/><br/>
            <form class="form-signin" onSubmit={this,this.handleSubmit}>
                    <input
                        type="hidden"
                        name="id"
                        id="id"
                        value={user.id}
                        onChange={this.handleChange}
                        />
            <div class="text-center">
                <h1 class="display-5 font-weight-normal">Please Register</h1><br/>
            </div>
              <label for="inputName" class="sr-only">Name</label>
              <input type="text" id="name" name="name" value={user.name} className="form-control" placeholder="Name" onChange={this.handleChange} required autoFocus/>
              
              <label for="inputEmail" class="sr-only">Email address</label>
              <input type="email" id="email" name="email" value={user.email} className="form-control" placeholder="Email address" onChange={this.handleChange} required/>
              
              <label for="inputPassword" class="sr-only">Password</label>
              <input type="password" id="password" name="password" value={user.password} className="form-control" placeholder="Password" onChange={this.handleChange} required/>
              
              <button class="btn btn-lg btn-primary btn-block" type="submit">
               {/* onClick={event => window.location.href=`/`} */}
                Register</button>
            </form>
          </div>
        
          );
    }
}