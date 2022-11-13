import { Route, Routes } from "react-router-dom";
import Layout from "../views/Layout";
import Landing from "../views/Landing"
import Main from "../views/Main"

const Routers = props => {
    return (
        <div className="App">
            <Routes>
                <Route element={<Layout />}>
                    <Route exact path="/" element={<Landing />} />
                    <Route exact path="/main" element={<Main />} />
                </Route>
            </Routes>
        </div>
    );
}

export default Routers