import React, { useState } from 'react'
import { useNavigate } from "react-router-dom";
import { jsPDF } from 'jspdf'
import CustomButton from "../components/CustomButton";
import '../assets/scss/components/main.scss'
import Editor from './Editor';
import FileLoadingDialog from '../components/dialog/FileLoadingDialog'

const Main = () => {
    let navigate = useNavigate();
    const [step, setStep] = useState(1)
    const [selectedFile, setSelectedFile] = useState(null)
    const [sign, setSign] = useState(null)
    const [previewImage, setPreviewImage] = useState(null)
    const [loading, setLoading] = useState(false)
    const stepClass = (cur) => {
        let array = [`step-${cur}`]
        if (step === cur) array.push('active')
        if (step > cur) array.push('finish')
        return array.join(' ')
    }
    const stepLineClass = () => {
        const array = ['step-line']
        switch (step) {
            case 2:
                array.push('progress-50')
                break;
            case 3:
                array.push('progress-100')
                break;
            default:
                break;
        }
        return array.join(' ')
    }
    const confirmBtnText = () => {
        switch (step) {
            case 1:
                return '開啟文件'
            case 2:
                return '創建文件'
            case 3:
                return '下載文件'
            default:
                return '開啟文件'
        }
    }
    const stepBtnStatus = () => {
        switch (step) {
            case 1:
                return selectedFile ? false : true
            case 2:
                return sign ? false : true
            case 3:
                return false
            default:
                return false
        }
    }
    const back = () => {
        setStep(step - 1)
    }
    const next = () => {
        switch (step) {
            case 1:
                setStep(step + 1)
                return
            case 2:
                setLoading(true)
                setTimeout(() => {
                    setStep(step + 1)
                }, 1500)
                return
            case 3:
                exportPDF()
                return
            default:
                return
        }
    };
    const cancel = () => {
        navigate('/')
    }
    const handleUpload = (file) => {
        setSelectedFile(file)
    }
    const handleSign = (sign) => {
        setSign(sign)
    }
    const handlePreviewImage = (data) => {
        setPreviewImage(data)
    }
    const exportPDF = () => {
        const { image, width, height } = previewImage
        const { fileName } = sign
        let orientation = 'portrait'
        if (width > height) {
            orientation = "landscape"
        }
        const pdf = new jsPDF({ orientation, compress: true });
        const pdfWidth = pdf.internal.pageSize.width;
        const pdfHeight = pdf.internal.pageSize.height;
        pdf.addImage({ imageData: image, format: 'JPEG', x: 0, y: 0, width: pdfWidth, height: pdfHeight, compression: 'MEDIUM' });
        pdf.save(`${fileName.replace('.pdf', '')}`);
    }

    return (
        <div className="main-page">
            <div className="main-container">
                <FileLoadingDialog open={loading} />
                <Editor
                    step={step}
                    handleUpload={handleUpload}
                    handleSign={handleSign}
                    handlePreviewImage={handlePreviewImage}
                    handleLoading={(val) => setLoading(val)} />
            </div>
            <div className="main-footer">
                <div className="inner">
                    <div className="main-footer__step">
                        <div className="step-text">
                            <div className={stepClass(1)}>上傳文件</div>
                            <div className={stepClass(2)}>進行簽署</div>
                            <div className={stepClass(3)}>下載文件</div>
                        </div>
                        <div className={stepLineClass()}>
                            <div className={stepClass(1)}></div>
                            <div className={stepClass(2)}></div>
                            <div className={stepClass(3)}></div>
                        </div>
                    </div>
                    <div className="main-footer__btn">
                        <CustomButton text="取消" type="cancel" onClick={cancel} ></CustomButton>
                        {step === 3
                            ? <CustomButton contentClass="ml-16" text="返回編輯" type="cancel" onClick={back} ></CustomButton>
                            : false}
                        <CustomButton
                            contentClass="ml-16"
                            text={confirmBtnText()}
                            onClick={next}
                            disabled={stepBtnStatus()}></CustomButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
