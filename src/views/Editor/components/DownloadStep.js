import React, { useEffect, useState, useRef } from 'react'
import { fabric } from 'fabric'
import '../../../assets/scss/components/downloadStep.scss'

const DownloadStep = props => {
    const { sign, handlePreviewImage, handleLoading } = props
    const [previewImage, setPreviewImage] = useState(null)
    const canvas = useRef(null)
    const previewRef = useRef(null)
    const onUnload = (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.returnValue = '確定要離開頁面嗎?'
    }
    const init = () => {
        if (!sign) return
        const cv = document.createElement("canvas");
        canvas.current = new fabric.Canvas(cv)
        const { width, height, zoom, data } = sign
        const previewHeight = previewRef.current.clientHeight - 50
        canvas.current.setWidth(width);
        canvas.current.setHeight(height);
        canvas.current.setZoom(zoom);
        document.getElementById("preview-image").style.marginTop = `${height - previewHeight}px`;
        canvas.current.loadFromJSON(data,
            () => {
                const image = canvas.current.toDataURL('image/jpeg', 1.0)
                setPreviewImage(image)
                handlePreviewImage({ width, height, image })
                handleLoading(false)
            })
    }

    useEffect(() => {
        init()
        window.addEventListener("beforeunload", onUnload)
        return () => {
            window.removeEventListener("beforeunload", onUnload)
        }
    }, [])
    return (
        <div className="download-step" ref={previewRef}>
            <img id="preview-image" src={previewImage} alt="preview-pdf" />
        </div>
    );
}
export default DownloadStep;