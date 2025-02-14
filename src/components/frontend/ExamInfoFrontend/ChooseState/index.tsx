import Link from 'next/link';
import React from 'react';

interface ChooseStateProps {
    activeState: string;
    stateMenu: any[];
    handleStateClick: (title: string, stateId: string) => void;
}

export default function ChooseState({ activeState, stateMenu, handleStateClick }: ChooseStateProps) {
    return (
        <div className="choose-your">
            <div className="your-state">
                <h3 className="title-tertiary color-dark-gray fw-regular">
                    Choose your state
                </h3>
                <ul className="state-link text-center">
                    <li>
                        <span
                            className={activeState === 'All' ? 'active' : ''}
                            onClick={() => handleStateClick('All', 'All')}
                            style={{ cursor: 'pointer' }}
                        >
                            All
                        </span>
                    </li>
                    {stateMenu.map((item) => (
                        <li key={item.key}>
                            <span
                                className={activeState === item.label ? 'active' : ''}
                                onClick={() => handleStateClick(item.label, item.key)}
                                style={{ cursor: 'pointer' }}
                            >
                                {item.label}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
