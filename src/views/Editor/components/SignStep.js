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
    const { selected, sign, handleSign } = props
    const editorRef = useRef(null)
    const [fileName, setFileName] = useState(selected.name)
    const [signList, setSignList] = useState(JSON.parse(localStorage.getItem('sign-files')) || [])
    const [uploadImgVisible, setUploadImgVisible] = useState(false)
    const [signVisible, setSignVisible] = useState(false)
    const [dragItem, setDragItem] = useState(null)
    const [drawerOpen, setDrawerOpen] = useState(true)
    const canvas = useRef(null);
    let pdfDoc = null
    const base64Prefix = "data:application/pdf;base64,";
    pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
    var fabricIcon = document.createElement('img');
    fabricIcon.src = DeleteIcon;
    const handleUpdateSign = () => {
        handleSign(canvas.current.getObjects().length > 0 ? {
            width: canvas.current.width,
            height: canvas.current.height,
            zoom: canvas.current.getZoom(),
            fileName,
            data: JSON.stringify(canvas.current)
        } : null)
    }
    const renderIcon = (ctx, left, top, styleOverride, fabricObject) => {
        const size = 22;
        ctx.save();
        ctx.translate(left, top);
        ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
        ctx.drawImage(fabricIcon, -size / 2, -size / 2, size, size);
        ctx.restore();
    }

    const deleteObject = (eventData, transform) => {
        var target = transform.target;
        canvas.current.remove(target);
        canvas.current.requestRenderAll();
        handleUpdateSign()
    }

    const handleDrop = (e) => {
        if (!dragItem) return
        fabric.Image.fromURL(dragItem.source, function (image) {
            if (image.width > canvas.current.width) {
                image.scaleX = canvas.current.width / image.width * 0.8;
                image.scaleY = canvas.current.width / image.width * 0.8;
            }
            else {
                image.scaleX = 1;
                image.scaleY = 1;
            }
            image.top = e.clientY - canvas.current._offset.top - image.height * image.scaleY / 2;
            image.left = e.clientX - canvas.current._offset.left - image.width * image.scaleX / 2;
            canvas.current.add(image);
            handleUpdateSign()
        });
    }

    const handleDragStart = (item) => {
        setDragItem(item)
    }

    const handleDragEnd = (e) => {
        setDragItem(null)
    }

    const handelDeleteSign = (id) => {
        const newList = signList.filter(item => item.id !== id)
        setSignList(newList)
        localStorage.setItem('sign-files', JSON.stringify(newList))
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
        const height = editorRef.current.clientHeight - 50
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
        fabric.Object.prototype.controls.deleteControl = new fabric.Control({
            x: -0.5,
            y: -0.5,
            cursorStyle: 'pointer',
            mouseUpHandler: deleteObject,
            render: renderIcon,
            cornerSize: 22
        });
        fabric.Object.prototype.borderColor = '#D9D9D9';
        fabric.Object.prototype.cornerColor = '#D9D9D9';
        fabric.Object.prototype.cornerStyle = 'circle';
        canvas.current = new fabric.Canvas("canvas")
        canvas.current.on('object:modified', e => {
            handleUpdateSign()
        })
        if (sign) {
            const editorHeight = editorRef.current.clientHeight - 50
            const { width, height, zoom, data } = sign
            canvas.current.setWidth(width);
            canvas.current.setHeight(height);
            canvas.current.setZoom(zoom);
            document.getElementsByClassName("canvas-container")[0].style.marginTop = `${height - editorHeight}px`;
            canvas.current.loadFromJSON(data,
                () => {
                    canvas.current.renderAll.bind(canvas.current)
                })
        }
        else {
            canvas.current.requestRenderAll();
            const data = atob(selected.source.substring(base64Prefix.length));
            pdfDoc = await pdfjsLib.getDocument({ data }).promise;
            // TODO: 多頁切換
            renderPage(1)
        }
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
            <div className={`sign-step__setting ${!drawerOpen?'hidden': ''}`}>
                <div className={`drawer-btn ${!drawerOpen ? 'hidden' : 'show'}`} onClick={()=>setDrawerOpen(!drawerOpen)}>
                    {!drawerOpen ? '》' : '《'}
                </div>
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
                    <div className="setting-sign__title">我的簽名(直接拖曳使用)</div>
                    {signList.map((item) => {
                        return (
                            <div className='setting-sign__sign' key={item.id}>
                                <div draggable
                                    onDragStart={() => handleDragStart(item)}
                                    onDragEnd={handleDragEnd}>
                                    <img className="sign" src={item.source} alt={`sign-${item.id}`} />
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
            <div ref={editorRef} className="sign-step__editor" onDrop={handleDrop}>
                <canvas id="canvas"> </canvas>
            </div>
            <SignDialog open={signVisible} onClose={() => setSignVisible(false)} onConfirm={() => handleDialogConfirm('sign')} />
            <UploadImageDialog open={uploadImgVisible} onClose={() => setUploadImgVisible(false)} onConfirm={() => handleDialogConfirm('image')} />
        </div>
    );
}
export default SignStep;