import React, { useEffect, useRef } from 'react';

export default function BlockScrolling({ children }) {
    const divRef = useRef();

    useEffect(() => {
        const ele = divRef.current;
        if (ele != null) {
            const cancel = e => e.preventDefault();
            ele.addEventListener("wheel", cancel, { passive: false });
            return () => ele.removeEventListener("wheel", cancel);
        }
    });

    return (
        <div ref={divRef} >
            {children}
        </div>
    );
}