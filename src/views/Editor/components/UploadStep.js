import React, { useState, useRef } from 'react'
import '../../../assets/scss/components/uploadStep.scss'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { ReactComponent as Pdf } from '../../../assets/images/pdf.svg'
import ConfirmDialog from '../../../components/dialog/ConfirmDialog'
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '../../../assets/images/search-icon.svg';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const UploadStep = props => {
    const { handleSelectFile } = props
    const inputRef = useRef(null);
    const [value, setValue] = useState(0);
    const [dragActive, setDragActive] = useState(false);
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertText, setAlertText] = useState('您的檔案太大了!');
    const [uploadFiles, setUploadFiles] = useState(JSON.parse(localStorage.getItem('sign-upload-files')) || []);
    const [selectedFile, setSelectedFile] = useState(props.selected)

    const timeFormat = (timestamp) => {
        if (!timestamp) return '--'
        const time = new Date(timestamp)
        const year = time.getFullYear()
        const mon = time.getMonth() + 1
        const date = time.getDate()
        const hour = time.getHours()
        const min = time.getMinutes()
        return `${year}/${mon}/${date}, ${hour}:${min}`
    }
    const onClickUpload = () => {
        inputRef.current.click();
    }

    const verifyFile = (file) => {
        let verifystatus = true
        const inCludeFile = uploadFiles.find(item => item.name === file.name && item.size === file.size)
        if (file.size / 1024 / 1024 > 10) {
            setAlertText('您的檔案太大了!')
            verifystatus = false
            setAlertVisible(true)
        }
        else if (file.type !== 'application/pdf') {
            setAlertText('您的檔案類型不是PDF檔!')
            verifystatus = false
            setAlertVisible(true)
        }
        else if (inCludeFile) {
            setAlertText('已存在相同檔案!')
            verifystatus = false
            setAlertVisible(true)
        }
        return verifystatus
    }

    const readBlob = (blob) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.addEventListener("load", () => resolve(reader.result));
            reader.addEventListener("error", reject);
            reader.readAsDataURL(blob);
        });
    }

    const encodeFile = async (file) => {
        if (uploadFiles.length >= 3) {
            setAlertText('檔案數量超過上限，請登入使用更大空間!')
            setAlertVisible(true)
            return
        }
        const verified = verifyFile(file)
        if (!verified) return
        handleSelectFile(file)
        const blob = await readBlob(file);
        const data = {
            name: file.name,
            size: file.size,
            uploadTime: new Date().getTime(),
            openTime: null,
            source: blob
        }
        setSelectedFile(data)
        setUploadFiles([...uploadFiles, data])
        localStorage.setItem('sign-upload-files', JSON.stringify([...uploadFiles, data]))
        setValue(1)
    }

    const onSelectFile = (item) => {
        const data = selectedFile && selectedFile.name === item.name ? null : item
        setSelectedFile(data)
        handleSelectFile(data)
    }

    const handleChangeTab = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeInput = function (e) {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            encodeFile(e.target.files[0])
        }
    };

    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            encodeFile(e.dataTransfer.files[0])
        }
    };

    return (
        <div className="upload-step">
            <div className="inner">
                <Box className="upload-box" sx={{ bgcolor: 'background.paper', width: '100%' }}>
                    <Tabs
                        value={value}
                        onChange={handleChangeTab}
                        variant="fullWidth"
                    >
                        <Tab label="上傳新文件" {...a11yProps(0)} />
                        <Tab label="選擇已上傳文件" {...a11yProps(1)} />
                    </Tabs>

                    <TabPanel className="tab-panel" value={value} index={0}>
                        <input ref={inputRef} type="file" multiple={false} onChange={handleChangeInput} style={{ display: 'none' }} />
                        <div
                            className={`file-box${dragActive ? ' drag-active' : ''}`}
                            onClick={onClickUpload}
                            onDragEnter={handleDrag}
                            onDragLeave={handleDrag}
                            onDragOver={handleDrag}
                            onDrop={handleDrop}>
                            <div>點擊此處上傳 或 直接拖曳檔案</div>
                            <Pdf className="pdf-svg" />
                            <div>(限10MB以下PDF檔)</div>
                        </div>
                    </TabPanel>
                    <TabPanel className="tab-panel" value={value} index={1}>
                        {uploadFiles && uploadFiles.length > 0 ?
                            <div className='upload-list'>
                                <div >
                                    <TextField
                                        className="upload-list__search"
                                        id="outlined-basic"
                                        variant="outlined"
                                        placeholder="搜尋文件名稱"
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position="end">
                                                    <img src={SearchIcon} alt="search-icon" />
                                                </InputAdornment>
                                            )
                                        }} />
                                </div>
                                <div className='upload-list__header'>
                                    <div className='name'>名稱</div>
                                    <div className='upload-time'>上傳時間</div>
                                    <div className='open-time'>上次開啟</div>
                                </div>
                                {uploadFiles.map((file, index) => {
                                    return (
                                        <div className={`upload-list__row${selectedFile && selectedFile.name === file.name ? ' active' : ''}`}
                                            key={index} onClick={() => onSelectFile(file)}>
                                            <div className='name' title={file.name}>{file.name}</div>
                                            <div className='upload-time'>{timeFormat(file.uploadTime)}</div>
                                            <div className='open-time'>{timeFormat(file.openTime)}</div>
                                        </div>
                                    )
                                })}
                            </div>
                            : <div className='empty-upload'>尚未上傳任何文件!</div>}
                    </TabPanel>
                </Box>
            </div>
            <ConfirmDialog open={alertVisible} text={alertText} confirmBtnText="我知道了" alert
                onConfirm={() => setAlertVisible(false)} />
        </div>
    );
}
export default UploadStep;