import React from 'react';
import { Layout } from 'antd';
import { DataProvider } from '@/contexts/DataContext';
import QuestionAttemptLayout from '@/components/QuestionAttemptLayout';
import { TestProvider } from '@/contexts/TestContext';
import { cookies } from 'next/headers';
import axios from 'axios';


export default async function TestAttemptLayout({ children, params }: { children: React.ReactNode, params: Promise<{ testAttemptId: string }> }) {
    const testAttemptId = (await params).testAttemptId;
    const response = await getData(testAttemptId);
    return (
        <div id='attempt-test-wrapper'>
            <DataProvider>
                <TestProvider>
                    <Layout
                        style={{
                            minHeight: '100vh',
                            backgroundColor: '#EAE9F1'
                        }}
                    >
                        <Layout>
                            <Layout>
                                <div className='right-bar'>
                                    <QuestionAttemptLayout
                                        params={params}
                                        testAttemptId={testAttemptId}
                                        response={response}
                                    >
                                        {children}
                                    </QuestionAttemptLayout>
                                </div>
                            </Layout>
                        </Layout>
                    </Layout>
                </TestProvider>
            </DataProvider>
        </div>
    );
}

async function getData(testAttemptId: string) {
    const cookieStore = cookies();
    const token = cookieStore.get('session_token')?.value;
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/student/testAttempt/${testAttemptId}`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${token}`
        },

    })
    return res.data
}
