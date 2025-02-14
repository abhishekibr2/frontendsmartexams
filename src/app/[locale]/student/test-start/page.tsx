import Link from 'next/link'
import React from 'react'

export default function page() {
    return (
        <>
            <section className="dash-part ">
                <div className="container-fluid">
                    <div className="row align ">
                        <div className="col-xxl-4 col-sm-5">
                            <p className="top-title">
                                Test: Seal Package
                            </p>
                        </div>
                        <div className="col-xxl-8 col-sm-7">
                            <p className="p-sm fw-semi-bold color-dark-gray mb-1">Test Progress</p>
                            <div className="progress mt-1">
                                <div
                                    className="progress-bar"
                                    role="progressbar"
                                    style={{ width: "10%" }}
                                    aria-valuenow={25}
                                    aria-valuemin={0}
                                    aria-valuemax={100}
                                >
                                    10%
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-dash top-extra-space">
                        <p className="p-lg color-dark-gray pb-2 border-bottom fw-semi-bold">Question No 1</p>
                        <div className="row">
                            <div className="col-lg-5 col-md-12">
                                <div className="contant-box">
                                    <p className="title-tertiary color-dark-gray mb-3">
                                        1-8): For questions 1-8, choose the option (A, B, C or D) which
                                        you think best answers the question.
                                    </p>
                                    <p className="title-tertiary color-dark-gray mb-3">
                                        Read the extracts below then answer the questions.
                                    </p>
                                    <p className="title-tertiary color-dark-gray mb-3">
                                        Extract A: from &apos;Free Meant Freedom&apos; by Amy Tan
                                    </p>
                                    <p className="title-tertiary color-dark-gray mb-3">
                                        I was 6 when my father walked me to my first library, two blocks
                                        away from home, in Oakland, Calif. It was an old red brick
                                        building with fancy castle embellishments and gigantic double
                                        doors a child would not have been strong enough to push open. As I
                                        stood in the vast room, I felt tiny and timid. The only places
                                        been with ceilings this high were the church and the hospital. The
                                        first provided provisos for entering heaven, and the other
                                        contained fever, pain and terror. This enormous room, I soon
                                        learned, was like a toy store where everything was free. My
                                        parents rarely bought  books. Why pay money for
                                        something that could be read in an hour and was then used up?
                                    </p>
                                    <p className="title-tertiary color-dark-gray mb-3">
                                        The  section was on the left closest to the tall gothic
                                        windows. The easiest books were on the bottom. Since I could
                                        already read, I knew I should choose books on higher shelves, the
                                        harder books. That would show I was smarter than other kids my
                                        age. I realize now this was evidence I knew the concept of
                                        competition and its consequences of either pride or shame. In my
                                        family, anything.
                                    </p>
                                    <p className="title-tertiary color-dark-gray mb-3">
                                        I was 6 when my father walked me to my first library, two blocks
                                        away from home, in Oakland, Calif. It was an old red brick
                                        building with fancy castle embellishments and gigantic double
                                        doors a child would not have been strong enough to push open. As I
                                        stood in the vast room, I felt tiny and timid. The only places
                                        been with ceilings this high were the church and the hospital. The
                                        first provided provisos for entering heaven, and the other
                                        contained fever, pain and terror. This enormous room, I soon
                                        learned, was like a toy store where everything was free. My
                                        parents rarely bought  books. Why pay money for
                                        something that could be read in an hour and was then used up?
                                    </p>
                                    <p className="title-tertiary color-dark-gray mb-3">
                                        The  section was on the left closest to the tall gothic
                                        windows. The easiest books were on the bottom. Since I could
                                        already read, I knew I should choose books on higher shelves, the
                                        harder books. That would show I was smarter than other kids my
                                        age. I realize now this was evidence I knew the concept of
                                        competition and its consequences of either pride or shame. In my
                                        family, anything.
                                    </p>
                                    <p className="title-tertiary color-dark-gray mb-3">
                                        I was 6 when my father walked me to my first library, two blocks
                                        away from home, in Oakland, Calif. It was an old red brick
                                        building with fancy castle embellishments and gigantic double
                                        doors a child would not have been strong enough to push open. As I
                                        stood in the vast room, I felt tiny and timid. The only places
                                        been with ceilings this high were the church and the hospital. The
                                        first provided provisos for entering heaven, and the other
                                        contained fever, pain and terror. This enormous room, I soon
                                        learned, was like a toy store where everything was free. My
                                        parents rarely bought  books. Why pay money for
                                        something that could be read in an hour and was then used up?
                                    </p>
                                    <p className="title-tertiary color-dark-gray mb-3">
                                        The  section was on the left closest to the tall gothic
                                        windows. The easiest books were on the bottom. Since I could
                                        already read, I knew I should choose books on higher shelves, the
                                        harder books. That would show I was smarter than other kids my
                                        age. I realize now this was evidence I knew the concept of
                                        competition and its consequences of either pride or shame. In my
                                        family, anything.
                                    </p>

                                </div>
                            </div>
                            <div className="col-lg-7 col-md-12">
                                <div className="questionAnswer">
                                    <div className="row">
                                        <div className="col-sm-7">
                                            <p className="title-small color-dark-gray ">
                                                {" "}
                                                <b>1.</b> Both extracts indicate that libraries can
                                            </p>
                                            <div className="spac-left-sm">
                                                <label className="title-small color-dark-gray w-100 bottom-small-space">
                                                    <input
                                                        type="radio"
                                                        name="a"
                                                        className="radioQuestionAnswer"
                                                    />
                                                    <b> A.</b> provide babysitting services.
                                                </label>
                                                <label className="title-small color-dark-gray w-100 bottom-small-space">
                                                    <input
                                                        type="radio"
                                                        name="a"
                                                        className="radioQuestionAnswer"
                                                    />
                                                    <b> B.</b> be lonely buildings.
                                                </label>
                                                <label className="title-small color-dark-gray w-100 bottom-small-space">
                                                    <input
                                                        type="radio"
                                                        name="a"
                                                        className="radioQuestionAnswer"
                                                    />
                                                    <b> C.</b> limit a person&apos;s knowledge.
                                                </label>
                                                <label className="title-small color-dark-gray w-100 bottom-small-space">
                                                    <input
                                                        type="radio"
                                                        name="a"
                                                        className="radioQuestionAnswer"
                                                    />
                                                    <b> D.</b> have a great impact on children.
                                                </label>
                                            </div>
                                            <div className="row top-ultra-space">
                                                <div className="col-sm-2 text-center bottom-large-space spac-colum">
                                                    <div className="round-icon m-auto">
                                                        <i className="fa-solid fa-flag" />
                                                    </div>
                                                </div>
                                                <div className="col-sm-3 text-center opacity-7 bottom-large-space spac-colum">
                                                    <button className="btn-primary btn-spac  w-100">
                                                        Previous
                                                    </button>
                                                </div>
                                                <div className="col-sm-3 text-center bottom-large-space spac-colum">
                                                    <button className="btn-primary btn-spac clear-btn w-100">
                                                        <i className="fa-solid fa-eraser" /> Clear
                                                    </button>
                                                </div>
                                                <div className="col-sm-3 text-center bottom-large-space spac-colum">
                                                    <button className="btn-primary btn-spac  w-100">
                                                        Next
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-sm-5">
                                            <div className="list-number top-large-space">
                                                <ul className="iconListQuestionAnswer">
                                                    <li>
                                                        <i className="fa-solid fa-check" /> Answered
                                                    </li>
                                                    <li className="softPink">
                                                        <i className="fa-solid fa-xmark" /> Unanswered
                                                    </li>
                                                    <li className="deepRed">
                                                        <i className="fa-solid fa-maximize" /> Not Visited
                                                    </li>
                                                    <li className="purple">
                                                        <i className="fa-solid fa-comments" /> Answered &amp;
                                                        Flagged
                                                    </li>
                                                    <li className="lightGreen">
                                                        <i className="fa-solid fa-message" /> Flagged Unanswered
                                                    </li>
                                                </ul>
                                                <ul className="number-select mt-5 mb-4">
                                                    <li>
                                                        <a href="#">1</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">2</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">3</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">4</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">5</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">6</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">7</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">8</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">9</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">10</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">11</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">12</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">13</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">14</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">15</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">16</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">17</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">18</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">19</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">20</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">21</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">22</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">23</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">24</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">25</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">26</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">27</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">28</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">29</a>
                                                    </li>
                                                    <li>
                                                        <a href="#">30</a>
                                                    </li>
                                                </ul>
                                                <Link href='/student/test-submit'>
                                                    <button className="btn-primary btn-spac fix-content-width">
                                                        &nbsp;&nbsp; Submit Test &nbsp;&nbsp;
                                                    </button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </>
    )
}
