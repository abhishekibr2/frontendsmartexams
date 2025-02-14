"use client";
import React from 'react'
import TableData from './TableData';
export default function Page() {

    return (
        <>
            <TableData fetchData={function (): void {
                throw new Error('Function not implemented.');
            }} />
        </>
    );
}
