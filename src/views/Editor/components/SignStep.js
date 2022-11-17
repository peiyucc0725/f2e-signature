import React, { useEffect, useState, useRef } from 'react'
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
    const editorRef = useRef(null)
    const [fileName, setFileName] = useState(selected.name)
    const [signList, setSignList] = useState(JSON.parse(localStorage.getItem('sign-files')) || [])
    const [uploadImgVisible, setUploadImgVisible] = useState(false)
    const [signVisible, setSignVisible] = useState(false)
    const canvas = useRef(null);
    let pdfDoc = null
    const base64Prefix = "data:application/pdf;base64,";
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    const handelDeleteSign = (id) => {

    }
    const handleChangeFileName = (event) => {
        setFileName(event.target.value)
    }

    const handleDialogConfirm = (type) => {
        switch (type) {
            case 'sign':
                setSignVisible(false)
                break;
            case 'image':
                setUploadImgVisible(false)
                break;
            default:
                break;
        }
        setSignList(JSON.parse(localStorage.getItem('sign-files')) || [])
    }

    const printPDFPage = async (pdfDoc, page) => {
        const pdfPage = await pdfDoc.getPage(page);
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

    const pdfToImage = (pdfData, name, page) => {
        const scale = 1 / window.devicePixelRatio;
        return new fabric.Image(pdfData, {
            id: `${name}-pdf-${page}`,
            scaleX: scale,
            scaleY: scale,
        });
    }

    const renderPage = async (page) => {
        const pdfData = await printPDFPage(pdfDoc, page);
        const pdfImage = await pdfToImage(pdfData, selected.name, page);
        const ratio = pdfImage.width / pdfImage.height
        const width = editorRef.current.clientWidth
        const height = editorRef.current.clientHeight
        if (ratio > 1) {
            canvas.current.setWidth(width / window.devicePixelRatio);
            if (pdfImage.width > width) {
                canvas.current.setHeight(width / ratio / window.devicePixelRatio);
                canvas.current.setZoom(width / pdfImage.width);
                document.getElementsByClassName("canvas-container")[0].style.marginTop = `${width / ratio - height}px`;
            }
            else {
                canvas.current.setHeight(width * ratio / window.devicePixelRatio);
                canvas.current.setZoom(pdfImage.width / width);
                document.getElementsByClassName("canvas-container")[0].style.marginTop = `${width * ratio - height}px`;
            }
        }
        else {
            canvas.current.setHeight(pdfImage.height / window.devicePixelRatio);
            canvas.current.setWidth(pdfImage.width / window.devicePixelRatio);
            document.getElementsByClassName("canvas-container")[0].style.marginTop = `${pdfImage.height / window.devicePixelRatio - height}px`;
        }
        canvas.current.setBackgroundImage(pdfImage, canvas.current.renderAll.bind(canvas.current));
    }

    const init = async () => {
        canvas.current = new fabric.Canvas("canvas")
        canvas.current.requestRenderAll();
        const data = atob(selected.source.substring(base64Prefix.length));
        pdfDoc = await pdfjsLib.getDocument({ data }).promise;
        // TODO: 多頁切換
        renderPage(1)
    }

    useEffect(() => {
        init()
        return () => {
            canvas.current.dispose();
            canvas.current = null;
        };
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
                    {signList.map((item) => {
                        return (
                            <div className='setting-sign__sign' key={item.id}>
                                <div>
                                    <img className="sign" src={item.source} alt={`sign-${item.id}`} height="58" width="auto" />
                                </div>
                                <img className="delete-btn" src={DeleteIcon} alt="delete-icon" onClick={() => handelDeleteSign(item.id)} />
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
            <div ref={editorRef} className="sign-step__editor">
                <canvas id="canvas"> </canvas>
            </div>
            <SignDialog open={signVisible} onClose={() => setSignVisible(false)} onConfirm={() => handleDialogConfirm('sign')} />
            <UploadImageDialog open={uploadImgVisible} onClose={() => setUploadImgVisible(false)} onConfirm={() => handleDialogConfirm('image')} />
        </div>
    );
}
export default SignStep;