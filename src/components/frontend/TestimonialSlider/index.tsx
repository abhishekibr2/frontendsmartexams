'use client';
import React, { useEffect, useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function TestimonialSlider({ testimonials }: any) {



    return (
        <section className="testimonial-part">
            <div className="container">
                <div className="text-center">
                    <h2 className="text-center title-secondary fw-medium fw-regular">
                        TESTIMONIALS
                    </h2>
                    <div className="max-box-center">
                        <Carousel autoPlay showStatus={false} infiniteLoop>
                            {testimonials?.length > 0 ? (
                                testimonials.map((item: any) => (
                                    <div className="testimonial-card" key={item._id}>
                                        <p>
                                            {item.description || 'No description provided.'}
                                        </p>
                                        <br />
                                        <p className="p-xl fw-semi-bold bottom-no-space">
                                            {item.name || 'Anonymous'}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="testimonial-card">
                                    <p>No testimonials available.</p>
                                </div>
                            )}
                        </Carousel>
                    </div>
                </div>
            </div>
        </section>
    );
}
