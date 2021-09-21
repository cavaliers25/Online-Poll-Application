const Select = (props) => {
    return (
        <div class="col-md-10">
            <select class="col-md-12 well well-sm" name={props.name} onChange={props.handleCategory}>
            <option value="" key="">{props.placeholder}</option>
                {props.options.map((option) => {
                    {props.category[0].poll_id = props.poll.id}
                    return (
                        <option
                            className="form-select"
                            key={option.id}
                            value={option.id}
                            label={option.value}>
                                {option.value}
                        </option>
                    )
                })}
            </select>
        </div>
    )
}

export default Select;