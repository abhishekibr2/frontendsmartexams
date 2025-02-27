import React from "react"
import ViewAnswer from "@/components/TestReport/ViewAnswer"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <ViewAnswer testAttemptId={id} />
}
