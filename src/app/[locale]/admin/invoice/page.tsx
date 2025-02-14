"use client"
import { useState, useEffect, useContext } from "react";
import InvoiceTemplate from "@/components/InvoiceTemplate";
import AuthContext from "@/contexts/AuthContext";
import { getSingleBrandDetails } from "@/lib/adminApi";

// Define the expected type for data
interface InvoiceData {
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

export default function Page() {
    const { user } = useContext(AuthContext);

    const [data, setData] = useState<InvoiceData | undefined>(undefined);

    useEffect(() => {
        if (user?._id) {
            getBrandData();
        }
    }, [user]);

    const getBrandData = async () => {
        const res = await getSingleBrandDetails({ userId: user?._id });
        setData(res.data); // Assuming `res.data` matches the InvoiceData type
    };

    return (
        <>
            {data && <InvoiceTemplate data={data} />}
        </>
    );
}
