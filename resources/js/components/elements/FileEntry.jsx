import React from "react";

const FileEntry = (props) => {
    const el = props.entry;
    return (
        <div className="file-entry">
            <span className={el.id===-1 ? 'text-darkened' : 'dropdown-toggle'}>
                {el.caption}
            </span>
            <div></div>
            <img src={DOWNLOAD_ICON_IMAGE} className="download-icon" onClick={()=>{console.log(`downloading ${el.caption}...`)}}/>
        </div>
    );
};

export default FileEntry;