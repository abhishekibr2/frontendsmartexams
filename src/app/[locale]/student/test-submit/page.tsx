import Link from 'next/link'
import React from 'react'

export default function page() {
    return (
        <>
            <section className="dash-part bg-light-steel ">
                <p className="top-title"> Report a Problem with this Question </p>
                <div className="card-dash bottom-extra-space mt-3">
                    <div className="row">
                        <div className="col-sm-12 text-center">
                            <textarea
                                className="field-panel size-xxl mt-3 mb-2"
                                defaultValue={""}
                            />
                            <div>
                                <Link href='/student/test-result'>
                                    <button className="btn-primary fix-content-width btn-spac-lg bg-fresh-green opacity p-md mt-3 right-gap-15">
                                        Submit Comment
                                    </button>
                                </Link>
                                <button
                                    className="btn-primary fix-content-width btn-spac-lg bg-fresh-green opacity p-md mt-3"
                                    style={{ background: "#202020B2 !important" }}
                                >
                                    Cancel
                                </button>
                            </div>
                            <br />
                            <img src="/images/smart/logo.png" alt="logo" />
                            <br />
                            <br />
                            <p className="p-sm color-dark-gray  ">
                                Copyright © 2025 SmartExams All Rights Reserved.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
