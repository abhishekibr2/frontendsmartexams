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
            className="top-title m-0"
            style={{
                fontWeight: 400,
            }}>
            {title}
        </Typography.Title>
    )
}
