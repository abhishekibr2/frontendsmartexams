'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from 'antd'
import { Package } from '@/lib/types'
import axios from 'axios'
import AuthContext from '@/contexts/AuthContext'
import TestTable from './TestTable'
import FreeTestTable from './FreeTestTable'

export default function MyTest() {
    const { user } = useContext(AuthContext)
    const [freePackages, setFreePackages] = useState<Package[]>([]);
    const [buyPackages, setBuyPackages] = useState<Package[]>([]);

    const getFreePackage = async () => {
        const response = await axios.get('/student/package/free');
        const packages = response.data.data;
        setFreePackages(packages);
    }

    useEffect(() => {
        getFreePackage();
        if (user?._id) {
            getBuyPackages()
        }
    }, [user?._id])

    const getBuyPackages = async () => {
        try {
            const res = await axios.get('/student/package/allPackages', {
                params: { userId: user?._id },
            });
            console.log(res.data.data, 'res.data.data')
            setBuyPackages(res.data.data)
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error)
        }
    }

    return (
        <section className="dash-part bg-light-steel ">
            <div className="spac-dash">
                <h2 className="top-title mb-3">
                    My Tests
                </h2>
                <div className="card-dash">
                    <p className="color-dark-gray p-xl fw-medium mb-2">
                        {buyPackages.length > 0 ? 'Your Purchased Tests' : 'No Test available'}
                    </p>
                    <div className="accordion accordion-part" id="accordionExample">
                        {buyPackages.map((item: Package) => {
                            return (
                                <div className="accordion-item" key={item._id}>
                                    {
                                        item.orderSummary.package.map((packageData: Package, index: number) => {
                                            return (
                                                <div key={index}>
                                                    <h2 className="accordion-header" id={`heading-${item._id}`}>
                                                        <button
                                                            className="accordion-button collapsed"
                                                            type="button"
                                                            data-bs-toggle="collapse"
                                                            data-bs-target={`#collapse-${item._id}`}
                                                            aria-expanded="true"
                                                            aria-controls={`collapse-${item._id}`}
                                                        >
                                                            {packageData?.packageName}
                                                        </button>
                                                    </h2>
                                                    <div
                                                        id={`collapse-${item._id}`}
                                                        className="accordion-collapse collapse"
                                                        aria-labelledby={`heading-${item._id}`}
                                                        data-bs-parent="#accordionExample"
                                                    >
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                                                            <div style={{ flex: 1, textAlign: 'right' }}>
                                                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#555' }}>
                                                                    Package Purchase Date: {new Date(item.createdAt).toLocaleDateString('en-GB', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                    })}
                                                                </p>
                                                                <p style={{ margin: 0, fontSize: '14px', fontWeight: '900', color: '#555' }}>
                                                                    Package Expiry Date: {new Date(packageData?.packageValidity?.calculatedTime).toLocaleDateString('en-GB', {
                                                                        day: 'numeric',
                                                                        month: 'short',
                                                                        year: 'numeric',
                                                                    })}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="accordion-body">
                                                            <div className="accordion accordion-part" id="accordionExample">
                                                                <TestTable packageData={packageData} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            );
                        })}

                        {/* here start free packages code  */}
                        <p className="color-dark-gray p-xl fw-medium mb-2  mt-4 ">
                            {freePackages.length > 0 ? 'Free Practice Tests' : 'No Practice Test available'}
                        </p>
                        <div className="accordion accordion-part" id="accordionExample">
                            {freePackages.map((item: Package) => (
                                <div className="accordion-item" key={`free-package-${item._id}`}>
                                    <h2 className="accordion-header" id={`heading-${item._id}`}>
                                        <button
                                            className="accordion-button collapsed"
                                            type="button"
                                            data-bs-toggle="collapse"
                                            data-bs-target={`#free-package-${item._id}`}
                                            aria-expanded="true"
                                            aria-controls={`free-package-${item._id}`}
                                        >
                                            {item.packageName}
                                        </button>
                                    </h2>
                                    <div
                                        id={`free-package-${item._id}`}
                                        className="accordion-collapse collapse"
                                        aria-labelledby={`heading-${item._id}`}
                                        data-bs-parent="#accordionExample"
                                    >
                                        <div className="accordion-body">
                                            <div className="accordion accordion-part" id="accordionExample">
                                                <FreeTestTable packageData={item} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* here End free packages code */}
                    </div>
                </div>
            </div>
        </section>
    )
}

