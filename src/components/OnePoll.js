import React, {Component, Fragment} from 'react';

 
export default class OnePoll extends Component {
    state = { 
        poll: [],
        isLoaded: false,  
        error : null,
    };

    componentDidMount(){
        fetch("http://localhost:4000/v1/poll/" + this.props.match.params.id)
            // .then((response) => response.json())
            .then((response) => {
                console.log("Status code is ", response.status);
                if (response.status !== "200") {
                    let err = Error;
                    err.message = ("Invalid response code: ", response.status);
                    this.setState({error: err});
                }
                return response.json();
            })
            .then((json) => {
                this.setState({
                    poll: json.poll,
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

    render(){
        const {poll, isLoaded, error} = this.state;
        if (poll.categories){
            poll.categories = Object.values(poll.categories);
        }else{
            poll.categories=[]
        }
        if (error){
            return <div>Error: {error.message}</div>
        }else if (!isLoaded){
            return <p>Loading...</p>
        }else{
            return (
                <Fragment>
                    <div className="clearfix"></div>
                    <h2>
                        Poll: {poll.ques}
                    </h2>

                    <div className="float-end">
                        {poll.categories.map((m,index) =>(
                            <span className="badge bg-secondary me-1" key={index}>
                                {m}
                            </span>
                        ))}

                    </div>
                    <div className="clearfix"></div>
                    <hr/>


                </Fragment>
            )
        }   
    }
}