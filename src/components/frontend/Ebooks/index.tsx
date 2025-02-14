'use client';
import React from 'react';

export default function ebooks() {
    return (
        <>
            <section className="dash-part bg-light-steel ">
                <div className="d-flex">
                    <div className="left-bar">left Manu</div>
                    <div className="ebook-bar">
                        <h2 className="color-dark-gray title-lg bottom-ultra-space fw-regular">
                            eBooks
                        </h2>
                        <div className="card-dash">
                            <div className="row">
                                <div className="col-lg-3 col-md-6">
                                    <p className="p-xxs color-dark-gray p-xs fw-medium mb-2">Grade</p>
                                    <select className="select-list">
                                        <option>5</option>
                                        <option>10</option>
                                        <option>20</option>
                                        <option>50</option>
                                        <option>100</option>
                                    </select>
                                </div>
                                <div className="col-lg-6 col-md-6 md-none" />
                                <div className="col-lg-3 col-md-6">
                                    <div className="mb-4 xs-none" />
                                    <select className="select-list">
                                        <option>Price: High To Low</option>
                                        <option>Price: High To Low</option>
                                        <option>Price: High To Low</option>
                                        <option>Price: High To Low</option>
                                        <option>Price: High To Low</option>
                                    </select>
                                </div>
                                <div className="col-sm-12 top-extra-space">
                                    <ul className="show-list bottom-ultra-space ">
                                        <li>Show</li>
                                        <li>
                                            <select>
                                                <option>10</option>
                                                <option>20</option>
                                                <option>50</option>
                                                <option>100</option>
                                                <option>150</option>
                                                <option>200</option>
                                                <option>300</option>
                                            </select>
                                        </li>
                                        <li>entries</li>
                                    </ul>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="book-card">
                                        <img
                                            src="/images/smart/book.png"
                                            alt="book"
                                            className="e-book bottom-ultra-space "
                                        />
                                        <p className="p-sm fw-medium color-dark-gray prise-number">
                                            $299.00 <span className="cut-prise">$299.00</span>
                                        </p>
                                        <button className="btn-primary">Download Full eBook</button>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="book-card">
                                        <img
                                            src="/images/smart/book2.png"
                                            alt="book2"
                                            className="e-book bottom-ultra-space "
                                        />
                                        <p className="p-sm fw-medium color-dark-gray prise-number">
                                            $299.00 <span className="cut-prise">$299.00</span>
                                        </p>
                                        <button className="btn-primary">Download Full eBook</button>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="book-card">
                                        <img
                                            src="/images/smart/book3.png"
                                            alt="book3"
                                            className="e-book bottom-ultra-space "
                                        />
                                        <p className="p-sm fw-medium color-dark-gray prise-number">
                                            $299.00 <span className="cut-prise">$299.00</span>
                                        </p>
                                        <button className="btn-primary">Download Full eBook</button>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-md-6">
                                    <div className="book-card">
                                        <img
                                            src="/images/smart/book4.png"
                                            alt="book4"
                                            className="e-book bottom-ultra-space "
                                        />
                                        <p className="p-sm fw-medium color-dark-gray prise-number">
                                            $299.00 <span className="cut-prise">$299.00</span>
                                        </p>
                                        <button className="btn-primary">Download Full eBook</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
