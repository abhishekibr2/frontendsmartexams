import ExportQuestion from '@/components/Admin/ExportQuestion'
import React from 'react'

export default function Page() {
    return (
        <ExportQuestion params={''} handleCancel={function (): void {
            throw new Error('Function not implemented.')
        }} />
    )
}
