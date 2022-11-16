import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import "../assets/scss/components/navigation.scss"
import logo from "../assets/images/logo-sm.svg"
import CustomButton from "./CustomButton";

const Navigation = props => {
    let navigate = useNavigate();
    const [pathName, setPathName] = useState('')
    const pathMapping = {
        '/main': '簽署新文件',
        '/main/editor': '簽署新文件'
    }
    useEffect(() => {
        setPathName(props.path && props.path !== '/' ? pathMapping[props.path] : '')
    }, [props.path])

    return (
        <div className="navigation">
            <div className="inner">
                <div className="navigation-left">
                    <img src={logo} alt="logo" onClick={() => navigate('/')} />
                    {pathName ? <span className='path-line'>│</span> : null}
                    {pathName ? <span className='path-name'>{pathName}</span> : null}
                </div>
                <div>
                    <CustomButton type="text" text="邀請他人簽署" disabled></CustomButton>
                    {props.path !== '/main' ?
                        <CustomButton type="text" text="簽署新文件" onClick={() => navigate('/main')}></CustomButton>
                        : null}
                    <CustomButton type="text" text="登入" disabled></CustomButton>
                </div>
            </div>
        </div>
    );
}

export default Navigation;
