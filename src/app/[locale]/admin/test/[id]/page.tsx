import React from "react"
import EditTest from "@/components/EditTest"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <EditTest testId={id} />
}
