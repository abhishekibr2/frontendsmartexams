import React from "react";
import { Skeleton, Space } from "antd";

const RichTextLoader = () => {
    return (
        <div style={{ padding: "16px", border: "1px solid #f0f0f0", borderRadius: "8px", marginTop: 24, marginLeft: 24 }}>
            <Space direction="vertical" style={{ width: "100%" }}>
                <Skeleton.Input style={{ width: "60%", height: "32px" }} active />

                <Skeleton paragraph={{ rows: 6 }} active />
            </Space>
        </div>
    );
};

export default RichTextLoader;
