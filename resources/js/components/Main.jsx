import React, { createContext, useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import NavigationBar from './elements/NavigationBar';
import Identity from './pages/Identity';
import Files from './pages/Files';
import ProtectedRoute from './util/ProtectedRoute';
import Alert from './elements/Alert';
import { Toast } from 'bootstrap';
import Users from './pages/Users';

export const AppContext = createContext({});

function Main() {
    const [alert_config, setAlertConfig] = useState({'message':'', 'type':''});
    const [context, setContext] = useState({
        'user': '', 
        'setAlertConfig': setAlertConfig
    });

    useEffect(()=>{
        try {
            if (alert_config.message==='') return;
            const alert = Toast.getOrCreateInstance('#alert-el');
            alert.show();
            setTimeout(()=>{alert.hide();}, 5000);
        } catch(e) {console.log(e)}
    }, [alert_config]);

    return (
        <AppContext.Provider value={[context, setContext]}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<NavigationBar />}>
                        <Route path="/" element={<Identity/>} />
                        <Route path="/files" element={<ProtectedRoute><Files/></ProtectedRoute>} />
                        <Route path="/users" element={<ProtectedRoute><Users/></ProtectedRoute>} />
                    </Route>
                </Routes>
            </BrowserRouter>
            <Alert config={alert_config}/>
        </AppContext.Provider>
    );
}

export default Main;

if (document.getElementById('root')) {
    const Index = ReactDOM.createRoot(document.getElementById("root"));

    Index.render(
        <React.StrictMode>
            <Main/>
        </React.StrictMode>
    )
}
