import '../assets/scss/components/customButton.scss'

const CustomButton = props => {
    const { onClick } = props;

    const handleClose = (event) => {
        onClick(event);
    };

    return (
        <button className={`custom-button ${props.type} ${props.disabled ? 'disabled' : ""} ${props.contentClass}`} onClick={handleClose}>
            {props.text}
        </button>
    );
}

CustomButton.defaultProps = {
    type: 'confirm'
}

export default CustomButton;
