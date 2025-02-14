import React from "react"
import TestInstruction from "@/components/Student/TestInstruction"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <TestInstruction testId={id} />
}
