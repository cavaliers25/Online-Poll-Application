import React, {Component, Fragment} from 'react';
import Input from './form-components/Input';
import Select from './form-components/Select';
import '../App.css';
import {Button} from "antd"
import {default as UUID} from "node-uuid"
import Alert from './ui-components/Alert';

export default class CreatePoll extends Component {

    constructor(props){
        super(props)
        this.state = {
            poll: {
                id: UUID.v4(),
                ques: "",
                options:[
                    {
                        id:UUID.v4(),
                        poll_id: "",
                        polloptions_id: "",
                        polloptions : {
                            id: "", name:"", ogpollid:"", votes:0, count:0
                        }
                    }
                    ,
                    {
                        id:UUID.v4(),
                        poll_id: "",
                        polloptions_id: "",
                        polloptions : {
                            id: "", name:"", ogpollid:"", votes:0, count:0
                        }
                    }
                ],
                category : [
                    {
                        id: "",
                        poll_id: "",
                        category_id: "",
                        category: {
                            id: "", category_name: ""
                        }
                    }
                ]
            },
            categoryOptions: [
                {id: 1, value: "Education"},
                {id: 2, value: "Sports"},
                {id: 3, value: "Movies"}
            ],
            isLoaded: false,
            error : null,
            errors: [],
            alert: {
                type: "d-none",
                message: "",
            }
        }
        this.handleChangeOptions = this.handleChangeOptions.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.hasError = this.hasError.bind(this);
        this.handleRemoveOption = this.handleRemoveOption.bind(this);
        this.handleCategory = this.handleCategory.bind(this);

    }
    
    componentDidMount(){
    }

    handleSubmit= (evt) => {
        evt.preventDefault();

        

        //client side validation

        let errors = [];
        if(this.state.poll.ques === ""){
            errors.push("ques")
        }
        this.state.poll.options.map((item,i) => {
            if (item.polloptions.name === ""){
                errors.push("option "+(i+1))
            }
        })

        this.setState({errors : errors})

        if(errors.length >0){
            return false;
        }

        const data = this.state.poll
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json")
        myHeaders.append("Authorization", "Bearer " + this.props.jwt);
        

        const requestOptions = {
            method: 'Post',
            body : JSON.stringify(data),
            headers : myHeaders, 
        }
        console.log(requestOptions.body)
        fetch("http://localhost:4000/v1/create", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.setState({
                        alert: {
                            type: "alert-danger", message: data.error.message
                        },
                    });
                } else {
                    this.setState({
                        alert : { type: "alert-success", message: "Poll created successfully!"},
                    })
                    // this.props.history.push({
                    //     pathname: "/"
                    // });
                }
            })
    }

    handleChangeOptions = (evt,i) => {
        evt.preventDefault()
        
        const {options} = {...this.state.poll}
        const currentState = options
        const {name,value} = evt.target
        currentState[i].polloptions[name] = value

        this.setState({options : currentState})

    }
    handleCategory = (evt) => {
        evt.preventDefault()
        
        const {category} = {...this.state.poll}
        const currentState = category
        const {name,value} = evt.target
        currentState[0].category[name] = parseInt(value, 10)
        this.state.poll.category[0].category.category_name = this.state.categoryOptions[value-1].value

        this.state.poll.category[0].category_id = parseInt(value, 10)
        this.state.poll.category[0].id = parseInt(value, 10)
      

        // console.log(this.state.poll.category)

        this.setState({category : currentState})

    }

    handleAddEvent = (evt, id) => {
        evt.preventDefault()

        this.setState((prevState) => ({
         
            poll: {
                ...prevState.poll,
                options:[
                    ...prevState.poll.options.concat({
                        id:UUID.v4(),
                        poll_id: "",
                        polloptions_id: "",
                        polloptions : {
                            id: "", name:"", ogpollid:"", votes:0, count:0
                        }
                    })
                ]
            }
        
        }))
    }

    handleRemoveOption = (index) => {

        const newOptions = this.state.poll.options
        newOptions.splice(index,1)
        this.setState({options : newOptions})
    
    }
        


    handleChange = (evt) => {
        evt.preventDefault()
        let value = evt.target.value
        let name = evt.target.name
        this.setState((prevState) => ({
            poll: {
                ...prevState.poll,
                [name]: value,
            }
        }))
    }

    hasError(key){
        return this.state.errors.indexOf(key) !== -1;
    }

    render() {
        let {poll} = this.state;
        
        return (
            <Fragment>
                <div className="clearfix"></div>
                <nav className="navbar">
                <div className="navbar-header">
                <p className="navbar-brand">CREATE A POLL</p>
                </div>
                </nav>
                <Alert 
                    alertType = {this.state.alert.type}
                    alertMessage = {this.state.alert.message}
                />
                <form onSubmit={this,this.handleSubmit}>
                    <input
                        type="hidden"
                        name="id"
                        id="id"
                        value={poll.id}
                        onChange={this.handleChange}
                        />
                <div class="col-md-6 col-md-offset-3" >
                        <div class="panel panel-primary">
                            <div class="panel-heading">
                                <h3 class="panel-title">
                                <div class="row">
                                <label class=" col-form-label glyphicon glyphicon-circle-arrow-right"></label>
                                <div class="col-sm-11">
                                <input 
                                    type="text" 
                                    className={`form-control ${this.hasError("ques") ? "is-invalid":""}`}
                                    id="ques" 
                                    name="ques"
                                    value={poll.ques}
                                    onChange={this.handleChange}
                                    placeholder="Ask a question..." 
                                />
                                <div className={this.hasError("ques") ? "text-danger" : "d-none"}>{"Please enter a question"}</div>
                                </div>
                                </div>
                                </h3>
                            </div>
                            <div className="panel-body two-col">
                                <div class="row"> 
                                          
                                    <Input
                                        type={"text"}
                                        placeholder={"Option..."}
                                        name={"name"}
                                        polloption = {poll.options}
                                        poll = {poll}                                     
                                        handleChangeOptions= {this.handleChangeOptions}
                                        className={this.hasError}
                                        errorDiv={this.hasError}
                                        errorMsg = {"Please enter an option"}
                                        handleRemoveOption={this.handleRemoveOption}
                                    />
                               
                                    <div class="col-md-12">
                                        <Button 
                                        className="col-md-12 well well-sm dotted"
                                        onClick={evt => this.handleAddEvent(evt, poll.id)}
                                        >Add Option...</Button>
                                        
                                    </div>

                                    <Select
                                        name={"id"}
                                        category={poll.category}
                                        poll = {poll}  
                                        handleCategory={this.handleCategory}
                                        placeholder={"Category"}
                                        options={this.state.categoryOptions}
                                        getOptionLabel = {(option) => option.id}
                                    />
                                </div>                                                                                    
                            </div>
                            <div class="panel-footer">
                                <button type="submit" class="btn btn-primary btn-sm" >
                                    Submit
                                    </button>
                            </div>
                        </div>
                    </div>
                    </form>
                    {/* <div className="mt-3">
                        <pre>{JSON.stringify(this.state, null, 3)}</pre>
                    </div> */}
            </Fragment>
            
        )
    }
}