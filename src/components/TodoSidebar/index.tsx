import React, { useState } from 'react'
import { Menu } from 'antd';
import Link from 'next/link';
import Search from 'antd/es/input/Search';
import "./style.css"
import { TodoType } from '@/lib/types';
import { useAppSelector } from '@/redux/hooks';
import { RootState } from '@/redux/store';

export default function TodoSidebar({ fetchTasks, showCounts }: any) {
    const [searchValue, setSearchValue] = useState('');
    const statusCount = useAppSelector((state: RootState) => state.todoReducer.todo) as unknown as TodoType[];

    const handleSearch = (value: any) => {
        setSearchValue(value);
        fetchTasks({ searchQuery: value });
    };

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSearchValue(value);
        fetchTasks({ searchQuery: value });
    };

    const itemGroupStyle = {
        fontSize: '16px',
        fontWeight: 'bold',
    };

    const taskCount = showCounts?.length || 0;
    const pendingCount = showCounts?.filter((task: TodoType) => task.status === 'pending').length || 0;
    const inProgressCount = showCounts?.filter((task: TodoType) => task.status === 'in_progress').length || 0;
    const completedCount = showCounts?.filter((task: TodoType) => task.status === 'completed').length || 0;
    const expiredCount = showCounts?.filter((task: TodoType) => task.status === 'expired').length || 0;
    const personalCount = showCounts?.filter((task: TodoType) => task.category === 'personal').length || 0;
    const workCount = showCounts?.filter((task: TodoType) => task.category === 'work').length || 0;
    const healthCount = showCounts?.filter((task: TodoType) => task.category === 'health_and_fitness').length || 0;
    const dailygoalCount = showCounts?.filter((task: TodoType) => task.category === 'daily_goals').length || 0;
    return (
        <>
            <Search
                placeholder="Search Task Here"
                allowClear
                style={{ marginBottom: '16px', marginTop: '16px' }}
                onSearch={handleSearch}
                onChange={handleChange}
                maxLength={20}
                className='searchBar'
            />
            <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.ItemGroup key="taskGroup" title={<span style={itemGroupStyle}>Tasks </span>}>
                    <Menu.Item key="1">
                        <Link href="#" onClick={() => fetchTasks({ status: '' })}>All Task ({taskCount})</Link>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Link href="#" onClick={() => fetchTasks({ status: 'pending' })}>Pending ({pendingCount})</Link>
                    </Menu.Item>
                    <Menu.Item key="3">
                        <Link href="#" onClick={() => fetchTasks({ status: 'in_progress' })}>Progress ({inProgressCount})</Link>
                    </Menu.Item>
                    <Menu.Item key="4">
                        <Link href="#" onClick={() => fetchTasks({ status: 'completed' })}>Completed ({completedCount})</Link>
                    </Menu.Item>
                    <Menu.Item key="9">
                        <Link href="#" onClick={() => fetchTasks({ status: 'expired' })}>Expired  ({expiredCount})</Link>
                    </Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup key="categoryGroup" title={<span style={itemGroupStyle}>Categories</span>}>
                    <Menu.Item key="5">
                        <Link href="#" onClick={() => fetchTasks({ status: '', category: 'personal' })}>Personal ({personalCount})</Link>
                    </Menu.Item>
                    <Menu.Item key="6">
                        <Link href="#" onClick={() => fetchTasks({ status: '', category: 'work' })}>Work ({workCount})</Link>
                    </Menu.Item>
                    <Menu.Item key="7">
                        <Link href="#" onClick={() => fetchTasks({ status: '', category: 'health_and_fitness' })}>Health & Fitness ({healthCount})</Link>
                    </Menu.Item>
                    <Menu.Item key="8">
                        <Link href="#" onClick={() => fetchTasks({ status: '', category: 'daily_goals' })}>Daily Goals ({dailygoalCount})</Link>
                    </Menu.Item>
                </Menu.ItemGroup>
            </Menu>

        </>
    )
}
