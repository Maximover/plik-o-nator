import React from "react";

const Alert = (props) => {
    const styles = `toast align-items-center text-bg-${props.config.type ?? "warning"} border-0`;
    
    return (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
            <div id="alert-el" className={styles} role="alert" aria-live="assertive" aria-atomic="true">
                <div className="d-flex">
                    <div className="toast-body"> {props.config.message ?? ""} </div>
                    <button type="button" className="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <button className="d-none" id='toast-trigger'></button>
            </div>
        </div>

    );
};

export default Alert;