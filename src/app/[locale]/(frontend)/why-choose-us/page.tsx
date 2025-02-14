'use client';
import React, { useEffect, useState } from 'react';
import WhyChooseUs from '@/components/frontend/WhyChooseUs';
import { getSectionData, getWhyChooseUsTestimonials } from '@/lib/frontendApi';
import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import './style.css';

export default function Page() {
    const [data, setData] = useState<any>([]);
    const [testimonialData, setTestimonialData]: any = useState([]);

    const getDataHandler = async () => {
        const response = await getSectionData();
        setData(response.data);

    }
    //
    useEffect(() => {
        getDataHandler();
        fetchTestimonials();

    }, []);


    const fetchTestimonials = async () => {
        try {
            const response = await getWhyChooseUsTestimonials();
            setTestimonialData(response.data);
        } catch (error) {
            console.error('Error fetching testimonials:', error);
        }
    };
    return (
        <>
            <WhyChooseUs data={data} />
            <section className="testimonial-part">
                <div className="container">
                    <div className="text-center">
                        <h2 className="text-center title-secondary fw-medium fw-regular">
                            TESTIMONIALS
                        </h2>
                        <div className="max-box-center">
                            <Carousel autoPlay showStatus={false} infiniteLoop>
                                {testimonialData?.length > 0 ? (
                                    testimonialData.map((item: any) => (
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
            </section>        </>
    )
}
