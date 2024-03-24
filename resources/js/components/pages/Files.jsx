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
    const [elements, setElements] = useState([]);
    const [loading, setLoading] = useState(true);
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
        const upload_data = {'caption': caption_input.current.value, 'file':file_input.current.files[0]};
        axios.post(`${window.location.origin}/api/uploaded_files`, upload_data, 
                    { 'headers': {'Content-Type': 'multipart/form-data'}, 
                       onUploadProgress: data=>{onFileUploadProgress(Math.round((100 * data.loaded) / data.total))}
        }).then((r) => {
            refreshElements();
            context.setAlertConfig({'type': 'success', 'message': 'Plik wysłany'});
            file_input.current.files = [];
            caption_input.current.value = '';
        }, () => {
            context.setAlertConfig({'type': 'danger', 'message': 'Nie udało się wysłać pliku'});
        });
    };

    const refreshElements = () => {
        setLoading(true);
        axios.get(`${window.location.origin}/api/uploaded_files`, /*{'sort':'', 'per_page':''}*/).
            then((response) => {
                setElements(response.data.data);
                setLoading(false);
            }, () => {
                setElements([{'id': -1, 'caption': 'Brak plików...'}]);
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
        console.log("dragging...");
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
        refreshElements();
    }, []);

    return (
        <>
            <div className="new-file-entry" ref={drop} onClick={showUploadFileModal}>
                <span className="text-center">Prześlij plik...</span>
            </div>
            {elements.map((el, index) => 
                <FileEntry key={index} entry={el} />
            )}
            <Loading show={loading} />
            {/* new file modal */}
            <div id="upload-file-modal" class="modal fade mt-10" tabindex="-1" role="dialog" aria-labelledby="uploadFileModal" aria-hidden="true">
                <div class="modal-dialog modal-sm">
                    <div class="modal-content p-5">
                        <form className="form text-center" onSubmit={newFileSubmit} method="post">
                            <input className="my-1" type="text" placeholder="Opis" ref={caption_input} required />
                            <input className="my-2" type="file" ref={file_input} onChange={onFileChosen} required />
                            <input className="btn btn-secondary" ref={file_submit} type="submit" value="Prześlij" />
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Files;