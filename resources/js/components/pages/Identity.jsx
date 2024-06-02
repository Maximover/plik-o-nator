import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../Main";

const Identity = () => {
    const [context, setContext] = useContext(AppContext);
    const [awaitsLogin, setAwaitsLogin] = useState(false);
    const username_input = useRef(null);
    const password_input = useRef(null);

    const submitIdentityForm = (ev) => {
        ev.preventDefault();
        if (awaitsLogin) return;
        setAwaitsLogin(true);
        axios.post(`${window.location.origin}/api/user/login`, {'username': username_input.current.value, 'password': password_input.current.value}).
            then((r) => {
                setContext({...context, 'user_id': r.data.user.id, 'user': r.data.user.name, 'role': r.data.user.role});
                context.setAlertConfig({'type': 'success', 'message': `Witaj ${r.data.user.name}!`});
            }, (r) => {
                // cannot login
                setContext({...context, 'user': ''});
                context.setAlertConfig({'type': 'danger', 'message': 'Nie ma takiego użytkownika'});
            }).finally(()=>{setAwaitsLogin(false)});
    }

    useEffect(() => {
        axios.post(`${window.location.origin}/api/user/verify`, {}).
            then((r) => {
                // username verified
                setContext({...context, 'user_id': r.data.user.id, 'user': r.data.user.name, 'role': r.data.user.role});
            }, () => {
                setContext({...context, 'user_id': -1, 'user': '', 'role': ''});
            });
    }, []);

    return (
        <div className="identity-card vw-50">
            <form method="post" className="form" onSubmit={submitIdentityForm}>
                <div className="row justify-content-center px-4 py-5">
                    <p className="w-100 text-center">Zaloguj się</p>
                    <input type="text" className="" name="username" ref={username_input} placeholder="Nazwa" required/>
                    <input type="password" className="m-2" name="password" ref={password_input} placeholder="Hasło" required/>
                    <button type="submit" className="btn btn-dark mt-2">{ awaitsLogin ? <span className="loader-small"/> : <span>Wejdź</span> }</button>
                </div>
            </form>
        </div>
    );
};

export default Identity;