'use client';
import React, { useContext, useState } from 'react';
import { LikeOutlined, DislikeOutlined } from '@ant-design/icons';
import './style.css';
import AuthContext from '@/contexts/AuthContext';
import { AddFeedPackageFeedBack } from '@/lib/adminApi';
import { message, Modal } from 'antd';

export default function Page() {
	const [showFeedback, setShowFeedback] = useState(false);
	const { user } = useContext(AuthContext);
	const userId = user?._id;
	const [isModalOpen, setIsModalOpen] = useState(false);

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

	const [comment, setComment] = useState('');

	const handleFeedbackClick = () => {
		setShowFeedback(!showFeedback);
		setIsModalOpen(true);
	};

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
			message.error('Please select "Like" or "Dislike" for Question Level.');
			return false;
		}
		if (!difficultyFeedback.like && !difficultyFeedback.dislike) {
			message.error('Please select "Like" or "Dislike" for Difficulty Level.');
			return false;
		}
		if (!technicalFeedback.like && !technicalFeedback.dislike) {
			message.error('Please select "Like" or "Dislike" for Technical Level.');
			return false;
		}
		if (!comment.trim()) {
			message.error('Please write a comment before submitting!');
			return false;
		}
		return true;
	};

	const responseSubmission = async () => {
		if (!validateFeedback()) return;

		const feedbackData = {
			userId,
			questionFeedback,
			difficultyFeedback,
			technicalFeedback,
			comment,
			packageId: '6751a5f3823f2dd9f1d718d5'
		};

		try {
			const response = await AddFeedPackageFeedBack(feedbackData);
			if (response) {
				message.success('Feedback submitted successfully!');
				setIsModalOpen(false);
				setShowFeedback(false);

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

	const showModal = () => {
		setIsModalOpen(true);
	};

	const handleCancel = () => {
		setIsModalOpen(false);
		setQuestionFeedback({ like: null, dislike: null });
		setDifficultyFeedback({ like: null, dislike: null });
		setTechnicalFeedback({ like: null, dislike: null });
		setComment('');
	};
	return (
		<>
			<div className="submit-button">
				<button
					onClick={handleFeedbackClick}
					style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'black' }}
				>
					Package Feedback
				</button>
			</div>
			<Modal title="" open={isModalOpen} onCancel={handleCancel} footer={null}>
				<div className="container">
					<h1 className="review">
						Test Name: GR8 Reading <span style={{ background: '#d1d111', padding: '10px' }}>Feedback</span>
					</h1>

					<div className="section-heading">
						<h1 className="review">Question Level</h1>
						<div className="button-container">
							<div
								className="like-button"
								onClick={() => handleLikeDislike('question', 'like')}
								style={{
									backgroundColor: questionFeedback.like ? '#4CAF50' : '#f0f0f0',
									color: 'black'
								}}
							>
								<LikeOutlined />
								<span>Like</span>
							</div>
							<div
								className="dislike-button"
								onClick={() => handleLikeDislike('question', 'dislike')}
								style={{
									backgroundColor: questionFeedback.dislike ? '#FF6347' : '#f0f0f0',
									color: 'black'
								}}
							>
								<DislikeOutlined style={{ fontSize: '18px' }} />
								<span>Dislike</span>
							</div>
						</div>
						<div className="count-display">
							{questionFeedback.like && <h1 className="review">1 Like Dislike 0</h1>}
							{questionFeedback.dislike && <h1 className="review">1 Dislike Like 0</h1>}
							{!questionFeedback.like && !questionFeedback.dislike && (
								<h1 className="review">0 Like 0 Dislike</h1>
							)}
						</div>
					</div>

					<div className="section-heading">
						<h1 className="review">Difficulty Level</h1>
						<div className="button-container">
							<div
								className="like-button"
								onClick={() => handleLikeDislike('difficulty', 'like')}
								style={{
									backgroundColor: difficultyFeedback.like ? '#4CAF50' : '#f0f0f0',
									color: 'black'
								}}
							>
								<LikeOutlined style={{ fontSize: '18px' }} />
								<span>Like</span>
							</div>
							<div
								className="dislike-button"
								onClick={() => handleLikeDislike('difficulty', 'dislike')}
								style={{
									backgroundColor: difficultyFeedback.dislike ? '#FF6347' : '#f0f0f0',
									color: 'black'
								}}
							>
								<DislikeOutlined style={{ fontSize: '18px' }} />
								<span>Dislike</span>
							</div>
						</div>
						<div className="count-display">
							{difficultyFeedback.like && <h1 className="review">1 Like Dislike 0</h1>}
							{difficultyFeedback.dislike && <h1 className="review">1 Dislike Like 0</h1>}
							{!difficultyFeedback.like && !difficultyFeedback.dislike && (
								<h1 className="review">0 Like 0 Dislike</h1>
							)}
						</div>
					</div>

					<div className="section-heading">
						<h1 className="review">Technical Level</h1>
						<div className="button-container">
							<div
								className="like-button"
								onClick={() => handleLikeDislike('technical', 'like')}
								style={{
									backgroundColor: technicalFeedback.like ? '#4CAF50' : '#f0f0f0',
									color: 'black'
								}}
							>
								<LikeOutlined style={{ fontSize: '18px' }} />
								<span>Like</span>
							</div>
							<div
								className="dislike-button"
								onClick={() => handleLikeDislike('technical', 'dislike')}
								style={{
									backgroundColor: technicalFeedback.dislike ? '#FF6347' : '#f0f0f0',
									color: 'black'
								}}
							>
								<DislikeOutlined style={{ fontSize: '18px' }} />
								<span>Dislike</span>
							</div>
						</div>
						<div className="count-display">
							{technicalFeedback.like && <h1 className="review">1 Like Dislike 0</h1>}
							{technicalFeedback.dislike && <h1 className="review">1 Dislike Like 0</h1>}
							{!technicalFeedback.like && !technicalFeedback.dislike && (
								<h1 className="review">0 Like 0 Dislike</h1>
							)}
						</div>
					</div>

					<div>
						<h1 className="review" style={{ textAlign: 'start' }}>
							Comment
						</h1>
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
							justifyContent: 'flex-start',
							marginTop: '20px'
						}}
					>
						<button
							onClick={responseSubmission}
							style={{
								padding: '10px 20px',
								backgroundColor: '#4CAF50',
								color: 'white'
							}}
						>
							Submit Feedback
						</button>
					</div>
				</div>
			</Modal>
		</>
	);
}
