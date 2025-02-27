'use client'
import { Layout, theme } from 'antd';
import React from 'react'

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const {
        token: { colorBgContainer, borderRadiusLG }
    } = theme.useToken();
    return (
        <Layout.Content
            style={{
                padding: 24,
                margin: 0,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
                marginBottom: 24,
                marginTop: 0,
            }}
        >
            {children}
        </Layout.Content>
    )
}
