'use client'
import { useContext, useEffect, useState } from 'react';
import BuyPackageListing from '@/components/Student/BuyPackage'
import AuthContext from '@/contexts/AuthContext';
import { packageData } from '@/lib/types';
import { GetAllPackage } from '@/lib/commonApi';

export default function page() {
    const { user } = useContext(AuthContext);
    const [packages, setPackages] = useState<packageData[]>([]);

    const fetchSubmitPackageData = async () => {
        const response = await GetAllPackage();
        if (response) {
            setPackages(response.data);
        }
    };

    useEffect(() => {
        if (user) {
            fetchSubmitPackageData();
        }
    }, [user]);

    return (
        <>
            <BuyPackageListing getPackage={packages} />
        </>
    )
}
