import React from 'react';
import { Component } from 'react';
import '../App.css'
import {Button, Modal} from "react-bootstrap"
import { withRouter } from 'react-router-dom'
import Alert from './ui-components/Alert';
import {default as UUID} from "node-uuid"
 
export default class Categories extends Component {
    constructor(props){
        super(props)
        this.state = {
            jwt1: props.jwt1,
            polls: [],
            isLoaded: false,  
            error : null,
            show: false,
            refresh: false,
            openedmodal: null,
            newOption:"",
            id: UUID.v4(),
            alert: {
                type : "d-none",
                message: ""
              }
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleVoteSubmit = this.handleVoteSubmit.bind(this);
        this.parseJwt = this.parseJwt.bind(this);
    }

    handleVoteSubmit= (evt, index,  voted) => {
        evt.preventDefault();

        const data = this.state.polls[index].options
        console.log(data)
        console.log(voted)

        if (voted){
        const requestOptions = {
            method: 'Post',
            body : JSON.stringify(data)
        }
        console.log(requestOptions.body)
        fetch("http://localhost:4000/v1/updateVote", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.setState({
                        alert: {
                            type: "alert-danger", message: data.error.message
                        },
                    });
                } else {
                    console.log("Successfully updated vote")
                    // this.props.history.push({
                    //     pathname: "/"
                    // });
                }
            })
        }   
    }

    parseJwt = (token) => {
        if (!token) { return; }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        return JSON.parse(window.atob(base64)).sub;
    }

    handleSubmit= (evt,id) => {
        evt.preventDefault();

        const newOptions = 
            {
                id: this.state.id,
                poll_id: id,
                polloptions_id: this.state.id,
                polloptions : {
                    id: this.state.id, name:this.state.newOption, ogpollid:id, votes:0, count:0
                }
            }
        console.log(this.state.newOption)
        const data = newOptions
        console.log(data)

        const requestOptions = {
            method: 'Post',
            body : JSON.stringify(data)
        }
        console.log(requestOptions.body)
        fetch("http://localhost:4000/v1/update", requestOptions)
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    this.setState({
                        alert: {
                            type: "alert-danger", message: data.error.message
                        },
                    });
                } else {
                    console.log("Successfully added option")
                    this.setState({newOptions : data})
                    // this.props.history.push({
                    //     pathname: "/"
                    // });
                }
            })
    }

    handleChange= (evt) => {
        evt.preventDefault();
        let value = evt.target.value
        let name = evt.target.name
        this.setState({
            [name]: value
        })
    }

    changeText = (id) => {
        this.setState(
            this.state.polls.map((item) => {
                if(item.id===id) item.voted = !item.voted
                return item
            })
        );
        
    }
    vote (i, index) {

        let newOptions = [...this.state.polls[index].options];
        newOptions[i].polloptions.count = newOptions[i].polloptions.count+1
        this.setState({options: newOptions});
        if(this.state.polls[index].options[i].polloptions.count %2 ===0){
            newOptions[i].polloptions.votes--;
        } else {
            newOptions[i].polloptions.votes++;
        }
        this.setState({options: newOptions});
        newOptions[i].polloptions.votedby = newOptions[i].polloptions.votedby || [];
        newOptions[i].polloptions.votedby.push(this.parseJwt(this.state.jwt1))
        this.setState({options: newOptions});
        // console.log(this.state.polls[index].options[i].polloptions.count)
        console.log(this.state.polls[index].options)
		
		
	}

    handleModal(id,refresh) {
        this.state.refresh = refresh
        if(this.state.refresh){
            window.location.reload()
        }
        this.setState({
            show: !this.state.show,
            openedmodal: id
        })
    }

    componentDidMount() {
        console.log(this.props.jwt)
        if (this.props.jwt === ""){
            this.props.history.push({
                pathname: "/",
            })
            return
        }

        fetch("http://localhost:4000/v1/polls/" + this.props.catId)
            .then((response) => {
                if (response.status !== "200") {
                    let err = Error;
                    err.message = ("Invalid response code: ",response.status);
                    this.setState({error: err});
                }
                return response.json();
            })
            .then((json) => {
                this.setState({
                    polls: json.polls,
                    isLoaded: true,
                },
                (error) => {
                    this.setState({
                        isLoaded : true,
                        error
                    });
                }
                );
            })
    }

    changeText = (id) => {
        this.setState(
            this.state.polls.map((item) => {
                if(item.id===id) item.voted = !item.voted
                return item
            })
        );
        
    }
    vote (i, index) {
        let newOptions = [...this.state.polls[index].options];
        newOptions[i].polloptions.count = newOptions[i].polloptions.count+1
        this.setState({options: newOptions});
        if(this.state.polls[index].options[i].polloptions.count %2 ===0){
            newOptions[i].polloptions.votes--;
        } else {
            newOptions[i].polloptions.votes++;
        }
        this.setState({options: newOptions});
        console.log(this.state.polls[index].options[i].polloptions.count)
		
		
	}

    render(){
        const {polls, isLoaded, error, newOption} = this.state;

        if(!polls){
            polls = []
        }
        if (error){
            return <div>Error: {error.message}</div>
        }else if (!isLoaded){
            return <p>Loading...</p>
        }else{
            return (
                <div> 
                    <Alert
                        alertType = {this.state.alert.type}
                        alertMessage = {this.state.alert.message}
                        />
                <div className="clearfix"></div>
                <nav className="navbar">
                <div className="navbar-header">
                <p className="navbar-brand">CATEGORY: {this.props.title}</p>
                </div>
                </nav>
                <ul>
                {polls.map((p,index) => {
                    return(
                        <div class="col-md-6 col-md-offset-3" key={index}>
                        <form onSubmit={evt => this.handleVoteSubmit(evt, index, p.voted)}>
                        <div class="panel panel-primary">
                            <div class="panel-heading">
                                <h3 class="panel-title">
                                    <span class="glyphicon glyphicon-circle-arrow-right"></span>{p.ques}</h3>
                            </div>
                            
                            <div className="panel-body two-col">
                            {p.options.map((optn,i) =>
                                <div class="row" key={i}>
                                    <div class="col-md-6">
                                        <div class="well well-sm">
                                            <div class="checkbox">
                                                <label>
                                                    <input type="checkbox" value="" onClick={this.vote.bind(this,i,index)} />
                                                    {optn.polloptions.name}
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-6">
                                        <div class="well well-sm">
                                            <div class="voteCount">
                                                Votes: {optn.polloptions.votes}
                                            </div>
                                        </div>
                                    </div>
                                </div>                           
                               
                            )}   
                            <div class="col-md-12">
                                <Button className="col-md-12 well-sm" onClick={() =>  this.handleModal(p.id, false)}>
                                    Add Poll Option...
                                </Button>

                                <Modal
                                show={this.state.show}
                                onHide={() => this.handleModal()}
                                openedmodal={this.state.openedmodal}
                                size="md"
                                aria-labelledby="contained-modal-title-vcenter"
                                centered
                                >
                                <Modal.Header closeButton>
                                    <Modal.Title id="contained-modal-title-vcenter">
                                    Add Poll Option
                                    </Modal.Title>
                                </Modal.Header>
                                <form onSubmit={evt => this.handleSubmit(evt, this.state.openedmodal)}>
                                    <input
                                        type="hidden"
                                        name="openedmodal"
                                        id="openedmodal"
                                        value={this.state.openedmodal}
                                        onChange={this.handleChange}
                                        />
                                <Modal.Body>
                                    <input 
                                        className="form-control" 
                                        type="text" 
                                        placeholder= "Add option"
                                        id="newOption" 
                                        name="newOption"
                                        value={newOption}
                                        onChange={this.handleChange}
                                        />
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button type="submit" onClick={() =>  this.handleModal(this.state.openedmodal, true)}>Submit</Button>
                                </Modal.Footer>
                                </form>
                                </Modal>
                                        
                            </div>
                            </div>
                            
                            
                            <div class="panel-footer">
                                <button type="submit" className="btn btn-success btn-sm" onClick={() => this.changeText(p.id)}>
                                    
                                    <span class="glyphicon glyphicon-ok"></span>{p.voted ? "Voted" : "Vote"}
                                </button>
                                &nbsp;&nbsp;
                                <button type="button" class="btn btn-primary btn-sm" onClick={event => window.location.href=`/home/${p.id}`}>
                                    View Result
                                    </button>
                            </div>
                        </div>
                        </form>
                    </div>
                    )
                
                })}
                </ul>
                </div>
            
            )
        }
        
    }
    
}