import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Button, Select, Space, Dropdown, Menu, List, message, Row, Col, Badge, Card, Typography, Upload, UploadProps, ColorPicker, Flex, Tooltip } from "antd";
import { CheckOutlined, CloseOutlined, PlusOutlined, EditOutlined, DeleteOutlined, FileTextOutlined, UploadOutlined } from "@ant-design/icons";
import { FaEdit } from "react-icons/fa";
import { CiShare1 } from "react-icons/ci";
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
// @ts-ignore
import tinycolor from "tinycolor2";
import { Feature, Package } from "@/lib/types";

const { Option } = Select;

interface PackageActionsProps {
    record: Package;
    handleDelete: (id: string) => void;
}

const PackageActions: React.FC<PackageActionsProps> = ({ record, handleDelete }) => {
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [features, setFeatures] = useState<Feature[]>([]); // List of features
    const [form] = Form.useForm();
    const [editingFeature, setEditingFeature] = useState<Feature | null>(null); // Track which feature is being edited
    const [formValues, setFormValues] = useState({
        price: record.packagePrice,
        compareAtPrice: record.compareAtPrice,
        tag: record.tag,
        packageColor: record.packageColor,
        features: '',
        availability: 'available',
    });

    // Sync form values with state on change
    const handleFormChange = (changedValues: any, allValues: any) => {
        setFormValues(allValues);
    };

    useEffect(() => {
        setFeatures(record.features);
        setFormValues({
            price: record.packagePrice,
            compareAtPrice: record.compareAtPrice,
            tag: record.tag,
            packageColor: record.packageColor,
            features: '',
            availability: 'available',
        })
    }, [record]);

    const showModal = () => {
        setIsModalVisible(true);
    };

    const handleAddFeature = async (values: { features: string; availability: "available" | "unavailable", packageColor: string, tag: string, price: string, compareAtPrice: string }) => {
        try {
            const { features, availability, packageColor, tag, price, compareAtPrice } = values;
            const featureArray = features.split("\n").map((features) => ({
                featureName: features.trim(),
                availability,
            }));

            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/packages/add-features/${record._id}`,
                {
                    features: featureArray,
                    packageColor: packageColor,
                    tag,
                    packagePrice: price,
                    compareAtPrice,
                }
            );

            if (response.status === 200) {
                setFeatures(response.data.data.features);
                form.resetFields();
                message.success(response.data.message);
            }
        } catch (error) {
            console.error("Error adding features:", error);
        }
    };

    const handleUpdateFeature = async (values: { availability: "available" | "unavailable"; features: string, packageColor: string, tag: string }) => {
        if (!editingFeature) return;

        try {
            const updatedFeature = { ...editingFeature, ...values, featureName: values.features.trim() };
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/packages/update-feature/${record._id}/${editingFeature._id}`,
                { featureId: editingFeature._id, updatedFeature, packageColor: values.packageColor, tag: values.tag }
            );

            if (response.status === 200) {
                const updatedFeatures = features.map((feature) =>
                    feature._id === editingFeature._id ? updatedFeature : feature
                );
                setFeatures(updatedFeatures);
                setEditingFeature(null);
                message.success(response.data.message);
                setTimeout(() => {
                    form.resetFields();
                }, 500);
            }
        } catch (error) {
            console.error("Error updating feature:", error);
        }
    };


    const handleDeleteFeature = async (featureId: string) => {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}/admin/packages/delete-feature/${record._id}/${featureId}`
            );

            if (response.status === 200) {
                const updatedFeatures = features.filter((feature) => feature._id !== featureId);
                setFeatures(updatedFeatures);
                message.success(response.data.message);
            }
        } catch (error) {
            console.error("Error deleting feature:", error);
        }
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        setEditingFeature(null);
    };

    const getGradient = (baseColor: string) => {
        const color = tinycolor(baseColor);
        const lighter = color.lighten(15).toString();
        const darker = color.darken(15).toString();
        return `linear-gradient(to right, ${lighter}, ${darker})`;
    };

    const menu = (
        <Menu>
            <Menu.Item key="test">
                <Link href={`${process.env["NEXT_PUBLIC_SITE_URL"]}/admin/test/create?packageId=${record._id}`}>
                    <Button type="default" icon={<EditOutlined />}>
                        Test Package
                    </Button>
                </Link>
            </Menu.Item>
            <Menu.Item key="edit">
                <Link href={`${process.env["NEXT_PUBLIC_SITE_URL"]}/admin/add-package?id=${record._id}`}>
                    <Button type="primary" icon={<FaEdit />}>
                        Edit Package
                    </Button>
                </Link>
            </Menu.Item>
            <Menu.Item key="view">
                <Link href={`${process.env["NEXT_PUBLIC_SITE_URL"]}/admin/testsInSidepackage?packageId=${record._id}`}>
                    <Button icon={<CiShare1 />}>
                        View Tests
                    </Button>
                </Link>
            </Menu.Item>
            <Menu.Item key="essay">
                <Link href={`${process.env["NEXT_PUBLIC_SITE_URL"]}/admin/essayPackage?packageId=${record._id}`}>
                    <Button icon={<FileTextOutlined />}>
                        Essay Package
                    </Button>
                </Link>
            </Menu.Item>
            <Menu.Item key="addFeature">
                <Button type="dashed" onClick={showModal}>
                    Add Features
                </Button>
            </Menu.Item>
            <Menu.Item key="delete">
                {/* @ts-ignore  */}
                <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete([record?._id])}>
                    Delete Package
                </Button>
            </Menu.Item>
        </Menu>
    );

    const getTransparentColor = (hex: string, opacity: number = 0.4) => {
        const color = tinycolor(hex || "#EAE3F8"); // Default color fallback
        return color.setAlpha(opacity).toRgbString(); // Convert to rgba format
    };

    return (
        <>
            <Flex align='center' justify='center' gap={'small'}>
                <Tooltip title="Test Package">
                    <Link href={`${process.env["NEXT_PUBLIC_SITE_URL"]}/admin/test/create?packageId=${record._id}`}>
                        <Button type="default" icon={<EditOutlined />} />
                    </Link>
                </Tooltip>

                <Tooltip title="Edit Package">
                    <Link href={`${process.env["NEXT_PUBLIC_SITE_URL"]}/admin/add-package?id=${record._id}`}>
                        <Button type="primary" icon={<FaEdit />} />
                    </Link>
                </Tooltip>

                <Tooltip title="View Tests">
                    <Link href={`${process.env["NEXT_PUBLIC_SITE_URL"]}/admin/testsInSidepackage?packageId=${record._id}`}>
                        <Button icon={<CiShare1 />} />
                    </Link>
                </Tooltip>

                <Tooltip title="Essay Package">
                    <Link href={`${process.env["NEXT_PUBLIC_SITE_URL"]}/admin/essayPackage?packageId=${record._id}`}>
                        <Button icon={<FileTextOutlined />} />
                    </Link>
                </Tooltip>

                <Tooltip title="Add Features">
                    <Button type="dashed" onClick={showModal} ><PlusOutlined /></Button>
                </Tooltip>

                <Tooltip title="Delete Package">
                    {/* @ts-ignore  */}
                    <Button danger icon={<DeleteOutlined />} onClick={() => handleDelete([record?._id])} />
                </Tooltip>
            </Flex>
            <Modal
                title={editingFeature ? "Update Feature" : "Add Package Features"}
                visible={isModalVisible}
                onCancel={handleCancel}
                footer={null}
                centered
                width={{
                    xs: '90%',
                    sm: '80%',
                    md: '70%',
                    lg: '60%',
                    xl: '50%',
                    xxl: '50%',
                }}
            >
                <Row justify={'center'} align='top'>
                    <Col span={15}>
                        <Form
                            form={form}
                            onFinish={editingFeature ? handleUpdateFeature : handleAddFeature}
                            layout="vertical"
                            initialValues={formValues}
                            onValuesChange={handleFormChange}
                        >
                            <Row gutter={24}>
                                <Col span={24}>
                                    <Form.Item
                                        label="Feature Names"
                                        name="features"
                                    >
                                        <Input.TextArea
                                            placeholder="Enter feature names, one per line"
                                            rows={4}
                                        />
                                    </Form.Item>
                                </Col>
                                <Col span={8}>
                                    <Form.Item
                                        label="Feature Availability"
                                        name="availability"
                                    >
                                        <Select placeholder="Select availability">
                                            <Option value="">Select availability</Option>
                                            <Option value="available">✅ Available</Option>
                                            <Option value="unavailable">❌ Unavailable</Option>
                                        </Select>
                                    </Form.Item>
                                </Col>
                                <Col span={10}>
                                    <Form.Item label='Tag' name={'tag'}>
                                        <Input placeholder="Popular" />
                                    </Form.Item>
                                </Col>
                                <Col span={6}>
                                    <Form.Item label='Tag Color' name={'packageColor'}>
                                        <ColorPicker
                                            onChangeComplete={(value) => {
                                                form.setFieldValue('packageColor', value.toHexString())
                                                setFormValues({ ...formValues, packageColor: value.toHexString() });
                                            }}
                                        />
                                    </Form.Item>
                                </Col>
                            </Row>

                            <Button type="primary" htmlType="submit" icon={<PlusOutlined />} block>
                                {editingFeature ? "Update Feature" : "Add Features"}
                            </Button>
                        </Form>

                        <List
                            style={{ marginTop: "20px", maxHeight: 500, overflowY: 'scroll' }}
                            bordered
                            dataSource={features}
                            renderItem={(item) => (
                                <List.Item
                                    actions={[
                                        <Button
                                            key="edit"
                                            type="primary"
                                            icon={<EditOutlined />}
                                            onClick={() => {
                                                setEditingFeature(item);
                                                form.setFieldsValue({ ...item, features: item.featureName });
                                                setIsModalVisible(true);
                                            }}
                                        >
                                            Edit
                                        </Button>,
                                        <Button
                                            key="delete"
                                            danger
                                            icon={<DeleteOutlined />}
                                            onClick={() => handleDeleteFeature(item._id)}
                                        >
                                            Delete
                                        </Button>,
                                    ]}
                                >
                                    <Space>
                                        {item.availability === "available" ? (
                                            <CheckOutlined style={{ color: "green" }} />
                                        ) : (
                                            <CloseOutlined style={{ color: "red" }} />
                                        )}
                                        {item.featureName}
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col span={9}>
                        <div style={{
                            maxWidth: 300
                        }}>
                            <Badge.Ribbon text={formValues.tag || 'Popular'} color={formValues.packageColor || 'purple'} >
                                <Card
                                    className="package-price-card"
                                    style={{
                                        background: getTransparentColor(formValues.packageColor, 0.1),
                                        transition: "background 0.5s ease-in-out",
                                        borderRadius: '10px',
                                        boxShadow: '0px 8px 16px rgba(0, 0, 0, 0.12)',
                                        padding: '10px',
                                        width: '100%',
                                        margin: '20px',
                                        border: `1px solid ${formValues.packageColor || "#E5E5E5"}`,
                                        maxWidth: 300,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minHeight: 650,
                                        maxHeight: 650,
                                    }}
                                >
                                    <div
                                        className="card-content"
                                        style={{
                                            textAlign: 'center',
                                            marginBottom: '20px',
                                        }}
                                    >
                                        <Typography.Title
                                            level={4}
                                            style={{
                                                marginTop: 0,
                                                marginBottom: '22px',
                                                fontWeight: '400',
                                                color: '#333',
                                                fontSize: '16px',
                                                textAlign: 'center',
                                                padding: 0
                                            }}
                                        >
                                            {record.state?.title} {record.examType?.examType}
                                        </Typography.Title>
                                        {
                                            record.packageImage ?
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_IMAGE_URL}/packageImage/original/${record.packageImage}`}
                                                    height={98}
                                                    width={123}
                                                    alt="Package Image"
                                                />
                                                :
                                                <Image
                                                    src={"/images/smart/fav-old.png"}
                                                    height={98}
                                                    width={123}
                                                    alt="Package Image"
                                                />
                                        }
                                    </div>

                                    <Typography.Title
                                        level={4}
                                        style={{
                                            margin: 0,
                                            fontWeight: '300',
                                            color: '#333',
                                            fontSize: '20px',
                                            textAlign: 'center',
                                            marginBottom: 20
                                        }}
                                    >
                                        {record.packageName}
                                    </Typography.Title>

                                    <div style={{ fontSize: '26px', textAlign: 'center', color: `${formValues.packageColor || "#E5E5E5"}` }}>
                                        ${parseFloat(record.packageDiscountPrice) || 0}
                                        <span style={{ color: '#999', textDecoration: 'line-through', marginLeft: '10px' }}>
                                            ${parseFloat(record.packagePrice).toFixed(2)}
                                        </span>
                                    </div>
                                    <div
                                        style={{
                                            fontWeight: '300',
                                            color: '#999',
                                            fontSize: '14px',
                                            textAlign: 'center',
                                            marginBottom: 20
                                        }}
                                    >
                                        Valid for {record.packageDuration.DurationTime} days
                                    </div>
                                    <div
                                        className="scrollable-features-parant"
                                    >
                                        <ul

                                            className="scrollable-features"
                                        >
                                            {/* @ts-ignore  */}
                                            {record.features?.map((feature, featureIndex) => (
                                                <li
                                                    key={featureIndex}
                                                    style={{
                                                        marginBottom: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        fontSize: '13px',
                                                    }}
                                                >
                                                    {
                                                        feature.availability === 'unavailable' ? (
                                                            <CloseOutlined
                                                                style={{
                                                                    color: 'red',
                                                                    marginRight: '8px',
                                                                    fontSize: '13px',
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        ) : (
                                                            <CheckOutlined
                                                                style={{
                                                                    color: formValues.packageColor,
                                                                    marginRight: '8px',
                                                                    fontSize: '13px',
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        )
                                                    }
                                                    {feature.featureName}
                                                </li>
                                            ))}
                                            {formValues.features
                                                && formValues.features.split("\n").map((feature, index) => (
                                                    <li key={index} style={{ fontSize: '13px' }}>
                                                        {formValues.availability === "available" ? (
                                                            <CheckOutlined
                                                                style={{
                                                                    color: formValues.packageColor,
                                                                    marginRight: '8px',
                                                                    fontSize: '13px',
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        ) : (
                                                            <CloseOutlined
                                                                style={{
                                                                    color: 'red',
                                                                    marginRight: '8px',
                                                                    fontSize: '13px',
                                                                    fontWeight: 600
                                                                }}
                                                            />
                                                        )}
                                                        {feature.trim()}
                                                    </li>
                                                ))}
                                        </ul>
                                    </div>

                                    <Button
                                        type="primary"
                                        block
                                        size="large"
                                        style={{
                                            borderRadius: '8px',
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase',
                                            fontSize: '16px',
                                            marginTop: 'auto',
                                            backgroundImage: getGradient(formValues.packageColor),
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </Card>
                            </Badge.Ribbon>
                        </div>
                    </Col>
                </Row>
            </Modal>
        </>
    );
};

export default PackageActions;
