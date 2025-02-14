'use client';
import { Modal } from 'antd';
import TableData from './TableData';
import FormModal from './FormModal';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { getAllExamType } from '@/lib/adminApi';
import { setExamType } from '@/redux/reducers/examReducer';
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function AdminServices() {
    const dispatch = useAppDispatch();
    const examTypes = useAppSelector((state) => state.examTypeReducer.examTypes);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    async function fetchData() {
        try {
            const res = await getAllExamType();
            if (res.status === true) {
                dispatch(setExamType(res.data));
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
                        examTypes={examTypes}
                        setExamType={setExamType}
                        fetchData={fetchData}
                    />
                    <Modal
                        title="Add New State"
                        open={isModalOpen}
                        onOk={handleOk}
                        onCancel={handleCancel}
                        footer={null}
                    >
                        <FormModal onEdit={handleUpdateService} onClose={handleCancel} examType={examTypes as any} authorName={''} />
                    </Modal>
                </>
            </div>
        </>
    );
}
