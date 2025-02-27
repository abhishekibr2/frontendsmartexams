'use client';
import { useContext, useEffect, useState } from 'react';
import { GetAllPackageEssay } from '@/lib/commonApi';
import { submitEssayDetails } from '@/lib/studentApi';
import AuthContext from '@/contexts/AuthContext';
import { Form, message, Select, Typography } from 'antd';
import { Package, PackageEssaySubmit, SubmitEssay } from '@/lib/types';
import ErrorHandler from '@/lib/ErrorHandler';
import { useRouter } from 'next/navigation';
const { Option } = Select;
import axios from 'axios'
import Link from 'next/link';
import { ArrowLeftOutlined } from '@ant-design/icons';


export default function NewEssaySubmit() {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const [packages, setPackages] = useState<Package[]>([]);
    const [essays, setEssays] = useState<PackageEssaySubmit[]>([]);
    const [form] = Form.useForm();
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [filteredEssayTypes, setFilteredEssayTypes] = useState<any[]>([]);
    const [filteredEssayNames, setFilteredEssayNames] = useState<any[]>([]);

    const packageData = async () => {
        const res = await axios.get('/student/package/allPackages', {
            params: { userId: user?._id },
        });
        const packagesArray = res.data.data;
        // Use flatMap to iterate over all items and get all package names
        const packageNames = packagesArray.flatMap((item: Package) =>
            item.orderSummary?.package?.map((pkg: Package) => ({
                id: pkg.packageId?._id,
                name: pkg.packageId?.packageName
            }))
        );
        setPackages(packageNames);
    }

    const essayData = async () => {
        try {
            const response = await GetAllPackageEssay({
                userId: user?._id as string,
                packageId: selectedPackage as string,
            });
            if (response) {
                setEssays(response.data);
                const uniqueEssayTypes = [...new Set(response.data.map((e: any) => e.essayType))];
                setFilteredEssayTypes(uniqueEssayTypes);
                form.setFieldsValue({ packageEssayId: null, essayType: null });
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    useEffect(() => {
        if (selectedPackage) {
            essayData()
        }
    }, [selectedPackage])

    useEffect(() => {
        if (user) {
            packageData();
        }
    }, [user])

    const handlePackageSelect = (packageId: string) => {
        setSelectedPackage(packageId);
        setFilteredEssayTypes([])
        setFilteredEssayNames([]);
    };

    const onFinish = async (values: SubmitEssay) => {
        try {
            const data = {
                packageId: values.packageId,
                packageEssayId: values.packageEssayId,
                description: values.description,
                userId: user?._id,
                createdBy: user?._id,
            };

            const res = await submitEssayDetails(data);
            if (res.status === true) {
                message.success(res.message);
                form.resetFields();
                router.push('/student/myEssay')
                setSelectedPackage(null);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const handleEssayTypeSelect = (value: any) => {
        const essayNames = essays.filter(e => e.essayType === value);
        setFilteredEssayNames(essayNames);
        form.setFieldsValue({ packageEssayId: null });
    };

    return (
        <>
            <section className="dash-part bg-light-steel ">
                <div className="spac-dash">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Link href={`/student/myEssay`}>
                            <ArrowLeftOutlined style={{ fontSize: '20px', cursor: 'pointer', marginRight: '10px' }} />
                        </Link>
                        <Typography.Title level={3} className='mb-0 top-title' style={{ marginBottom: 0 }}>
                            New Essay Submission
                        </Typography.Title>
                    </div>
                    <h2 className="top-title">

                    </h2>
                    <Form form={form} onFinish={onFinish} layout="vertical" >
                        <div className="card-dash mt-3">
                            <div className="row bottom-large-space">
                                <div className="col-sm-3">
                                    <p className="color-dark-gray p-md fw-medium mb-1">
                                        Select Package
                                    </p>
                                    <Form.Item name="packageId" rules={[{ required: true, message: "Please Select Package" }]}>
                                        <Select
                                            allowClear
                                            placeholder="Select Package"
                                            style={{ width: "100%" }}
                                            onChange={handlePackageSelect}
                                            value={selectedPackage || ""}
                                        >
                                            {packages.map((pkg: Package) => (
                                                <Option key={pkg.id} value={pkg.id}>
                                                    {pkg.name}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-sm-3">
                                    <p className="color-dark-gray p-md fw-medium mb-1">
                                        Select Essay Type
                                    </p>
                                    <Form.Item name={'essayType'} rules={[{ required: true, message: 'Please Select Essay' }]}>
                                        <Select
                                            allowClear
                                            placeholder="Select Essay Type"
                                            style={{ width: "100%" }}
                                            onChange={handleEssayTypeSelect}
                                        >
                                            {filteredEssayTypes.map((type) => (
                                                <Option key={type} value={type}>
                                                    {type}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-sm-3">
                                    <p className="color-dark-gray p-md fw-medium mb-1">
                                        Select Essay Name
                                    </p>
                                    <Form.Item name="packageEssayId" rules={[{ required: false }]}>
                                        <Select
                                            allowClear
                                            placeholder="Select Essay Name"
                                            style={{ width: "100%" }}
                                        >
                                            {filteredEssayNames.map((essay) => (
                                                <Option key={essay._id} value={essay._id}>
                                                    {essay.essayName}
                                                </Option>
                                            ))}
                                        </Select>
                                    </Form.Item>
                                </div>
                            </div>
                            <div className="form-panel ">
                                <p className="color-dark-gray p-lg fw-medium mb-2">Type Essay Here</p>
                                <Form.Item name="description" rules={[{ required: true, message: 'Please Enter EssayType' }]}>
                                    <textarea className="field-panel size-xxl" defaultValue={""} />
                                </Form.Item>

                                <button type='submit' className="btn-primary fix-content-width btn-spac top-ultra-space">
                                    Submit Essay
                                </button>
                            </div>
                        </div>
                    </Form>
                </div>
            </section>
        </>
    )
}
