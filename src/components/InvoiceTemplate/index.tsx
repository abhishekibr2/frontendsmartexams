import ParaText from "@/app/commonUl/ParaText";
import { Button, Col, Row, Spin, Table, Typography } from "antd";
import { Content } from "antd/es/layout/layout";
import Titles from '@/app/commonUl/Titles';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { getReceipt } from "@/lib/adminApi";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/adminApi"
import ErrorHandler from "@/lib/ErrorHandler";
import "./style.css"
import ResponsiveTable from "@/commonUI/ResponsiveTable";


interface user {
    _id: string,
    name: string,
    email: string,
    phone: string,
    address: string
}

interface invoiceData {
    brandName: string;
    address: string;
    email: string;
    phone: number;
    website: string;
    unitPrice: number;
    quantity: number;
    _id: string,
    user: string,
    invoiceNumber: string,
    totalAmount: number,
    items: [
        {
            description: string,
            quantity: number,
            unitPrice: number
        }
    ],
    createdAt: Date
}

interface filterData {
    startDate: string | null;
    endDate: string | null;
    userId: string | null;
    dueDate: string;
    createdAt: string;
    amount: number;
    _id: string;

}
interface InvoiceTemplateProps {
    data: invoiceData;
}


export default function InvoiceTemplate({ data }: InvoiceTemplateProps) {
    const { Title, Text } = Typography;
    const [receiptData, setReceiptData] = useState<invoiceData | null>(null);
    const [user, setUser] = useState<user | null>(null);
    const [filteredReceipts, setFilteredReceipts] = useState<filterData | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {

        getReceiptData()

    }, []);

    const getReceiptData = async () => {
        const res = await getReceipt();
        setReceiptData(res.data);
        const user = await getAllUsers();
        setLoading(false)

    }

    const dataSource = [
        {
            key: '1',
            description: 'Item 1',
            quantity: 2,
            unitPrice: 55,
        },

    ];

    const columns = [
        {
            title: 'Item Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
        },
        {
            title: 'Unit Price',
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            render: (text: string) => `$${text}`
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (text: string, record: invoiceData) => `$${record.unitPrice * record.quantity}`,
        },
    ];
    const saveAsPDF = () => {
        const input = document.getElementById('invoice-content');
        if (!input) {
            return;
        }
        html2canvas(input)
            .then((canvas) => {
                const pdf = new jsPDF();
                const imgData = canvas.toDataURL();
                pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight()); // Adjusted arguments to fit the entire page
                pdf.save('invoice.pdf');
            });
    };

    const handlePrint = () => {
        const input = document.getElementById('invoice-content');
        if (!input) {
            return;
        }
        html2canvas(input)
            .then((canvas) => {
                const pdf = new jsPDF();
                const imgData = canvas.toDataURL('image/png');
                pdf.addImage(imgData, 'PNG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
                const pdfBlob = pdf.output('blob');
                const pdfUrl = URL.createObjectURL(pdfBlob);

                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = pdfUrl;

                iframe.onload = () => {
                    if (iframe.contentWindow) {
                        iframe.contentWindow.print();
                    }
                };

                document.body.appendChild(iframe);
            })
            .catch((error) => {
                ErrorHandler.showNotification(error);
            });
    };

    const calculateSubtotal = () => {
        return dataSource.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
    };

    const date = new Date(filteredReceipts?.dueDate ?? '');
    const formattedDate = date.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    }).replace(/ /g, '-');
    const DateFormate = filteredReceipts?.createdAt ? new Date(filteredReceipts.createdAt) : new Date();
    const createdDateFormate = DateFormate.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
    }).replace(/ /g, '-');



    return (

        <>
            {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin style={{ marginTop: '-20vh' }} />
            </div>
                :
                <div id="invoice-content">
                    <Row justify="center">
                        <Col xs={24} sm={20} md={18} lg={16} xl={14}>
                            <div>
                                <Content style={{ marginTop: '16px' }}>
                                    <Row>
                                        <Col xs={24} sm={24} md={24} xl={18}>
                                            <ParaText size="large" fontWeightBold={600} color="PrimaryColor">Invoice: #12540</ParaText>
                                        </Col>
                                        <Col xs={24} sm={24} md={24} xl={6} className="buts">
                                            <Button style={{ background: "#23b7e5", color: "white", marginRight: "10px" }} onClick={handlePrint}>Print</Button>
                                            <Button style={{ background: "#845adf", color: "#ffff" }} onClick={saveAsPDF}>Save As PDF</Button>
                                        </Col>
                                    </Row>



                                    <div className="largeTopMargin"></div>
                                    <Row gutter={16}>
                                        <Col span={12}>
                                            <ParaText size="large">Billing From:</ParaText>
                                            <Titles level={5}>{data?.brandName}</Titles>
                                            <ParaText size="extraSmall">{data?.address}</ParaText><br />
                                            <ParaText size="extraSmall">{data?.email}</ParaText><br />
                                            <ParaText size="extraSmall">{data?.phone}</ParaText><br />
                                            <ParaText size="extraSmall">{data?.website}</ParaText>
                                        </Col>
                                        <Col span={12} style={{ textAlign: 'right' }}>
                                            <ParaText size="large">Billing To:</ParaText>
                                            <Titles level={5}>{user?.name}</Titles>
                                            <ParaText size="extraSmall">Clients Company Name</ParaText><br />
                                            <ParaText size="extraSmall">Clients Address</ParaText><br />
                                            <ParaText size="extraSmall">City, State, ZIP Code</ParaText><br />
                                            <ParaText size="extraSmall">{user?.email}</ParaText>
                                        </Col>
                                    </Row>

                                    <Row gutter={16} style={{ marginTop: '16px' }}>

                                        <Col span={6}>
                                            <ParaText size="extraSmall" fontWeightBold={600} >Invoice Number:</ParaText><br />
                                            <ParaText size="small"> {filteredReceipts?._id?.slice(0, 10)}</ParaText><br />
                                        </Col>
                                        <Col span={6}>
                                            <ParaText size="extraSmall" fontWeightBold={600}>Invoice Date:</ParaText><br />
                                            <ParaText size="small"> {createdDateFormate}</ParaText>
                                        </Col>
                                        <Col span={6}>
                                            <ParaText size="extraSmall" fontWeightBold={600}>Due Date:</ParaText><br />
                                            <ParaText size="small">{formattedDate}</ParaText>
                                        </Col>
                                        <Col span={6}>
                                            <ParaText size="extraSmall" fontWeightBold={600}>Due Amount:</ParaText><br />
                                            <ParaText size="small" fontWeightBold={700} color="black">${filteredReceipts?.amount}</ParaText><br />
                                        </Col>

                                    </Row>

                                    <ResponsiveTable
                                        data={dataSource}
                                        columns={columns} GetSelectedId={undefined} />

                                    <Row style={{ marginTop: '16px', textAlign: 'right' }}>
                                        <Col span={24}>
                                            <Title level={4}>SubTotal:  ${calculateSubtotal().toFixed(2)}</Title>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: '16px' }}>
                                        <Col span={24}>
                                            <Title level={4}>Payment Terms:</Title>
                                            <Text>Net 30 days</Text><br />
                                            <Text>Bank Transfer Details/PayPal</Text>
                                        </Col>
                                    </Row>

                                    <Row style={{ marginTop: '16px' }}>
                                        <Col span={24}>
                                            <Text>Notes:</Text><br />
                                            <Text>Additional notes or instructions</Text>
                                        </Col>
                                    </Row>
                                </Content>
                            </div>
                        </Col>
                    </Row>
                </div>
            }
        </>
    )
}
