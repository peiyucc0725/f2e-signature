import { Route, Routes } from "react-router-dom";
import Layout from "../views/Layout";
import Landing from "../views/Landing"
import Main from "../views/Main"
import Editor from '../views/Editor'

const Routers = props => {
    return (
        <div className="App">
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Landing />} />
                    <Route path="/main" element={<Main />}></Route>
                </Route>
            </Routes>
        </div>
    );
}

export default Routers