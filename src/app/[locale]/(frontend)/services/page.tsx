"use client";

import React, { useEffect, useState, useContext } from "react";
import OurServices from "@/components/OurServices";
import { getServicesFrontEnd } from "@/lib/frontendApi";
import AuthContext from "@/contexts/AuthContext";

function Page() {
    const [servicesData, setServicesData] = useState([]);

    async function fetchData() {
        try {
            const res = await getServicesFrontEnd();
            if (res?.data) {
                setServicesData(res.data);
            } else {
                console.error("Failed to fetch services or data is empty");
            }
        } catch (error) {
            console.error("Error fetching services:");
        }
    }

    useEffect(() => {
        fetchData()

    }, []);


    return (
        <div>
            <OurServices item={servicesData} />
        </div>
    );
}

export default Page;
