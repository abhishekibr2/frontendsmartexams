import { Typography } from 'antd'
import React from 'react'

interface PageTitleProps {
    title: string;
}

export default function PageTitle({
    title,
}: PageTitleProps) {
    return (
        <Typography.Title
            level={2}
            className="top-title m-0 mb-2"
            style={{
                fontWeight: 400,
            }}>
            {title}
        </Typography.Title>
    )
}
