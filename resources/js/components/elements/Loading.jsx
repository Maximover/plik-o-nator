import React from "react";

const Loading = (props) => {
    const display_class = props.show ? '' : 'd-none';
    return (
        <div className={`${display_class} loading-icon mt-2`}>
            <div className="server-rack size-loading">
                <div className="server-shelf"><div className="server-decoration"></div></div>
                <div className="server-shelf"><div className="server-decoration"></div></div>
                <div className="server-shelf"><div className="server-decoration"></div></div>
            </div>
            <div className="circling-file"><div className="file-section"/><div className="file-base"/></div>
            <div className="circling-file"><div className="file-section"/><div className="file-base"/></div>
            <div className="circling-file"><div className="file-section"/><div className="file-base"/></div>
        </div>
    );
};

export default Loading;