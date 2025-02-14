import React from "react"
import PreviewQuestion from "@/components/PreviewQuestion"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <PreviewQuestion testId={id} />
}
