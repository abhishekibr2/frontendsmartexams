import React from "react"
import ReuseQuestion from "@/components/ReuseQuestion"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <ReuseQuestion testId={id} />
}
