import React, { useState, useRef } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CustomButton from "../CustomButton";
import ConfirmDialog from '../../components/dialog/ConfirmDialog'
import { ReactComponent as ImageIcon } from '../../assets/images/image-icon.svg'
import '../../assets/scss/components/uploadImageDialog.scss'

const UploadImageDialog = props => {
    const { onConfirm, onClose, open } = props;
    const inputRef = useRef(null);
    const [dragActive, setDragActive] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertText, setAlertText] = useState('您的檔案太大了!');
    const [uploadImg, setUploadImg] = useState(null)

    const onClickUpload = () => {
        if (uploadImg) return
        inputRef.current.value = ''
        inputRef.current.click();
    }
    const handleCancel = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        setUploadImg(null)
        onClose(event);
    };
    const handleConfirm = (event) => {
        onConfirm(event);
    }
    const handleClearFile = (event) => {
        setUploadImg(null)
    }
    const verifyFile = (file) => {
        let verifystatus = true
        if (file.size / 1024 / 1024 > 10) {
            setAlertText('您的檔案太大了!')
            verifystatus = false
            setAlertVisible(true)
        }
        else if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
            setAlertText('您的檔案類型不是JPG或PNG檔!')
            verifystatus = false
            setAlertVisible(true)
        }
        return verifystatus
    }
    const handleChangeInput = function (e) {
        if (uploadImg) return
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const verified = verifyFile(file)
            if (!verified) return
            setUploadImg(URL.createObjectURL(file))
        }
    };
    const handleDrag = function (e) {
        if (uploadImg) return
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };
    const handleDrop = function (e) {
        if (uploadImg) return
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const file = e.dataTransfer.files[0]
            const verified = verifyFile(file)
            if (!verified) return
            setUploadImg(URL.createObjectURL(file))
        }
    };

    return (
        <Dialog className="upload-image-dialog" onClose={handleCancel} open={open}>
            <DialogContent>
                <div className="dialog-title">上傳簽名圖檔!</div>
                <input ref={inputRef} type="file" multiple={false} onChange={handleChangeInput} style={{ display: 'none' }} />
                <div
                    className={`file-box${dragActive ? ' drag-active' : ''}${uploadImg ? ' has-image' : ''}`}
                    onClick={onClickUpload}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}>
                    {uploadImg ?
                        <img src={uploadImg} alt="previewImg" /> :
                        <div>
                            <div>點擊此處上傳 或 直接拖曳檔案</div>
                            <ImageIcon className="img-svg" />
                            <div>(限10MB以下JPG、PNG圖檔)</div>
                        </div>}
                </div>
                <ConfirmDialog open={alertVisible} text={alertText} confirmBtnText="我知道了" alert
                    onConfirm={() => setAlertVisible(false)} />
            </DialogContent>
            <DialogActions>
                <CustomButton contentClass="clear-btn" text="清除" type="text" onClick={handleClearFile} ></CustomButton>
                <div>
                    <CustomButton text="取消" type="cancel-fill" onClick={handleCancel} ></CustomButton>
                    <CustomButton contentClass="ml-16" text="使用圖標"
                        onClick={handleConfirm} autoFocus disabled={uploadImg ? false : true}></CustomButton>
                </div>
            </DialogActions>
        </Dialog>
    );
}

export default UploadImageDialog;
