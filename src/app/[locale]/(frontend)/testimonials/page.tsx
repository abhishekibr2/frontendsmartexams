import TestimonialSlider from '@/components/frontend/TestimonialSlider'
import React from 'react'
import { getTestimonial } from '@/lib/frontendApi'

export default async function Page() {
    const testimonialData = await getTestimonial();
    return (
        <div>
            <TestimonialSlider testimonials={testimonialData.data} />
        </div>
    )

}
