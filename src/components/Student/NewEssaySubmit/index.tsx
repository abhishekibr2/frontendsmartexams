'use client';
import { useContext, useEffect, useState } from 'react';
import { GetAllPackageEssay } from '@/lib/commonApi';
import { submitEssayDetails } from '@/lib/studentApi';
import AuthContext from '@/contexts/AuthContext';
import { Form, message, Select } from 'antd';
import { Package, PackageEssaySubmit, SubmitEssay } from '@/lib/types';
import ErrorHandler from '@/lib/ErrorHandler';
import { useRouter } from 'next/navigation';
const { Option } = Select;
import axios from 'axios'


export default function NewEssaySubmit() {
    const router = useRouter();
    const { user } = useContext(AuthContext);
    const [packages, setPackages] = useState<Package[]>([]);
    const [essays, setEssays] = useState<PackageEssaySubmit[]>([]);
    const [form] = Form.useForm();
    const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
    const [filteredEssays, setFilteredEssays] = useState<PackageEssaySubmit[]>([]);


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
        const response = await GetAllPackageEssay();
        if (response) {
            setEssays(response.data);
        }
    };

    useEffect(() => {
        if (user) {
            packageData();
            essayData();
        }
    }, [user])

    const handlePackageSelect = (packageId: string) => {
        console.log(packageId, 'packageId')
        setSelectedPackage(packageId);
        const filtered = essays.filter(
            (essay: PackageEssaySubmit) => essay.packageId === packageId
        );
        setFilteredEssays(filtered);
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
                router.push('/student/myEssay')
                setSelectedPackage(null);
                setFilteredEssays([]);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    return (
        <>
            <section className="dash-part bg-light-steel ">
                <div className="spac-dash">
                    <h2 className="top-title">
                        New Essay Submission
                    </h2>
                    <Form form={form} onFinish={onFinish} layout="vertical" size='large'>
                        <div className="card-dash mt-3">
                            <div className="row bottom-large-space">
                                <div className="col-sm-3">
                                    <p className="color-dark-gray p-md fw-medium mb-1">
                                        Select Package
                                    </p>
                                    {/* {packages.map((data) => (
                                                <Option key={data._id} value={data._id}>
                                                    {data.packageName}
                                                </Option>
                                            ))} */}
                                    <Form.Item name="packageId" rules={[{ required: true, message: 'Please Select Package' }]}>
                                        <Select placeholder="Select Package" style={{ width: '100%' }} onChange={(value) => handlePackageSelect(value)}
                                            value={selectedPackage || ''}>
                                            <Option value="">All</Option>
                                            {packages.map((pkg: Package, index) => (
                                                <Option key={index} value={pkg.id}>
                                                    {pkg.name}
                                                </Option>
                                            ))}




                                        </Select>
                                    </Form.Item>
                                </div>
                                <div className="col-sm-3">
                                    <p className="color-dark-gray p-md fw-medium mb-1">
                                        Select Essay Topic
                                    </p>
                                    <Form.Item name="packageEssayId" rules={[{ required: true, message: 'Please Select Essay' }]}>
                                        <Select placeholder="Select Essay" style={{ width: '100%' }}>
                                            {filteredEssays.map((essay) => (
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
