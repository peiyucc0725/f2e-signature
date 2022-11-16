import '../assets/scss/components/customButton.scss'

const CustomButton = props => {
    const { onClick } = props;

    const handleClick = (event) => {
        if(props.disabled) return 
        onClick(event);
    };

    return (
        <button className={`custom-button ${props.type}${props.disabled ? ' disabled' : ""} ${props.contentClass}`} onClick={handleClick}>
            {props.text}
        </button>
    );
}

CustomButton.defaultProps = {
    type: 'confirm',
    contentClass: ''
}

export default CustomButton;
