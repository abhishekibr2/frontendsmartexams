import { Button, Col, Result, Row } from 'antd';
import Link from 'next/link';

export default function NotFound() {
    return (
        <Row>
            <Col lg={24} md={24} sm={0} xs={0} style={{ paddingTop: '150px' }}></Col>
            <Col lg={24} md={24} sm={24} xs={24}>
                <Result
                    status="404"
                    title="404"
                    subTitle="Sorry, the page you visited does not exist."
                    extra={
                        <Link href={''}>
                            <Button type="primary">Back Home</Button>
                        </Link>
                    }
                />
            </Col>
            <Col lg={24} md={24} sm={0} xs={0} style={{ paddingTop: '100px' }}></Col>
        </Row>
    );
}
