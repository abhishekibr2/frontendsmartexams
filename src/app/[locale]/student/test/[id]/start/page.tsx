import React from "react"
import StartTest from "@/components/Student/StartTest"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <StartTest testId={id} />
}
