import React, { useEffect, useState } from 'react'
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import { fabric } from 'fabric'
import '../../../assets/scss/components/signStep.scss'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import EditIcon from '../../../assets/images/edit-icon.svg';
import SignIcon from '../../../assets/images/sign-icon.svg';
import { ReactComponent as ImageIcon } from '../../../assets/images/image-icon.svg';
import DeleteIcon from '../../../assets/images/delete-icon.svg';
import UploadImageDialog from '../../../components/dialog/UploadImageDialog'
import SignDialog from '../../../components/dialog/SignDialog';

const SignStep = props => {
    const { selected } = props
    const [fileName, setFileName] = useState(selected.name)
    const [signList, setSignList] = useState(JSON.parse(localStorage.getItem('sign-list')) || [])
    const [uploadImgVisible, setUploadImgVisible] = useState(false)
    const [signVisible, setSignVisible] = useState(false)
    const base64Prefix = "data:application/pdf;base64,";
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

    const handleChangeFileName = (event) => {
        setFileName(event.target.value)
    }

    const fetchSignList = () => {
        setSignList(JSON.parse(localStorage.getItem('sign-list')) || [])
    }

    const printPDF = async (file) => {
        const data = atob(file.substring(base64Prefix.length));
        const pdfDoc = await pdfjsLib.getDocument({ data }).promise;
        const pdfPage = await pdfDoc.getPage(1);
        const viewport = pdfPage.getViewport({ scale: window.devicePixelRatio });
        const cv = document.createElement("canvas");
        const context = cv.getContext("2d");
        cv.height = viewport.height;
        cv.width = viewport.width;
        const renderContext = {
            canvasContext: context,
            viewport,
        };
        const renderTask = pdfPage.render(renderContext);
        return renderTask.promise.then(() => cv);
    }

    const pdfToImage = (pdfData, name) => {
        const scale = 1 / window.devicePixelRatio;
        return new fabric.Image(pdfData, {
            id: `${name}-pdf`,
            scaleX: scale,
            scaleY: scale,
        });
    }

    const init = async () => {
        const canvas = new fabric.Canvas("canvas");
        canvas.requestRenderAll();
        const pdfData = await printPDF(selected.source);
        const pdfImage = await pdfToImage(pdfData, selected.name);
        canvas.setWidth(pdfImage.width / window.devicePixelRatio);
        canvas.setHeight(pdfImage.height / window.devicePixelRatio);
        canvas.setBackgroundImage(pdfImage, canvas.renderAll.bind(canvas));
    }

    useEffect(() => {
        init()
    }, [])

    return (
        <div className="sign-step">
            <div className="sign-step__setting">
                <div className='setting-title'>
                    <div className="setting-title__title">文件名稱</div>
                    <TextField
                        className="filename-input"
                        id="outlined-basic"
                        variant="outlined"
                        value={fileName}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <img src={EditIcon} alt="edit-icon" />
                                </InputAdornment>
                            )
                        }}
                        onChange={handleChangeFileName} />
                </div>
                <div className='setting-sign'>
                    <div className="setting-sign__title">我的簽名</div>
                    {signList.map((item, index) => {
                        return (
                            <div className='setting-sign__sign'>
                                <img src={item.source} alt={`sign-${index}`} height="60" width="auto" />
                                <img src={DeleteIcon} alt="delete-icon" />
                            </div>
                        )
                    })}
                    <div className='setting-sign__button' onClick={() => setSignVisible(true)}>創建簽名
                        <img src={SignIcon} alt="sign-icon" />
                    </div>
                    <div className='setting-sign__button' onClick={() => setUploadImgVisible(true)}>上傳圖片
                        <ImageIcon fill="#94989B" />
                    </div>
                </div>
            </div>
            <div className="sign-step__editor">
                <canvas id="canvas"> </canvas>
            </div>
            <SignDialog open={signVisible} onClose={() => setSignVisible(false)} onConfirm={fetchSignList}/>
            <UploadImageDialog open={uploadImgVisible} onClose={() => setUploadImgVisible(false)} />
        </div>
    );
}
export default SignStep;