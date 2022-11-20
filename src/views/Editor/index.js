import React, { useState } from 'react'
import UploadStep from './components/UploadStep'
import SignStep from './components/SignStep'
import DownloadStep from './components/DownloadStep'

const Editor = props => {
    const { handleUpload, handleSign, handlePreviewImage, handleLoading } = props
    const [selectedFile, setSelectedFile] = useState(null)
    const [sign, setSign] = useState(null)

    const handleSelectFile = (file) => {
        setSelectedFile(file)
        handleUpload(file)
    }

    const handleSignCanvas = (data) => {
        handleSign(data)
        setSign(data)
    }

    return (
        <div className="editor-page">

            {props.step === 1 ?
                <UploadStep handleSelectFile={handleSelectFile} />
                : props.step === 2 ?
                    <SignStep
                        sign={sign}
                        selected={selectedFile}
                        handleSign={handleSignCanvas} />
                    : <DownloadStep
                        sign={sign}
                        handleLoading={handleLoading}
                        handlePreviewImage={handlePreviewImage} />}
        </div>
    );
}
export default Editor;
