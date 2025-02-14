"use client"
import React, { useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import FormModal from './FormModal';
import { getDataTermsAndCondition } from '@/lib/adminApi';
import TableData from './TableData';

function Page() {
    return (
        <>
            <TableData />
        </>
    );
}

export default Page;
