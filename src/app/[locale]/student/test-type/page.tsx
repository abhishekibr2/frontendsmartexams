import Link from 'next/link'
import React from 'react'

export default function page() {
    return (
        <>
            <section className="dash-part bg-light-steel ">
                <h2 className="top-title">
                    Test Name: Seal Test
                </h2>

                <div className="card-dash mt-3 bottom-extra-space max-card-width">
                    <div className="top-max-space xs-top-sace-none">
                        <div className="row">
                            <div className="col-sm-6">
                                <p className="color-dark-gray p-md fw-medium mb-1 ">
                                    Test Name: Seal Test
                                </p>
                                <select className="select-list select-font-sm">
                                    <option>Please Select</option>
                                    <option>Exam Mode</option>
                                    <option>Tutor Mode</option>
                                </select>
                            </div>
                            <div className="col-sm-6">
                                <p className="color-dark-gray p-md fw-medium mb-1 ">Timer</p>
                                <select className="select-list select-font-sm">
                                    <option>Please Select</option>
                                    <option>Timed Exam</option>
                                    <option>Untimed Exam</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="text-center ">
                        <Link href='/student/test-start'>
                            <button className="btn-primary fix-content-width btn-spac-lg bg-fresh-green opacity   mt-3">
                                Start Exam
                            </button>
                        </Link>
                    </div>
                    <div className='top-max-space'></div>
                </div>
            </section>

        </>
    )
}
