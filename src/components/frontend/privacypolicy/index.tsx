import React from 'react';

interface Privacy {
    id: number;
    title: any;
    description: string;
}

interface privacypolicy {
    data: Privacy[];
}

function PrivacyPolicy({ data, }: privacypolicy) {
    return (
        <div>
            <section className="bg-pastel-blue pb-5">
                <h2 className="title-lg title-font-bg fw-semi-bold">
                    {data[0]?.title}
                </h2>
                <div className="container pt-5">
                    {data && data.length > 0 ? (
                        data.map((term) => (
                            <div key={term.id} className="mb-4">
                                <div
                                    dangerouslySetInnerHTML={{ __html: term.description }}
                                />
                            </div>
                        ))
                    ) : (
                        <p>No terms available.</p>
                    )}
                </div>
            </section>
        </div>
    );
}

export default PrivacyPolicy;
