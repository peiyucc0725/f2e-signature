import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import CustomButton from "../CustomButton";

const ConfirmDialog = props => {
    const { onConfirm, onClose, open, text, confirmBtnText, cancelBtnText, alert } = props;

    const handleCancel = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        onClose(event);
    };
    const handleConfirm = (event) => {
        onConfirm(event);
    }

    return (
        <Dialog className="confirm-dialog" onClose={handleCancel} open={open}>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                {!alert ? <CustomButton text={cancelBtnText} type="cancel-fill" onClick={handleCancel} ></CustomButton> : null}
                <CustomButton contentClass="ml-16" text={confirmBtnText} onClick={handleConfirm} autoFocus></CustomButton>
            </DialogActions>
        </Dialog>
    );
}

ConfirmDialog.defaultProps = {
    alert: false,
    confirmBtnText: '確認',
    cancelBtnText: '取消'
}

export default ConfirmDialog;
