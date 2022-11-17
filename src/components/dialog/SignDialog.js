import React, { useState } from 'react'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CustomButton from "../CustomButton";
import '../../assets/scss/components/signDialog.scss'
import { Canvas, reset, changeStrokeColor, exportCanvas } from './Canvas.js';


const SignDialog = props => {
    const { onConfirm, onClose, open } = props;
    const [sign, setSign] = useState(null)
    const [signList, setSignList] = useState(JSON.parse(localStorage.getItem('sign-files')) || []);
    const colors = ['#000000', '#0038A6', '#FF0000']

    const handleReset = () => {
        reset()
        setSign(false)
    }
    const onPaint = (val) => {
        setSign(val)
    }

    const handleCancel = (event, reason) => {
        if (reason && reason === "backdropClick")
            return;
        onClose(event);
    };

    const handleConfirm = (event) => {
        const newImg = exportCanvas()
        console.log(newImg)
        const newList = [...signList, newImg]
        localStorage.setItem('sign-files', JSON.stringify(newList))
        setSignList(newList)
        onConfirm(event);
    }

    return (
        <Dialog className="sign-dialog" onClose={handleCancel} open={open}>
            <DialogContent>
                <div className="dialog-title">在框格內簽下大名!</div>
                <Canvas width={778} height={360} handlePaint={onPaint} />
            </DialogContent>
            <DialogActions>
                <div>
                    <CustomButton contentClass="clear-btn" text="清除" type="text" onClick={handleReset} ></CustomButton>
                    {colors.map(color =>
                        <div className='color-btn' key={color} style={{ backgroundColor: color }}
                            onClick={() => changeStrokeColor(color)}></div>
                    )}
                </div>
                <div>
                    <CustomButton text="取消" type="cancel-fill" onClick={handleCancel} ></CustomButton>
                    <CustomButton contentClass="ml-16" text="簽好了"
                        onClick={handleConfirm} autoFocus disabled={sign ? false : true}></CustomButton>
                </div>
            </DialogActions>
        </Dialog>
    );
}

export default SignDialog;
