import { useState, useEffect, useContext } from 'react';
import { Form, Row, Col, Input, Select, Button, notification, Spin } from 'antd';
import { Package, PackageEssay } from '@/lib/types';
import { addUpdatePackageEssayDetails, GetAllPackages } from '@/lib/adminApi';
import ErrorHandler from '@/lib/ErrorHandler';
import AuthContext from '@/contexts/AuthContext';
import { useSearchParams } from 'next/navigation';

const { Option } = Select;

interface ServiceModalProps {
	onEdit: () => Promise<void>;
	selectedRecord: PackageEssay | null;
	setSelectedRecord: (record: PackageEssay | null) => void;
	packageName: any;
	packageId: any;
	packageEssay: PackageEssay[];

}

interface ServiceFormValues {
	packageId: string;
	essayName: string;
	essayType: string;
	duration: number;
	updateId: string;
}



export default function FormModal(props: ServiceModalProps) {
	const [form] = Form.useForm();
	const [updateId, setUpdateId] = useState<string>('');
	const { user } = useContext(AuthContext);
	const userId = user?._id;
	const id = useSearchParams();
	const ids = id.get('packageId');
	const [newPackages, setPackages] = useState<Package[]>([]);

	const [totalEssay, setTotalEssay] = useState<number>(0);

	useEffect(() => {
		packages();
		if (props.packageEssay) {
			setTotalEssay(props.packageEssay.length);
		}
	}, [props.packageEssay]);

	const packages = async () => {
		const response = await GetAllPackages();
		if (response) {
			setPackages(response.data);
		}
	};

	useEffect(() => {
		if (props.selectedRecord) {
			setUpdateId(props.selectedRecord?._id);
			const formattedEssayData = `${props.selectedRecord.essayName || ''} | ${props.selectedRecord.essayType || ''} | ${props.selectedRecord.duration || ''}`;
			form.setFieldsValue({
				// packageId: props.selectedRecord.packageId?._id,
				packageId: ids ? props.selectedRecord.packageId?.packageName : props.selectedRecord.packageId?._id,
				essayName: formattedEssayData,
			});
		} else {
			setUpdateId('');
			form.resetFields(['essayName', 'essayType', 'duration']);
		}
	}, [props.selectedRecord, form, props.packageEssay, props.packageId]);

	const onFinish = async (values: ServiceFormValues) => {
		try {
			const data = {
				essayName: values.essayName,
				createdBy: userId || null,
				updateId: updateId,
				packageId: ids || values.packageId,
			};

			const res = await addUpdatePackageEssayDetails(data);
			if (res.status === true) {
				props.onEdit();

				form.resetFields(['essayName', 'essayType', 'duration']);
				if (!ids) {
					form.resetFields(['packageId']);
				}
				props.setSelectedRecord(null);

				const action = updateId ? 'updated' : 'added';
				notification.success({ message: `Essay Package ${action} successfully`, duration: 4 });
			}
		} catch (error) {
			ErrorHandler.showNotification(error);
		}
	};


	useEffect(() => {
		if (props.packageName?.packageName) {
			form.setFieldsValue({ packageId: props.packageName.packageName });
		}
	}, [props.packageName, form]);

	return (
		<Form form={form} onFinish={onFinish} layout="vertical" initialValues={{ status: 'active' }} size='large'>
			<Row align="middle" gutter={[24, 24]}>
				<Col span={12}>
					<Form.Item
						label="Package Name"
						name="packageId"
						preserve={true}
						rules={[{ required: true, message: 'Please Select a Package' }]}
					>
						{ids ? (
							<Input
								value={form.getFieldValue('packageId') || ''}
								onChange={(e) => form.setFieldsValue({ packageId: e.target.value })}
								disabled
							/>
						) :
							(
								<Select
									placeholder="Select a package"
									onChange={(value) => form.setFieldsValue({ packageId: value })}
									style={{ width: '100%', height: '40px' }}
									value={form.getFieldValue('packageId') || undefined}
								>
									{newPackages.length > 0 ? (
										newPackages.map((pkg, index) => (
											<Option key={index} value={pkg._id}>
												{pkg.packageName}
											</Option>
										))
									) : (
										<Option value="" disabled>
											No packages available
										</Option>
									)}
								</Select>
							)}
					</Form.Item>
					<Form.Item label="Total Essay Added To Package">
						<Input placeholder="Total Essays" value={totalEssay} disabled />
					</Form.Item>

				</Col>

				<Col xl={12} sm={24}>
					<Form.Item
						label="Essay Name"
						name="essayName"
						rules={[
							{ required: true, message: 'Please enter essay name' },
							{
								validator: (_, value) => {
									if (!value) {
										return Promise.resolve(); // Agar input empty hai, toh required rule handle karega
									}

									// Essay Name length check
									const essayName = value.split('|')[0].trim(); // Extract essay name from input
									if (essayName.length > 120) {
										return Promise.reject(new Error('Essay Name should not exceed 120 characters.'));
									}

									// Essay Type length check (Extract essay type from input)
									const essayType = value.split('|')[1]?.trim(); // If essayType exists, get it
									if (essayType && essayType.length > 60) {
										return Promise.reject(new Error('Essay Type should not exceed 60 characters.'));
									}

									return Promise.resolve();
								},
							},
						]}
					>
						<Input.TextArea
							placeholder="Enter Essay in the format: essayName | essayType | duration"
							rows={4}
							style={{ minHeight: '135px' }}
						/>
					</Form.Item>


				</Col>

			</Row>
			<Row justify="end" gutter={[24, 24]}>
				<Col lg={4} md={2} sm={24} xs={24}>
					<Button
						htmlType="submit"
						style={{
							width: '100%',
							height: '42px',
							backgroundColor: '#52C479',
							color: "#fff",
							textAlign: 'center'
						}}
					>
						{updateId ? 'Update Essay Package' : 'Add To Package'}
					</Button>
				</Col>
				<Col lg={4} md={2} sm={24} xs={24}>
					<Button
						style={{
							width: '100%',
							height: '42px',
							backgroundColor: '#52C479',
							color: "#fff",
							textAlign: 'center'
						}}
						onClick={() => {
							form.resetFields(['essayName', 'essayType', 'duration', 'packageId']);
							setUpdateId('');
						}}
					>
						Reset
					</Button>
				</Col>
			</Row>


			<div className="gapMarginTopTwo"></div>
		</Form >
	);
}
