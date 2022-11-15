import React, { useState } from 'react'
import UploadStep from './components/UploadStep'
import SignStep from './components/SignStep'
import DownloadStep from './components/DownloadStep'

const Editor = props => {
    const { handleUpload } = props
    const [selectedFile, setSelectedFile] = useState(null)

    const handleSelectFile = (file) => {
        setSelectedFile(file)
        handleUpload(file)
    }

    return (
        <div className="editor-page">
            {props.step === 1 ?
                <UploadStep handleSelectFile={handleSelectFile} />
                : props.step === 2 ?
                    <SignStep selected={selectedFile} />
                    : <DownloadStep />}
        </div>
    );
}
export default Editor;
