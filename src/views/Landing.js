import React from 'react';
import '../assets/scss/components/landing.scss'
import logo from '../assets/images/logo-lg.svg'
import Main1x from '../assets/images/landing@1x.png'
import Main2x from '../assets/images/landing@2x.png'
import Main3x from '../assets/images/landing@3x.png'
import { useNavigate } from "react-router-dom";

const Landing = () => {
    let navigate = useNavigate();
    return (
        <div className="langing-page">
            <img src={Main1x} alt="main" srcSet={`${Main2x} 2x,${Main3x} 3x`} />
            <div className='langing-page__main'>
                <img src={logo} alt="logo" />
                <div className="subtitle">線上簽署，方便快速。</div>
                <button className='sign-btn' onClick={()=> navigate('/main')}>簽署新文件</button>
            </div>
        </div>
    );
}

export default Landing;
