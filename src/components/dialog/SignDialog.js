import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import CustomButton from "../CustomButton";

const SignDialog = props => {
    const { onConfirm, onClose, open } = props;

    const handleCancel = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        onClose(event);
    };
    const handleConfirm = (event) => {
        onConfirm(event);
    }

    return (
        <Dialog className="sign-dialog" onClose={handleCancel} open={open}>
            <DialogContent>
                <DialogContentText>
                    <div>
                        <div>在框格內簽下大名!</div>

                    </div>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <CustomButton text="取消" type="cancel-fill" onClick={handleCancel} ></CustomButton>
                <CustomButton contentClass="ml-16" text="簽好了" onClick={handleConfirm} autoFocus></CustomButton>
            </DialogActions>
        </Dialog>
    );
}

export default SignDialog;
