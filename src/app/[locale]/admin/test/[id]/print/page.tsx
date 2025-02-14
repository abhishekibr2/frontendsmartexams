import React from "react"
import PrintTest from "@/components/PrintTest"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <PrintTest testId={id} />
}
