import AuthContext from '@/contexts/AuthContext';
import { Question } from '@/lib/types';
import { Button, Card, FormInstance, Result } from 'antd';
import Link from 'next/link';
import React, { useContext } from 'react';

interface SaveQuestionProps {
    next: (index: number) => void;
    prev: () => void;
    form: FormInstance;
    questions: Question[];
    setQuestions: (question: Question[]) => void;
    defaultQuestionData?: any;
    setDefaultQuestionData: (questionData: Question[]) => void;
    setCurrent: (index: number) => void;
}

export default function SaveQuestions({
    next,
    prev,
    form,
    questions,
    setQuestions,
    defaultQuestionData,
    setDefaultQuestionData,
    setCurrent
}: SaveQuestionProps) {
    const { user } = useContext(AuthContext)
    const handleImportNewExcel = () => {
        form.resetFields()
        setQuestions([]);
        setDefaultQuestionData([]);
        setCurrent(0)
    };

    return (
        <Card>
            <Result
                status="success"
                title="Questions Saved Successfully!"
                subTitle="Your questions have been saved. You can now go to the question bank or import a new Excel file."
                extra={[
                    <Link href={`/${user?.roleId.roleName}/question`} key="question-bank">
                        <Button type="primary" >
                            Go to Question Bank
                        </Button>
                    </Link>,
                    <Button key="import-excel" onClick={handleImportNewExcel}>
                        Import New Excel
                    </Button>
                ]}
            />
        </Card>
    );
}
