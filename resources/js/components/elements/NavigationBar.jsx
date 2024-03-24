import React, { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AppContext } from "../Main";
import axios from "axios";
import AppIcon from "./AppIcon";

const NavigationBar = () => {
    const [context, ] = useContext(AppContext);
    const [nav_state, setNavState] = useState('disabled');
    const navigate = useNavigate();
    const logoutFormSubmit = (ev) => {
        ev.preventDefault();
        axios.post(`${window.location.origin}/api/user/quit`, {}).then(()=>{
            window.location = '/';
        });
    }
    // upate nav according to user cookie
    useEffect(() => {
        if (context.user == '') {
            setNavState('disabled');
            navigate('/');
        } else {
            setNavState('');
            navigate('/files');
        }
    }, [context]);

    return ( 
        <>
        <nav className="navbar navbar-expand-md navbar-dark shadow-sm">
            <div className="container d-flex align-items-center">
                <AppIcon />
                <a className="navbar-brand" to="/">
                    Plik-o-nator
                </a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="{{ __('Toggle navigation') }}">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    {/* <!-- Left Side Of Navbar --> */}
                    <ul className="navbar-nav me-auto">
                        <li className='nav-item'>
                            <Link className={'nav-link '+nav_state} to="/files">Pliki</Link>
                        </li>
                        <li className='nav-item'>
                            <Link className={'nav-link '+nav_state} to="/downloads">Pobrane</Link>
                        </li>
                    </ul>

                    {/* <!-- Right Side Of Navbar --> */}
                    <ul className="navbar-nav ms-auto">
                        {/* <!-- Authentication Links --> */}
                        {context.user ?
                            <li className="nav-item dropdown">
                                <a id="navbarDropdown" className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre="true">
                                    {context.user}
                                </a>
                                <div className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <form id="logout-form" onSubmit={logoutFormSubmit} method="POST">
                                        <button type="submit" className="dropdown-item">Zmień użytkownika</button>
                                    </form>
                                </div>
                            </li>
                            : <></>
                        }
                        
                    </ul>
                </div>
            </div>
        </nav>
        <main className="container-fluid">
            <div className="row py-3">
                <div className='col-md-2'></div>
                <div className='d-flex flex-column col justify-content-center align-items-center'>
                    <Outlet />
                </div>
                <div className='col-md-2'></div>
            </div>
        </main>

        </>
    );
};

export default NavigationBar;