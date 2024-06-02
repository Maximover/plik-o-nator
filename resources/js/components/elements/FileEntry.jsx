import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../Main";
import axios from "axios";

const FileEntry = (props) => {
    const [context, setContext] = useContext(AppContext);
    const [awaitsDelete, setAwaitsDelete] = useState(false);
    const [expanded, setExpanded] = useState(false);
    const entry = useRef(null);
    const preview_loader = useRef(null);
    const el = props.entry;
    let created_at = new Date(el.created_at).toLocaleString('PL-pl', {day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit'});
    let extension = el.original_name.split(".").slice(-1)[0];

    const handleDelete = (ev) => {
        ev.stopPropagation();
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

    const updateDownloadCount = (ev) => {
        ev.stopPropagation();
        setTimeout(()=>{props.notifier[1](!props.notifier[0])}, 1000);
    }

    const entryClick = () => {
        setExpanded(!expanded);
        entry.current.classList.toggle('enlarged-entry');
    }

    return (
        <div className="file-entry" ref={entry} onClick={entryClick}>
            <div className="d-flex justify-content-between w-100">
                <div className="d-flex gap-2">
                    <div className="file-icon"><span>{extension}</span></div>
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
            { expanded ? <>
                    { el.mime_type.includes('image') ? 
                        <img src={`${window.location.origin}/api/uploaded_files/${el.id}`} className="file-preview" onLoadStart={()=>{preview_loader.current.hidden = false}} 
                                                                                                                    onLoad={()=>{preview_loader.current.hidden = true}}/>
                    : <></> }
                    { el.mime_type.includes('video') ? 
                        <video className="file-preview" controls onLoadStart={()=>{preview_loader.current.hidden = false}} onLoadedData={()=>{preview_loader.current.hidden = true}}>
                            <source src={`${window.location.origin}/api/uploaded_files/${el.id}`} type={el.mime_type}/>
                        </video>
                    : <></> }
                    <span className="loader-small" ref={preview_loader} />
                </> 
            : <></> }
        </div>
    );
};

export default FileEntry;