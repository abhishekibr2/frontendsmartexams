'use client'

import React, { useContext } from 'react'
import { Button, Col, Row, Typography } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import axios from 'axios';
import * as XLSX from 'xlsx'
import AuthContext from '@/contexts/AuthContext';

interface props {
    params: string;
    handleCancel: () => void
}
export default function ExportQuestion({ params, handleCancel }: props) {
    const { user } = useContext(AuthContext)
    const roleName = user?.roleId?.roleName;
    const downloadExcel = async () => {
        try {
            const response = await axios.get(`/${roleName}/question/data/export`, {
                params
            });

            const questions = response.data.questions;
            const headers = [
                "Question Type", "Question", "Choice A", "Choice B", "Choice C",
                "Choice D", "Choice E", "Choice F", "Answer", "Explanation",
                "Topic", "SubTopic",
            ];

            const excelData = questions.map((question: any) => {
                const questionTypeText = question.questionText ? (new DOMParser().parseFromString(question.questionText, 'text/html').body.textContent || '') : '';
                const row = [
                    question.questionType,
                    questionTypeText,
                ];
                let correctAnswer: any = '';

                question.questionOptions.forEach((option: any, index: number) => {
                    const choiceLabel = option.title || '';
                    row.push(choiceLabel);
                    if (option.isCorrect) {
                        const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
                        if (index >= 0 && index < labels.length) {
                            if (correctAnswer) {
                                correctAnswer += ', ' + labels[index];
                            } else {
                                correctAnswer = labels[index];
                            }
                        }
                    }
                });
                const correctAnswerText = correctAnswer || '';

                while (row.length < 8) {
                    row.push('');
                }
                row.push(correctAnswerText);
                row.push(question.explanation || '');
                row.push(question.topic || '');
                row.push(question.subTopic || '');

                return row;
            });
            const data = [headers, ...excelData];
            const ws = XLSX.utils.aoa_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Questions');
            const wBout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([wBout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'questions.xlsx';
            document.body.appendChild(a);
            a.click();

            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
            handleCancel();
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error('Error exporting questions:', error);
        }
    }
    return (
        <Row justify={'center'}>
            <Col xxl={24} xl={24} lg={24} >
                <Typography.Title level={5} className='mb-5'>
                    Download question in excel (Multiple-Choice, Multiple-Response Or True-False)
                </Typography.Title>
                <Typography.Text>
                    NOTE: Selected Questions Below Will Be Downloaded In An Excel File In The Folder
                </Typography.Text>
                <Button className='mt-2'>File Name:questions.xlsx</Button>
                <br />
                <Button className='mt-2' type="primary" icon={<DownloadOutlined />} onClick={downloadExcel}>Download</Button>
            </Col>
        </Row>
    )
}
