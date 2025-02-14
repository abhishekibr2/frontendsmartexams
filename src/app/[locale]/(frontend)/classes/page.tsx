import React from 'react'
import './style.css'
import Title from 'antd/es/skeleton/Title'
import ParaText from '@/app/commonUl/ParaText'
import Titles from '@/app/commonUl/Titles'
export default function page() {
    return (
        <div>
            <section className='hero-part digital-banner'>
                <div className='container'>
                    <div className='row align'>
                        <div className='col-sm-6'>
                            <h1 className='title-primary color-primary fw-regular'>Digital SAT Prep Classes</h1>
                            <p className='p-md fw-light color-primary'>
                                Take your digital SAT prep to the next level with our small-group classes. You ll learn key strategies and master content from an expert SAT tutor in an engaging online environment.
                            </p>
                            <a className="link-btn bg-secondary " href="/register">Start Your SAT Journey</a>
                        </div>
                        <div className='col-sm-6'>
                            <img src="images/digital-img-1.png" alt='digital-img-1' className='banner-img vert-move digital-img' />
                        </div>
                    </div>
                </div>
            </section>

            <section className='classes-part'>
                <div className='container'>
                    <h2 className='title-secondary text-center fw-regular color-neutral mt-3 mb-4'>English and Maths Classes
                    </h2>
                    <div className='row'>
                        <div className='col-lg-2 col-md-4'>
                            <a href="#englishClass1">
                                <div className="card-classes bg-7ddaff">
                                    <p className="p-sm color-dark">English Classes </p>
                                    <p className="p-sm color-dark">(Prep-Yr1)</p>
                                </div>
                            </a>
                        </div>
                        <div className='col-lg-2 col-md-4'>
                            <a href="#englishClass2">
                                <div className="card-classes bg-7ddaff">
                                    <p className="p-sm color-dark">English Classes</p>
                                    <p className="p-sm color-dark">(Yr2-Yr3)</p>
                                </div>
                            </a>
                        </div>
                        <div className='col-lg-2 col-md-4'>
                            <a href="#englishClass3">
                                <div className="card-classes bg-7ddaff">
                                    <p className="p-sm color-dark">English Classes</p>
                                    <p className="p-sm color-dark">(Yr3-Yr4)</p>
                                </div>
                            </a>
                        </div>
                        <div className='col-lg-2 col-md-4'>
                            <a href="#englishClass4">
                                <div className="card-classes bg-7ddaff">
                                    <p className="p-sm color-dark">English Classes</p>
                                    <p className="p-sm color-dark">(Yr5-Yr6)</p>
                                </div>
                            </a>
                        </div>
                        <div className='col-lg-2 col-md-4'>
                            <a href="#englishClass5">
                                <div className="card-classes bg-7ddaff">
                                    <p className="p-sm color-dark">English Classes</p>
                                    <p className="p-sm color-dark">(Yr5-Yr6)</p>
                                </div>
                            </a>
                        </div>
                        <div className='col-lg-2 col-md-4'>
                            <a href="#englishClass6">
                                <div className="card-classes bg-7ddaff">
                                    <p className="p-sm color-dark">English Classes</p>
                                    <p className="p-sm color-dark">(Yr6-Yr7)</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-lg-2 col-md-4'>
                            <a href="#mathsClass1">
                                <div className="card-classes bg-8C52FF">
                                    <p className="p-sm color-light">Math Classes </p>
                                    <p className="p-sm color-light">(Prep-Yr1)</p>
                                </div>
                            </a>
                        </div>
                        <div className='col-lg-2 col-md-4'>
                            <a href="#mathsClass2">
                                <div className="card-classes bg-8C52FF">
                                    <p className="p-sm color-light">Math Classes</p>
                                    <p className="p-sm color-light">(Yr2-Yr3)</p>
                                </div>
                            </a>
                        </div>
                        <div className='col-lg-2 col-md-4'>
                            <a href="#mathsClass3">
                                <div className="card-classes bg-8C52FF">
                                    <p className="p-sm color-light">Math Classes</p>
                                    <p className="p-sm color-light">(Yr3-Yr4)</p>
                                </div>
                            </a>
                        </div>
                        <div className='col-lg-2 col-md-4'>
                            <a href="#mathsClass4">
                                <div className="card-classes bg-8C52FF">
                                    <p className="p-sm color-light">Math Classes</p>
                                    <p className="p-sm color-light">(Yr4-Yr5)</p>
                                </div>
                            </a>
                        </div>
                        <div className='col-lg-2 col-md-4'>
                            <a href="#mathsClass5">
                                <div className="card-classes bg-8C52FF">
                                    <p className="p-sm color-light">Math Classes</p>
                                    <p className="p-sm color-light">(Yr5-Yr6)</p>
                                </div>
                            </a>
                        </div>
                        <div className='col-lg-2 col-md-4'>
                            <a href="#mathsClass6">
                                <div className="card-classes bg-8C52FF">
                                    <p className="p-sm color-light">Math Classes</p>
                                    <p className="p-sm color-light">(Yr6-Yr7)</p>
                                </div>
                            </a>
                        </div>
                    </div>

                </div>
            </section>

            <section className='syllabus-part'>
                <div className='container'>
                    <h2 className='title-secondary text-center fw-regular color-neutral mt-3 mb-4 title-bg'> ENGLISH CLASSES </h2>
                    <h3 className='top-title text-center mt-3'>English Classes (Prep-Yr1)</h3>
                    <div className='choose-your mt-3' id='englishClass1'>
                        <div className='row align'>
                            <div className='col-sm-9'>
                                <h3>Reading: Middle and Upper Level</h3>
                                <p className='p-md fw-light color-primary'>This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.</p>
                                <ul className="list-classes mt-3">
                                    <li><i className="fa-solid fa-user"></i> Perferendis quis sun</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> Voluptates consectet</li>
                                </ul>
                            </div>
                            <div className='col-sm-3'>
                                <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                            </div>
                        </div>
                    </div>

                    <hr className='line-part mt-5 mb-5' />
                    <h3 className='top-title text-center mt-3'>English Classes (Yr2-Yr3)</h3>
                    <div className='choose-your mt-3' id='englishClass2'>
                        <div className='row align'>
                            <div className='col-sm-9'>
                                <h3>Reading: Middle and Upper Level</h3>
                                <p className='p-md fw-light color-primary'>This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.</p>
                                <ul className="list-classes mt-3">
                                    <li><i className="fa-solid fa-user"></i> Perferendis quis sun</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> Voluptates consectet</li>
                                </ul>
                            </div>
                            <div className='col-sm-3'>
                                <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                            </div>
                        </div>
                    </div>

                    <hr className='line-part mt-5 mb-5' />
                    <h3 className='top-title text-center mt-3'>English Classes (Yr3-Yr4)</h3>
                    <div className='choose-your mt-3' id='englishClass3'>
                        <div className='row align'>
                            <div className='col-sm-9'>
                                <h3>Reading: Middle and Upper Level</h3>
                                <p className='p-md fw-light color-primary'>This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.</p>
                                <ul className="list-classes mt-3">
                                    <li><i className="fa-solid fa-user"></i> Perferendis quis sun</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> Voluptates consectet</li>
                                </ul>
                            </div>
                            <div className='col-sm-3'>
                                <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                            </div>
                        </div>
                    </div>

                    <hr className='line-part mt-5 mb-5' />
                    <h3 className='top-title text-center mt-3'>English Classes (Yr4-Yr5)</h3>
                    <div className='choose-your mt-3' id='englishClass4'>
                        <div className='row align'>
                            <div className='col-sm-9'>
                                <h3>Reading: Middle and Upper Level</h3>
                                <p className='p-md fw-light color-primary'>This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.</p>
                                <ul className="list-classes mt-3">
                                    <li><i className="fa-solid fa-user"></i> Perferendis quis sun</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> Voluptates consectet</li>
                                </ul>
                            </div>
                            <div className='col-sm-3'>
                                <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                            </div>
                        </div>
                    </div>

                    <hr className='line-part mt-5 mb-5' />
                    <h3 className='top-title text-center mt-3'>English Classes (Yr5-Yr6)</h3>
                    <div className='choose-your mt-3' id='englishClass5'>
                        <div className='row align'>
                            <div className='col-sm-9'>
                                <h3>Reading: Middle and Upper Level</h3>
                                <p className='p-md fw-light color-primary'>This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.</p>
                                <ul className="list-classes mt-3">
                                    <li><i className="fa-solid fa-user"></i> Perferendis quis sun</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> Voluptates consectet</li>
                                </ul>
                            </div>
                            <div className='col-sm-3'>
                                <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                            </div>
                        </div>
                    </div>

                    <hr className='line-part mt-5 mb-5' />
                    <h3 className='top-title text-center mt-3'>English Classes (Yr6-Yr7)</h3>
                    <div className='choose-your mt-3' id='englishClass6'>
                        <div className='row align'>
                            <div className='col-sm-9'>
                                <h3>Reading: Middle and Upper Level</h3>
                                <p className='p-md fw-light color-primary'>This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.</p>
                                <ul className="list-classes mt-3">
                                    <li><i className="fa-solid fa-user"></i> Perferendis quis sun</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> Voluptates consectet</li>
                                </ul>
                            </div>
                            <div className='col-sm-3'>
                                <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                            </div>
                        </div>
                    </div>

                    <br />
                    <br />

                    <h2 className='title-secondary text-center fw-regular color-neutral mt-3 mb-4 title-bg-8C52FF'> MATHS CLASSES </h2>
                    <h3 className='top-title text-center mt-3'>Maths Classes (Prep-Yr1)</h3>
                    <div className='choose-your theam-8C52FF mt-3' id='mathsClass1'>
                        <div className='row align'>
                            <div className='col-sm-9'>
                                <h3>Reading: Middle and Upper Level</h3>
                                <p className='p-md fw-light color-primary'>This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.</p>
                                <ul className="list-classes mt-3">
                                    <li><i className="fa-solid fa-user"></i> Perferendis quis sun</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> Voluptates consectet</li>
                                </ul>
                            </div>
                            <div className='col-sm-3'>
                                <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                            </div>
                        </div>
                    </div>

                    <hr className='line-part mt-5 mb-5 line-8c52ff' />
                    <h3 className='top-title text-center mt-3'>Maths Classes (Yr2-Yr3)</h3>
                    <div className='choose-your theam-8C52FF mt-3' id='mathsClass2'>
                        <div className='row align'>
                            <div className='col-sm-9'>
                                <h3>Reading: Middle and Upper Level</h3>
                                <p className='p-md fw-light color-primary'>This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.</p>
                                <ul className="list-classes mt-3">
                                    <li><i className="fa-solid fa-user"></i> Perferendis quis sun</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> Voluptates consectet</li>
                                </ul>
                            </div>
                            <div className='col-sm-3'>
                                <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                            </div>
                        </div>
                    </div>

                    <hr className='line-part mt-5 mb-5 line-8c52ff' />
                    <h3 className='top-title text-center mt-3'>Maths Classes (Yr3-Yr4)</h3>
                    <div className='choose-your theam-8C52FF mt-3' id='mathsClass3'>
                        <div className='row align'>
                            <div className='col-sm-9'>
                                <h3>Reading: Middle and Upper Level</h3>
                                <p className='p-md fw-light color-primary'>This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.</p>
                                <ul className="list-classes mt-3">
                                    <li><i className="fa-solid fa-user"></i> Perferendis quis sun</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> Voluptates consectet</li>
                                </ul>
                            </div>
                            <div className='col-sm-3'>
                                <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                            </div>
                        </div>
                    </div>

                    <hr className='line-part mt-5 mb-5 line-8c52ff' />
                    <h3 className='top-title text-center mt-3'>Maths Classes (Yr4-Yr5)</h3>
                    <div className='choose-your theam-8C52FF mt-3' id='mathsClass4'>
                        <div className='row align'>
                            <div className='col-sm-9'>
                                <h3>Reading: Middle and Upper Level</h3>
                                <p className='p-md fw-light color-primary'>This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.</p>
                                <ul className="list-classes mt-3">
                                    <li><i className="fa-solid fa-user"></i> Perferendis quis sun</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> Voluptates consectet</li>
                                </ul>
                            </div>
                            <div className='col-sm-3'>
                                <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                            </div>
                        </div>
                    </div>

                    <hr className='line-part mt-5 mb-5 line-8c52ff' />
                    <h3 className='top-title text-center mt-3'>Maths Classes (Yr5-Yr6)</h3>
                    <div className='choose-your theam-8C52FF mt-3' id='mathsClass5'>
                        <div className='row align'>
                            <div className='col-sm-9'>
                                <h3>Reading: Middle and Upper Level</h3>
                                <p className='p-md fw-light color-primary'>This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.</p>
                                <ul className="list-classes mt-3">
                                    <li><i className="fa-solid fa-user"></i> Perferendis quis sun</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> Voluptates consectet</li>
                                </ul>
                            </div>
                            <div className='col-sm-3'>
                                <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                            </div>
                        </div>
                    </div>

                    <hr className='line-part line-8c52ff mt-5 mb-5' />
                    <h3 className='top-title text-center mt-3'>Maths Classes (Yr6-Yr7)</h3>
                    <div className='choose-your theam-8C52FF mt-3' id='mathsClass6'>
                        <div className='row align'>
                            <div className='col-sm-9'>
                                <h3>Reading: Middle and Upper Level</h3>
                                <p className='p-md fw-light color-primary'>This class focuses on the Reading Comprehension section, teaching students key strategies for reading passages and answering each question type. Students will learn and practice crucial skills like active reading, elimination, time management, and more.</p>
                                <ul className="list-classes mt-3">
                                    <li><i className="fa-solid fa-user"></i> Perferendis quis sun</li>
                                    <li><i className="fa-solid fa-calendar-days"></i> Voluptates consectet</li>
                                </ul>
                            </div>
                            <div className='col-sm-3'>
                                <a className="link-btn bg-secondary " href="/register"> <i className="fa-solid fa-question"></i>  Contact Us</a>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            <section className='testimonial-classes'>
                <div className='container'>
                    <h2 className='title-secondary text-center fw-regular color-neutral mb-4'>Testimonials </h2>
                    <div className='row'>
                        <div className='col-sm-6'>
                            <div className='card-box bg-00bff5'>
                                <p className='p-sm color-light'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using  Content here, content here making it look like readable English. </p>
                                <p className='p-lg text-end color-light mb-1'>- Katie D.</p>
                            </div>
                        </div>
                        <div className='col-sm-6'>
                            <div className='card-box bg-7cc576'>
                                <p className='p-sm color-light'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using  Content here, content here making it look like readable English. </p>
                                <p className='p-lg text-end color-light mb-1'>- Katie D.</p>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-sm-6'>
                            <div className='card-box bg-a764a9'>
                                <p className='p-sm color-light'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using  Content here, content here making it look like readable English. </p>
                                <p className='p-lg text-end color-light mb-1'>- Katie D.</p>
                            </div>
                        </div>
                        <div className='col-sm-6'>
                            <div className='card-box bg-f78e55'>
                                <p className='p-sm color-light'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using  Content here, content here making it look like readable English. </p>
                                <p className='p-lg text-end color-light mb-1'>- Katie D.</p>
                            </div>
                        </div>
                    </div>

                    <div className='row'>
                        <div className='col-sm-6'>
                            <div className='card-box bg-00bff5'>
                                <p className='p-sm color-light'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using  Content here, content here making it look like readable English. </p>
                                <p className='p-lg text-end color-light mb-1'>- Katie D.</p>
                            </div>
                        </div>
                        <div className='col-sm-6'>
                            <div className='card-box bg-7cc576'>
                                <p className='p-sm color-light'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using  Content here, content here making it look like readable English. </p>
                                <p className='p-lg text-end color-light mb-1'>- Katie D.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
