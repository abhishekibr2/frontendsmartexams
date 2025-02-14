import React from 'react';

interface Term {
    id: number;
    title: string;
    description: string;
}

interface TermsOfServiceProps {
    data: Term[];
}

function TermsOfService({ data, }: TermsOfServiceProps) {
    return (
        <div>
            <section className="bg-pastel-blue pb-5">
                <h2 className="title-lg title-font-bg fw-semi-bold">
                    Terms and Condition
                </h2>
                <div className="container pt-5">
                    {data && data.length > 0 ? (
                        data.map((term) => (
                            <div key={term.id} className="mb-4">
                                <h3 className="title-sm fw-bold">{term.title}</h3>
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

export default TermsOfService;
