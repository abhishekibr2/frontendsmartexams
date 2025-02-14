import React from "react"
import TestReport from "@/components/TestReport"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <TestReport testAttemptId={id} />
}
