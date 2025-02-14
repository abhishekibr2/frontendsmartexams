'use client';
import { Modal } from 'antd';
import TableData from './TableData';
import FormModal from './FormModal';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { getAllComplexity } from '@/lib/adminApi';
import { setComplexity } from '@/redux/reducers/complexityReducer';
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function AdminServices() {
    const dispatch = useAppDispatch();
    const complexity = useAppSelector((state) => state.complexityReducer.complexity);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    async function fetchData() {
        try {
            const res = await getAllComplexity();
            if (res.status === true) {
                dispatch(setComplexity(res.data));
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    }

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleUpdateService = async () => {
        await fetchData();
        setIsModalOpen(false);
    };

    return (
        <>
            <div className='serviceSection'>
                <>
                    <TableData
                        complexity={complexity}
                        setComplexity={setComplexity}
                        fetchData={fetchData}
                    />
                    <Modal
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={null}
                    >
                        <FormModal onEdit={handleUpdateService} onClose={handleCancel} complexity={complexity as any} authorName={''} />
                    </Modal>
                </>
            </div>
        </>
    );
}
