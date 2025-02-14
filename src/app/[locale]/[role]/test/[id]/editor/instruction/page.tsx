import React from "react"
import PreviewTest from "@/components/AllTests/PreviewTest"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <PreviewTest testId={id} />
}
