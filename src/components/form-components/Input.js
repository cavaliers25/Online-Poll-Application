import { Fragment } from "react";
import '../../App.css';

const Input = (props) => {
    return(
        <Fragment>
        {props.polloption.map((item,i) => {
            {item.polloptions.id = item.id}
            {item.polloptions_id = item.id}
            {item.poll_id = props.poll.id}
            {item.polloptions.ogpollid = props.poll.id}
            return(
                <div class="col-md-12">
                <div class="input-group" key={i}>
                
            <input 
                type={props.type}
                className={`form-control ${props.className("option "+(i+1)) ? "is-invalid" : ""}`}
                placeholder={"Option "+(i+1)}
                name={props.name}
                value={item.polloptions.name}
                onChange={evt => props.handleChangeOptions(evt, i)}/>
            <span class="input-group-btn">
                {props.polloption.length !== 1 &&<button class="btn btn-default" type="button" onClick={() => props.handleRemoveOption(i)}>Remove
                </button>}
            </span>
            </div>
            <div 
                className={props.errorDiv("option "+ (i+1)) ? "text-danger" : "d-none"}>
                    {props.errorMsg}</div>
            <br/>
            </div>
            )
        })}   
      </Fragment>
    
    )                                                                                      
}

export default Input;
