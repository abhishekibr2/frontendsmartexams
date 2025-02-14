import React from "react"
import QuestionForm from "@/components/QuestionForm"

export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const id = (await params).id
    return <QuestionForm testId={id} />
}
