import React from "react"
import TestReport from "@/components/TestReport"

export default async function Page({
    params,
}: {
    params: Promise<{ testAttemptId: string }>
}) {
    const testAttemptId = (await params).testAttemptId
    return <TestReport testAttemptId={testAttemptId} />
}
