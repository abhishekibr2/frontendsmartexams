import React from 'react'

export default function page() {
    return (
        <>
            <section className="dash-part bg-light-steel ">
                <div className="container">
                    <div className="spac-dash pt-5 pb-3 mobile-pt-2">
                        <div className="card-dash ">
                            <h2 className="color-dark-gray title-lg bottom-ultra-space fw-regular ">
                                Questions and Answers
                            </h2>
                            <div className="accordion accordion-part" id="accordionExample">
                                <table className="rwd-table  text-center SubmittedTable shadow-sm">
                                    <tbody>
                                        <tr>
                                            <th className="width-100-dask">Number</th>
                                            <th>QID</th>
                                            <th>Answer Stats</th>
                                            <th>Difficulty</th>
                                            <th>Marks</th>
                                            <th>Topic</th>
                                            <th>Sub-Topic</th>
                                            <th>Time</th>
                                            <th>Review</th>
                                        </tr>
                                        <tr>
                                            <td data-th="Number">1</td>
                                            <td data-th="QID">4788</td>
                                            <td data-th="Answer Stats ">
                                                <span className="p-sm fw-bold" style={{ color: "#FD0601" }}>
                                                    X
                                                </span>
                                            </td>
                                            <td data-th="Submission date">
                                                <div className="questionAnswerBtn">
                                                    <button
                                                        style={{ background: "#52C479" }}
                                                        className="btn-primary "
                                                    >
                                                        Easy
                                                    </button>
                                                </div>
                                            </td>
                                            <td data-th="Difficulty">0/1</td>
                                            <td data-th="Marks">Vocabulary</td>
                                            <td data-th="Marks">Vocabulary</td>
                                            <td data-th="Marks">6 Seconds</td>
                                            <td data-th="Marks">
                                                <a href="#" style={{ color: "#09A6EB" }}>
                                                    Review
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td data-th="Number">2</td>
                                            <td data-th="QID">4788</td>
                                            <td data-th="Answer Stats ">
                                                <span className="p-sm fw-bold" style={{ color: "#FD0601" }}>
                                                    X
                                                </span>
                                            </td>
                                            <td data-th="Submission date">
                                                <div className="questionAnswerBtn">
                                                    <button
                                                        style={{ background: "#B81736" }}
                                                        className="btn-primary "
                                                    >
                                                        Medium
                                                    </button>
                                                </div>
                                            </td>
                                            <td data-th="Difficulty">0/1</td>
                                            <td data-th="Marks">Vocabulary</td>
                                            <td data-th="Marks">Vocabulary</td>
                                            <td data-th="Marks">6 Seconds</td>
                                            <td data-th="Marks">
                                                <a href="#" style={{ color: "#09A6EB" }}>
                                                    Review
                                                </a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td data-th="Number">3</td>
                                            <td data-th="QID">4788</td>
                                            <td data-th="Answer Stats ">
                                                <span className="p-sm fw-bold" style={{ color: "#FD0601" }}>
                                                    X
                                                </span>
                                            </td>
                                            <td data-th="Submission date">
                                                <div className="questionAnswerBtn">
                                                    <button
                                                        style={{ background: "#FB3311" }}
                                                        className="btn-primary "
                                                    >
                                                        Hards
                                                    </button>
                                                </div>
                                            </td>
                                            <td data-th="Difficulty">0/1</td>
                                            <td data-th="Marks">Vocabulary</td>
                                            <td data-th="Marks">Vocabulary</td>
                                            <td data-th="Marks">6 Seconds</td>
                                            <td data-th="Marks">
                                                <a href="#" style={{ color: "#09A6EB" }}>
                                                    Review
                                                </a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
