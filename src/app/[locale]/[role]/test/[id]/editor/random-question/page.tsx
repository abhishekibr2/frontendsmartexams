import React from "react"
import RandomQuestion from "@/components/RandomQuestion"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <RandomQuestion testId={id} />
}
