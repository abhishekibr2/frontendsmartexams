import ViewMessages from "@/components/Admin/ViewMessages"
import React from "react"
export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <ViewMessages id={id} />
}
