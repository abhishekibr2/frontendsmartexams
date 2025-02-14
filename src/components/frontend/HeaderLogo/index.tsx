import { getBrandDetails } from '@/lib/frontendApi';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { Image } from 'antd';

export default function HeaderLogo() {
    const [brandMenu, setBrandMenu]: any = useState([]);

    const fetchBrandMenuItems = async () => {
        try {
            const response = await getBrandDetails();
            setBrandMenu(response.data);
        } catch (error) {
            console.error('Error fetching header menus:', error);
        }
    };
    useEffect(() => {
        fetchBrandMenuItems();
    }, []);
    return (
        <>
            <header className="form-header">
                <div className="container">
                    <Link href="/">
                        <Image
                            // alt={`${item.brandName} logo`}
                            alt=''
                            src={`${process.env['NEXT_PUBLIC_IMAGE_URL']}/brandImage/original/${brandMenu?.logo}`}

                            preview={false}
                            width={200}
                            className="black-logo"
                        />
                    </Link>
                </div>
            </header>
        </>
    )
}
