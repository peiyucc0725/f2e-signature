import React, { useState } from 'react'
import CustomButton from "../components/CustomButton";
import '../assets/scss/components/main.scss'
import Editor from './Editor';

const Main = () => {
    const [step, setStep] = useState(1)
    const cancel = (event) => { };
    const next = (event) => { };

    return (
        <div className="main-page">
            <div className="main-container">
                <Editor step={step} />
            </div>
            <div className="main-footer">
                <div className="inner">
                    <div className="main-footer__step">
                        <div className="step-text">
                            <div className='step-1 finish'>上傳文件</div>
                            <div className='step-2 active'>進行簽署</div>
                            <div className='step-3'>下載文件</div>
                        </div>
                        <div className={`step-line progress-${50}`}>
                            <div className='step-1 finish'></div>
                            <div className='step-2 active'></div>
                            <div className='step-3'></div>
                        </div>
                    </div>
                    <div className="main-footer__btn">
                        <CustomButton text="取消" type="cancel" onClick={cancel} ></CustomButton>
                        <CustomButton contentClass="ml-16" text="開啟文件" onClick={next} autoFocus></CustomButton>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main;
