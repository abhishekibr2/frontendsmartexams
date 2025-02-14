import React from "react"
import ReorderQuestion from "@/components/ReorderQuestion"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <ReorderQuestion testId={id} />
}
