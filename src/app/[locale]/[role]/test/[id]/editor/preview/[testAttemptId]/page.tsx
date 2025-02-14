import TestQuestion from '@/components/TestQuestion'
import React from 'react'

export default async function Page({
    params,
}: {
    params: Promise<{ id: string, testAttemptId: string, questionAttemptId: string }>
}) {
    const id = (await params).id
    const testAttemptId = (await params).testAttemptId
    const questionAttemptId = (await params).questionAttemptId
    return (
        <TestQuestion
            testAttemptId={testAttemptId}
        />
    )
}
