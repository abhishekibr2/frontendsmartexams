'use client'
import "./style.css";
import { Col, Row, Image } from "antd";
import Titles from "@/app/commonUl/Titles";
import ParaText from "@/app/commonUl/ParaText";
import ImageWithFallback from "../ImageWithFallback";

interface ourServices {
    description: string;
    length: number;
    title: string;
    image: string;

}
export default function OurServices({ item }: { item: ourServices[] }) {
    return (
        <section id="serviceId">
            <div className="customContainer">
                <div className="customContainer" id="ourServices">
                    <div className="textDescription textCenter">
                        <Titles level={3} color="white">
                            Our Services
                        </Titles>
                    </div>
                    <Row align="middle" className="gapPadding" justify="center">
                        <Col xl={24}>
                            <Row align="middle" gutter={[24, 24]}>
                                {item && item.length > 0 ? (
                                    item.map((item, index: number) => (
                                        <Col
                                            xs={24}
                                            sm={24}
                                            md={8}
                                            lg={8}
                                            xl={8}
                                            xxl={8}
                                            key={index}
                                        >
                                            <div className="column">
                                                <div className="card-service">
                                                    <div className="content">
                                                        <div className="front">
                                                            {/* <ImageWithFallback
                                                                src={`/images/${item.image}`}
                                                                fallbackSrc="/images/web-dev.jpeg"
                                                                shouldPreview={false}
                                                            /> */}
                                                            <Image
                                                                alt="service-image"
                                                                src={item
                                                                    ? `${process.env['NEXT_PUBLIC_IMAGE_URL']}/services/original/${item?.image}`
                                                                    : '/images/web-dev.jpeg'} className="card__image"
                                                                preview={false}
                                                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                            />
                                                        </div>
                                                        <div className="back from-right">
                                                            <ParaText fontWeightBold={600} size="large" color="white">
                                                                {item.title}
                                                            </ParaText>
                                                            <ParaText className="dBlock description" size="extraSmall" color="white">
                                                                <div
                                                                    style={{ listStyle: 'inherit' }}
                                                                    dangerouslySetInnerHTML={{ __html: item?.description?.slice(0, 340) }}
                                                                />
                                                            </ParaText>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    ))
                                ) : (
                                    <Col span={24}>
                                        <ParaText size="large" color="white">
                                            No services available at the moment.
                                        </ParaText>
                                    </Col>
                                )}
                            </Row>
                        </Col>
                    </Row>
                </div>
            </div>
        </section>
    );
}
