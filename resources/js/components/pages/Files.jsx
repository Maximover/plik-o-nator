import React, { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../Main";
import axios from "axios";
import Loading from "../elements/Loading";
import FileEntry from "../elements/FileEntry";
import { Modal } from "bootstrap";

const Files = () => {
    const [context, ] = useContext(AppContext);
    const drop = useRef(null);
    const file_submit = useRef(null);
    const upload_modal = useRef(null);
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [awaitsUpload, setAwaitsUpload] = useState(false);
    const [render, NotifyRender] = useState(false);
    const caption_input = useRef(null);
    const file_input = useRef(null);

    const onFileUploadProgress = (progress) => {
        console.log(`${progress}%`);
    };
    const onFileChosen = (ev) => {
        caption_input.current.value = ev.target.files[0].name;
        caption_input.current.select();
    };
    const newFileSubmit = (ev) => {
        ev.preventDefault();
        if (awaitsUpload) return;
        setAwaitsUpload(true);
        const upload_data = {'caption':caption_input.current.value, 'file':file_input.current.files[0]};
        axios.post(`${window.location.origin}/api/uploaded_files`, upload_data, 
                    { 'headers': {'Content-Type': 'multipart/form-data'}, 
                       onUploadProgress: data=>{onFileUploadProgress(Math.round((100 * data.loaded) / data.total))}
        }).then((r) => {
            refreshElements();
            context.setAlertConfig({'type': 'success', 'message': 'Plik wysłany'});
            file_input.current.files = new FileList();
            caption_input.current.value = '';
        }, () => {
            context.setAlertConfig({'type': 'danger', 'message': 'Nie udało się wysłać pliku'});
        }).finally(()=>{
            setAwaitsUpload(false);
            Modal.getOrCreateInstance('#upload-file-modal').hide();
        });
    };

    const refreshElements = () => {
        setLoading(true);
        axios.get(`${window.location.origin}/api/uploaded_files`, /*{'sort':'', 'per_page':''}*/).
            then((response) => {
                const data = response.data.data;
                if (data.length > 0) {
                    setElements(data);
                } else {
                    setElements([{'id': -1, 'caption': 'Brak plików...'}]);
                }
                setLoading(false);
            }, () => {
                setElements([{'id': -1, 'caption': 'Wystąpił błąd...'}]);
                setLoading(false);
                context.setAlertConfig({'type': 'danger', 'message': 'Nie udało się pobrać plików'});
            });
    };

    const showUploadFileModal = (file) => {
        Modal.getOrCreateInstance('#upload-file-modal').show();
        if (file) {
            const data_transfer = new DataTransfer();
            data_transfer.items.add(file);
            file_input.current.files = data_transfer.files;
            caption_input.current.value = file.name ?? '';
            file_submit.current.focus();
        }

    };
    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const files = e.dataTransfer.files;
        if (files.length > 1){
            context.setAlertConfig({message: 'Można załączyć tylko 1 plik', type: 'warning'});
        } else {
            showUploadFileModal(files[0]);
        }
    };
    
    useEffect(()=>{
        drop.current.addEventListener('dragover', handleDragOver);
        drop.current.addEventListener('drop', handleDrop);
        upload_modal.current.addEventListener('dragover', handleDragOver);
        upload_modal.current.addEventListener('drop', handleDrop);
        refreshElements();
    }, [render]);

    return (
        <>
            <div className="new-file-entry" ref={drop} onClick={()=>{showUploadFileModal()}}>
                <span className="text-center">Prześlij plik...</span>
            </div>
            { elements.map((el) => 
                <FileEntry key={el.id} entry={el} notifier={[render, NotifyRender]}/>
            )}
            <Loading show={loading} />
            {/* new file modal */}
            <div id="upload-file-modal" ref={upload_modal} className="modal fade mt-10" tabindex="-1" role="dialog" aria-labelledby="uploadFileModal" aria-hidden="true">
                <div className="modal-dialog modal-md">
                    <div className="modal-content border-dim rounded p-5">
                        <form className="form text-center input-group" onSubmit={newFileSubmit} method="post">
                            <h4 className="w-100 text-center">Wstaw plik...</h4>
                            <div className="d-flex align-items-center jutify-content-center gap-1 py-2">
                                <input className="input-group-text" type="text" placeholder="Opis" ref={caption_input} required />
                                <input className="w-100 form-control-file" type="file" ref={file_input} onChange={onFileChosen} required />
                            </div>
                            <button className="btn btn-dark w-100" ref={file_submit} type="submit">{ awaitsUpload ? <span className="loader-small"/> : <span>Prześlij</span> }</button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Files;