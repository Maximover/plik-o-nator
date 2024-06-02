import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../Main";
import axios from "axios";

const FileEntry = (props) => {
    const [context, setContext] = useContext(AppContext);
    const [awaitsDelete, setAwaitsDelete] = useState(false);
    const el = props.entry;
    let created_at = new Date(el.created_at).toLocaleString('PL-pl', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'});

    const handleDelete = () => {
        if (awaitsDelete) return;
        setAwaitsDelete(true);
        axios.delete(`${window.location.origin}/api/uploaded_files/${el.id}`,).
            then(() => {
                context.setAlertConfig({'type': 'warning', 'message': 'Usunięto plik'});
                props.notifier[1](!props.notifier[0]);
            }, () => {
                context.setAlertConfig({'type': 'danger', 'message': 'Nie udało się usunąć pliku'});
            }).then(()=>{setAwaitsDelete(false)});
    }

    const updateDownloadCount = () => {
        setTimeout(()=>{props.notifier[1](!props.notifier[0])}, 1000);
    }

    return (
        <div className="file-entry">
            <div className="d-flex gap-2">
                { el.mime_type.includes('image') ? 
                    <img src={`${window.location.origin}/api/uploaded_files/${el.id}`} className="file-preview" />
                : <></> }
                { el.mime_type.includes('video') ? 
                    <video className="file-preview" controls>
                        <source src={`${window.location.origin}/api/uploaded_files/${el.id}`} type={el.mime_type}/>
                    </video>
                : <></> }
                <span className={el.id === -1 ? 'text-nowrap text-darkened' : 'text-nowrap'}>
                    {el.caption}
                </span>
                {el.id === -1 ? <></> : <span className="text-darkened text-nowrap">{el.downloads_count} pobrań</span>}
            </div>
            <div className="d-flex justify-content-end align-items-center gap-3 w-100">
                {context.user_id === el.user_id ? <>
                    <img src={DELETE_ICON_IMAGE} className="small-icon" onClick={handleDelete} title="Usuń"/>
                </> : <></>}
                {el.id === -1 ? <></> : <>
                    <a href={`${window.location.origin}/api/uploaded_files/download/${el.id}`} onClick={updateDownloadCount} title="Pobierz">
                        <img src={DOWNLOAD_ICON_IMAGE} className="small-icon" />
                    </a>
                    <span className="text-sm">Wrzucono: {created_at}</span>
                </>}
            </div>
        </div>
    );
};

export default FileEntry;