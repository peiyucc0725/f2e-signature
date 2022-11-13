import "../assets/scss/components/navigation.scss"
import logo from "../assets/images/logo-sm.svg"
import CustomButton from "./CustomButton";

const Navigation = prop => {
    return (
        <div className="navigation">
            <div className="inner">
                <img src={logo} alt="logo" />
                <div>
                    <CustomButton type="text" text="邀請他人簽署" disabled></CustomButton>
                    <CustomButton type="text" text="簽署新文件"></CustomButton>
                    <CustomButton type="text" text="登入"></CustomButton>
                </div>
            </div>
        </div>
    );
}

export default Navigation;
