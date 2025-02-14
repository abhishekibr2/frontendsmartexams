"use client"

import React from 'react'
import { Table } from 'antd'
import { ColumnType } from 'antd/es/table'

interface SimpleTableProps {
    columns: ColumnType<any>[],
    dataSource: any[],
    className: string;
}

export default function SimpleTable({ columns, dataSource, className }: SimpleTableProps) {
    return (
        <div className="simple-antd-wrapper">
            <Table columns={columns} dataSource={dataSource} className={className} bordered />
        </div>
    )
}
