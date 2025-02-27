import React, { useContext, useState } from 'react'
import { DislikeFilled, DislikeOutlined, LikeFilled, LikeOutlined } from '@ant-design/icons';
import AuthContext from '@/contexts/AuthContext';
import { message } from 'antd';
import axios from 'axios';

interface Props {
    testAttempt: any;
    testAttemptId: string;
    onSuccess: () => void;
}

export default function FeedbackForm({ testAttempt, testAttemptId, onSuccess }: Props) {
    const [comment, setComment] = useState('');
    const { user } = useContext(AuthContext);

    const [questionFeedback, setQuestionFeedback] = useState<{
        like: boolean | null;
        dislike: boolean | null;
    }>({
        like: null,
        dislike: null
    });

    const [difficultyFeedback, setDifficultyFeedback] = useState<{
        like: boolean | null;
        dislike: boolean | null;
    }>({
        like: null,
        dislike: null
    });

    const [technicalFeedback, setTechnicalFeedback] = useState<{
        like: boolean | null;
        dislike: boolean | null;
    }>({
        like: null,
        dislike: null
    });

    const handleLikeDislike = (section: string, type: 'like' | 'dislike') => {
        let newState;

        if (section === 'question') {
            newState = { ...questionFeedback };
            if (type === 'like') {
                newState.like = newState.like ? null : true;
                newState.dislike = null;
            } else if (type === 'dislike') {
                newState.dislike = newState.dislike ? null : true;
                newState.like = null;
            }
            setQuestionFeedback(newState);
        } else if (section === 'difficulty') {
            newState = { ...difficultyFeedback };
            if (type === 'like') {
                newState.like = newState.like ? null : true;
                newState.dislike = null;
            } else if (type === 'dislike') {
                newState.dislike = newState.dislike ? null : true;
                newState.like = null;
            }
            setDifficultyFeedback(newState);
        } else if (section === 'technical') {
            newState = { ...technicalFeedback };
            if (type === 'like') {
                newState.like = newState.like ? null : true;
                newState.dislike = null;
            } else if (type === 'dislike') {
                newState.dislike = newState.dislike ? null : true;
                newState.like = null;
            }
            setTechnicalFeedback(newState);
        }
    };

    const handleCommentChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(event.target.value);
    };

    const validateFeedback = () => {
        if (!questionFeedback.like && !questionFeedback.dislike) {
            message.error({
                content: <div>Please select either <b>Like</b> or <b>Dislike</b> for the Question Level.</div>,
            });
            return false;
        }
        if (!difficultyFeedback.like && !difficultyFeedback.dislike) {
            message.error({
                content: <div>Please select either <b>Like</b> or <b>Dislike</b> for the Difficulty Level.</div>,
            });
            return false;
        }
        if (!technicalFeedback.like && !technicalFeedback.dislike) {
            message.error({
                content: <div>Please select either <b>Like</b> or <b>Dislike</b> for the Technical Level.</div>,
            });
            return false;
        }
        if (!comment.trim()) {
            message.error("Please enter a comment before submitting.");
            return false;
        }
        return true;
    };


    const responseSubmission = async () => {
        if (!validateFeedback()) return;

        const feedbackData = {
            userId: user?._id,
            questionFeedback,
            difficultyFeedback,
            technicalFeedback,
            comment,
            testAttemptId,
            testId: testAttempt.test._id,
        };

        try {
            const response = await axios.post(`/student/testAttempt/submit-feedback`, feedbackData);
            if (response) {
                message.success('Feedback submitted successfully!');
                onSuccess();
                setQuestionFeedback({ like: null, dislike: null });
                setDifficultyFeedback({ like: null, dislike: null });
                setTechnicalFeedback({ like: null, dislike: null });
                setComment('');
            } else {
                message.error('Failed to submit feedback. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting feedback:', error);
            message.error('An error occurred while submitting feedback.');
        }
    };

    console.log({ testAttempt })

    return (
        <>
            <div className="container">

                <div className="section-heading w-100">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <h6 className="review">Question Level</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="button-container">
                                <div
                                    className="like-button"
                                    onClick={() => handleLikeDislike('question', 'like')}
                                >{
                                        !questionFeedback.like ?
                                            <LikeOutlined style={{ fontSize: '18px' }} />
                                            :
                                            <LikeFilled style={{ fontSize: '18px' }} />
                                    }
                                    <span>Like</span>
                                </div>
                                <div
                                    className="dislike-button"
                                    onClick={() => handleLikeDislike('question', 'dislike')}
                                >
                                    {questionFeedback.dislike ?
                                        <DislikeFilled style={{ fontSize: '18px' }} />
                                        :
                                        <DislikeOutlined style={{ fontSize: '18px' }} />
                                    }
                                    <span>Dislike</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="count-display">
                                {questionFeedback.like && <h6 className="review">1 Like Dislike 0</h6>}
                                {questionFeedback.dislike && <h6 className="review">0 Like Dislike 1</h6>}
                                {!questionFeedback.like && !questionFeedback.dislike && (
                                    <h6 className="review">0 Like 0 Dislike</h6>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-heading mt-3">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <h6 className="review">Difficulty Level</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="button-container">
                                <div
                                    className="like-button"
                                    onClick={() => handleLikeDislike('difficulty', 'like')}
                                >
                                    {difficultyFeedback.like
                                        ? <LikeFilled style={{ fontSize: '18px' }} />
                                        : <LikeOutlined style={{ fontSize: '18px' }} />
                                    }
                                    <span>Like</span>
                                </div>
                                <div
                                    className="dislike-button"
                                    onClick={() => handleLikeDislike('difficulty', 'dislike')}
                                >
                                    {
                                        difficultyFeedback.dislike ?
                                            <DislikeFilled style={{ fontSize: '18px' }} />
                                            : <DislikeOutlined style={{ fontSize: '18px' }} />
                                    }
                                    <span>Dislike</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="count-display">
                                {difficultyFeedback.like && <h6 className="review">1 Like Dislike 0</h6>}
                                {difficultyFeedback.dislike && <h6 className="review">0 Like Dislike 1</h6>}
                                {!difficultyFeedback.like && !difficultyFeedback.dislike && (
                                    <h6 className="review">0 Like 0 Dislike</h6>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="section-heading mt-3">
                    <div className="row align-items-center">
                        <div className="col-md-4">
                            <h6 className="review">Technical Level</h6>
                        </div>
                        <div className="col-md-4">
                            <div className="button-container">
                                <div
                                    className="like-button"
                                    onClick={() => handleLikeDislike('technical', 'like')}
                                >
                                    {technicalFeedback.like
                                        ? <LikeFilled style={{ fontSize: '18px' }} />
                                        : <LikeOutlined style={{ fontSize: '18px' }} />
                                    }
                                    <span>Like</span>
                                </div>
                                <div
                                    className="dislike-button"
                                    onClick={() => handleLikeDislike('technical', 'dislike')}
                                >
                                    {
                                        technicalFeedback.dislike ?
                                            <DislikeFilled style={{ fontSize: '18px' }} />
                                            : <DislikeOutlined style={{ fontSize: '18px' }} />
                                    }
                                    <span>Dislike</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="count-display">
                                {technicalFeedback.like && <h6 className="review">1 Like Dislike 0</h6>}
                                {technicalFeedback.dislike && <h6 className="review">0 Like Dislike 1</h6>}
                                {!technicalFeedback.like && !technicalFeedback.dislike && (
                                    <h6 className="review">0 Like 0 Dislike</h6>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <h6 className="review" style={{ textAlign: 'start' }}>
                        Comment
                    </h6>
                    <textarea
                        rows={6}
                        placeholder="Write your comment here..."
                        style={{ background: '#f5f5f5', marginTop: '5px' }}
                        value={comment}
                        onChange={handleCommentChange}
                        maxLength={200}
                        required
                    />
                </div>

                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '20px'
                    }}
                >
                    <button
                        onClick={responseSubmission}
                        style={{
                            padding: '10px 20px',
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            borderRadius: '5px',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Submit Feedback
                    </button>
                </div>
            </div>
        </>
    )
}
