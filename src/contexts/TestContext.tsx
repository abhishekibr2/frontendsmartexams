'use client'
import React, { createContext, useState, useContext, useRef } from 'react';
import { QuestionAndComprehension, Test } from '@/lib/types';
import { Form, FormInstance } from 'antd';

interface TestContextType {
    questions: QuestionAndComprehension[];
    test: Test | undefined;
    setQuestions: React.Dispatch<React.SetStateAction<QuestionAndComprehension[]>>;
    setTest: React.Dispatch<React.SetStateAction<Test | undefined>>;
    testAttempt: any;
    setTestAttempt: React.Dispatch<React.SetStateAction<any>>;
    carouselRef: React.MutableRefObject<any>;
    currentIndex: number;
    setCurrentIndex: React.Dispatch<React.SetStateAction<number>>;
    totalQuestion: number;
    setTotalQuestion: React.Dispatch<React.SetStateAction<number>>;
    attemptQuestion: any;
    setAttemptQuestion: React.Dispatch<React.SetStateAction<any>>;
    form: FormInstance;
    questionAttempts: any;
    setQuestionAttempts: React.Dispatch<React.SetStateAction<any>>;
    isFlagged: boolean;
    setIsFlagged: React.Dispatch<React.SetStateAction<boolean>>;
    isComprehension: boolean;
    setIsComprehension: React.Dispatch<React.SetStateAction<boolean>>;
    isReview: boolean;
    setIsReview: React.Dispatch<React.SetStateAction<boolean>>;
}

const TestContext = createContext<TestContextType | null>(null);

export const TestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [questions, setQuestions] = useState<QuestionAndComprehension[]>([]);
    const [test, setTest] = useState<Test | undefined>(undefined);
    const [testAttempt, setTestAttempt] = useState();
    const [currentIndex, setCurrentIndex] = useState(0)
    const [totalQuestion, setTotalQuestion] = useState(0)
    const [attemptQuestion, setAttemptQuestion] = useState();
    const [questionAttempts, setQuestionAttempts] = useState()
    const [isFlagged, setIsFlagged] = useState(false)
    const [isComprehension, setIsComprehension] = useState(false)
    const [isReview, setIsReview] = useState(false)
    const [form] = Form.useForm()
    const carouselRef = useRef<any>(null);

    return (
        <TestContext.Provider
            value={{
                questions,
                setQuestions,
                test,
                setTest,
                testAttempt,
                setTestAttempt,
                carouselRef,
                currentIndex,
                setCurrentIndex,
                totalQuestion,
                setTotalQuestion,
                form,
                attemptQuestion,
                setAttemptQuestion,
                questionAttempts,
                setQuestionAttempts,
                isFlagged,
                setIsFlagged,
                isComprehension,
                setIsComprehension,
                isReview,
                setIsReview
            }}
        >
            {children}
        </TestContext.Provider>
    );
};

export const useTestContext = (): TestContextType => {
    const context = useContext(TestContext);
    if (!context) {
        throw new Error('useTestContext must be used within a TestProvider');
    }
    return context;
};
