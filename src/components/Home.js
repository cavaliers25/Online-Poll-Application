import React, { Component } from 'react';
import '../App.css'
import Poll from './Poll';
 
export default class Home extends Component {

    render (){
    console.log(this.props.jwt)
    return ( 
        <div>
            <Poll jwt1={this.props.jwt}/>
        </div>      
        
    )}
}