import axios from "axios";
import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../Main";
import Loading from "../elements/Loading";

const Identity = () => {
    const [context, setContext] = useContext(AppContext);
    const username_input = useRef(null);

    const submitIdentityForm = (ev) => {
        axios.post(`${window.location.origin}/api/user/new`, {'username': username_input.current.value}).
            then((r) => {
                setContext({...context, 'user': r.data.user});
                context.setAlertConfig({'type': 'success', 'message': `Witaj ${r.data.user}!`});
            }, (r) => {
                // nie udało się stworzyć użytkownika
                setContext({...context, 'user': r.data.user});
                context.setAlertConfig({'type': 'danger', 'message': 'Nie udało się utworzyć użytkownika'});
            });
        ev.preventDefault();
    }

    useEffect(() => {
        axios.post(`${window.location.origin}/api/user/verify`, {}).
            then((response) => {
                // username already saved
                setContext({...context, 'user': response.data.user});
            }, () => {
                setContext({...context, 'user': ''});
            });
    }, []);

    return (
        <div className="identity-card">
            <form method="post" className="form" onSubmit={submitIdentityForm}>
                <div className="row justify-content-center px-4 py-5">
                    <p className="w-100 text-center">Jak się nazywasz?</p>
                    <input type="text" className="" name="username" ref={username_input} placeholder="Nazwa" required/>
                    <input type="submit" className="btn btn-dark mt-2" value="Zapisz"/>
                </div>
            </form>
        </div>
    );
};

export default Identity;