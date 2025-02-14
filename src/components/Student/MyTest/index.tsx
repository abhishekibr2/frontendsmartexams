'use client'
import React, { useContext, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from 'antd'
import { Package } from '@/lib/types'
import axios from 'axios'
import AuthContext from '@/contexts/AuthContext'

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
                    My Test
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
                                                                <table className="rwd-table text-center SubmittedTable shadow-sm">
                                                                    <tbody className="table-dash-student">
                                                                        <tr>
                                                                            <th className="width-100-dask">ID</th>
                                                                            <th>Subject</th>
                                                                            <th>Test Name</th>
                                                                            <th>Questions</th>
                                                                            <th>Time</th>
                                                                            <th>Status</th>
                                                                            <th className="action-width">Action</th>
                                                                        </tr>
                                                                        {packageData?.packageId.tests?.length > 0 ? (
                                                                            packageData.packageId.tests.map((test: any, index: number) => {
                                                                                return (
                                                                                    test && (
                                                                                        <tr key={test._id || index}>
                                                                                            <td data-th="#">{index + 1 || 'N/A'}</td>
                                                                                            <td data-th="Subject">{test.subject?.subjectName || 'N/A'}</td>
                                                                                            <td data-th="Test Name">{test?.testDisplayName || 'N/A'}</td>
                                                                                            <td data-th="Questions">{test.questions?.length || 0}</td>
                                                                                            <td data-th="Time">{test?.duration || 'N/A'}</td>
                                                                                            <td data-th="Status">{test?.status || 'N/A'}</td>
                                                                                            <td data-th="Action">
                                                                                                <Link href={`/student/test/${test._id}`}>
                                                                                                    <Button>
                                                                                                        <i className="fa-solid fa-arrow-right" />
                                                                                                    </Button>
                                                                                                </Link>
                                                                                            </td>
                                                                                        </tr>
                                                                                    )
                                                                                );
                                                                            })
                                                                        ) : (
                                                                            <tr>
                                                                                <td colSpan={7}>No tests available</td>
                                                                            </tr>
                                                                        )}
                                                                    </tbody>
                                                                </table>
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
                                                <table className="rwd-table text-center SubmittedTable shadow-sm">
                                                    <tbody className="table-dash-student">
                                                        <tr>
                                                            <th className="width-100-dask">ID</th>
                                                            <th>Subject</th>
                                                            <th>Test Name</th>
                                                            <th>Questions</th>
                                                            <th>Time</th>
                                                            <th>Status</th>
                                                            <th className="action-width">Action</th>
                                                        </tr>
                                                        {item.tests?.length > 0 ? (
                                                            item.tests.map((test: any, index: number) => (
                                                                test && (
                                                                    <tr key={test._id}>
                                                                        <td data-th="#">{index + 1}</td>
                                                                        <td data-th="Subject">{test.subject?.subjectName || 'N/A'}</td>
                                                                        <td data-th="Test Name">{test.testDisplayName || 'N/A'}</td>
                                                                        <td data-th="Questions">{test.questions?.length || 0}</td>
                                                                        <td data-th="Time">{test.duration || 'N/A'}</td>
                                                                        <td data-th="Status">{test.status || 'N/A'}</td>
                                                                        <td data-th="Action">
                                                                            <Link href={`/student/test/${test._id}`}>
                                                                                <Button>
                                                                                    <i className="fa-solid fa-arrow-right" />
                                                                                </Button>
                                                                            </Link>
                                                                        </td>
                                                                    </tr>
                                                                )
                                                            ))
                                                        ) : (
                                                            <tr>
                                                                <td colSpan={7}>No tests available</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
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

