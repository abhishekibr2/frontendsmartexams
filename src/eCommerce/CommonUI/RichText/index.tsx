'use client'
import React from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

interface RichTextProps {
    value: string;
    onChange: (value: string) => void;
    height?: string; // Optional height
    width?: string;
}

export default function RichText({
    value,
    onChange,
    height,
    width
}: RichTextProps) {

    return <ReactQuill theme="snow" value={value} onChange={onChange} style={{ height, width, marginBottom: '30px' }} />;
}
