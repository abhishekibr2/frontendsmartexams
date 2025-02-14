import SetupPracticeArea from "@/app/[locale]/admin/SetupPracticeArea"
import React from "react"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <SetupPracticeArea testId={id} />
}
