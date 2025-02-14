import React from "react"
import EditTestIntro from "@/components/EditTestIntro"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <EditTestIntro testId={id} />
}
