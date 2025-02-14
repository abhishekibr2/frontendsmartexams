'use client'
import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAllComplexity, getAllExamType, getAllGrades, getAllSubjects, GetAllTests } from '@/lib/commonApi';
import { Complexity, ExamType, Grade, State, Subject, Test } from '@/lib/types';
import ErrorHandler from '@/lib/ErrorHandler';
import { getAllStates } from '@/lib/adminApi';

interface DataContextType {
    complexity: Complexity[];
    examTypes: ExamType[];
    subjects: Subject[];
    grades: Grade[];
    tests: Test[];
    loading: boolean;
    getComplexity: () => void;
    getExamType: () => void;
    getSubjects: () => void;
    getGrade: () => void;
    richTextLength?: number;
    setRichTextLength: (length: number) => void;
    richTextLoading: boolean;
    setRichTextLoading: (loading: boolean) => void;
    states: State[];
    getStates: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [complexity, setComplexity] = useState<Complexity[]>([]);
    const [examTypes, setExamTypes] = useState<ExamType[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [tests, setTests] = useState<Test[]>([])
    const [states, setStates] = useState<State[]>([])
    const [richTextLength, setRichTextLength] = useState(0)
    const [richTextLoading, setRichTextLoading] = useState(false)

    const getComplexity = async () => {
        try {
            const res = await getAllComplexity();
            if (res.status === true) {
                setComplexity(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const getExamType = async () => {
        try {
            const response = await getAllExamType();
            setExamTypes(response.data.reverse());
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const getSubjects = async () => {
        try {
            const res = await getAllSubjects();
            if (res.status === true) {
                setSubjects(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const getGrade = async () => {
        try {
            const res = await getAllGrades();
            if (res.status === true) {
                setGrades(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const getAllTest = async () => {
        try {
            const res = await GetAllTests();
            if (res.success === true) {
                setTests(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    const getStates = async () => {
        try {
            const res = await getAllStates();
            if (res.status === true) {
                setStates(res.data);
            }
        } catch (error) {
            ErrorHandler.showNotification(error);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                await Promise.all([getComplexity(), getExamType(), getSubjects(), getGrade(), getAllTest(), getStates()]);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <DataContext.Provider
            value={{
                complexity,
                examTypes,
                subjects,
                grades,
                loading,
                getComplexity,
                getExamType,
                getSubjects,
                getGrade,
                tests,
                richTextLength,
                setRichTextLength,
                richTextLoading,
                setRichTextLoading,
                states,
                getStates,
            }}
        >
            {children}
        </DataContext.Provider>
    );
};

export const useDataContext = (): DataContextType => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useDataContext must be used within a DataProvider');
    }
    return context;
};
