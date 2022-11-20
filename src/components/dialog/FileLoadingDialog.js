import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { ReactComponent as PDFAni } from '../../assets/images/pdf-ani.svg'
import '../../assets/scss/components/fileLoadingDialog.scss'

const FileLoadingDialog = props => {
    const { open } = props;

    return (
        <Dialog className="file-loading-dialog" open={open}>
            <DialogContent>
                文件創建中...
                <PDFAni />
            </DialogContent>
        </Dialog>
    );
}

export default FileLoadingDialog;
