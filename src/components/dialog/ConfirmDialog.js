import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import CustomButton from "../CustomButton";

const ConfirmDialog = props => {
    const { onClose, open } = props;

    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick") 
        return;
        onClose(event);
    };

    return (
        <Dialog className="confirm-dialog" onClose={handleClose} open={open}>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    是否確定取消，<br />
                    目前的編輯進度將不會保留。
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <CustomButton text="取消" type="cancel-fill" onClick={handleClose} ></CustomButton>
                <CustomButton text="繼續編輯" onClick={handleClose} autoFocus></CustomButton>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;
