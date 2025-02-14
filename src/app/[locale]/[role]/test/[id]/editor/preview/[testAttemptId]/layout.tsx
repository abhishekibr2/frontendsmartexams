import React from 'react';
import { Layout } from 'antd';
import { DataProvider } from '@/contexts/DataContext';
import QuestionAttemptLayout from '@/components/QuestionAttemptLayout';
import { TestProvider } from '@/contexts/TestContext';

export default async function TestAttemptLayout({ children, params }: { children: React.ReactNode, params: Promise<{ testAttemptId: string }> }) {
    const testAttemptId = (await params).testAttemptId;
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
