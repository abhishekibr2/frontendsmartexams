import React from 'react';
import { Table } from 'antd';
import TimeZoneDisplay from '@/app/commonUl/TimeZoneDisplay';
import FormateLastSeen from '@/app/commonUl/FormateLastSeen';

const { Column } = Table;

interface DataType {
	key: React.Key;
	authorName: string;
	timeZone: any;
}

interface Props {
	allUsers?: any;
}

export default function BlogListingTable({ allUsers }: Props) {

	const data: DataType[] = Array.isArray(allUsers)
		? allUsers.map((user: any, index: any) => ({
			key: index.toString(),
			authorName: user.name || 'Unknown Author',
			timeZoneName: user.timeZone || 'Unknown Timezone',
			timeZone: (<TimeZoneDisplay userTimeZone={user.timeZone} />),
			LastSeen: (<FormateLastSeen userLastSeen={user.lastSeen} />),
		}))
		: [];

	return (
		<>
			<div>
				<Table dataSource={data}>
					<Column title="Author" dataIndex="authorName" key="authorName" />
					<Column title="Timezone" dataIndex="timeZoneName" key="timeZoneName" />
					<Column title="Date & Time" dataIndex="timeZone" key="timeZone" />
					<Column title="Last Seen" dataIndex="lastSeen" key="lastSeen" />
				</Table>
			</div>
		</>
	);
}
