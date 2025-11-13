import React, { useState, useContext } from 'react';
import { UserContext } from '../contexts/UserContext';
import { DailyTask } from '../types';

const TASKS_DATA: DailyTask[] = [
    { id: 't1', title: 'Browse for 15 minutes', description: 'Use the browser actively for a total of 15 minutes today.', difficulty: 'Easy', rewardRobux: 0.2, rewardUsd: 0.02, rewardXp: 20 },
    { id: 't2', title: 'Perform 5 Searches', description: 'Use the AI search feature 5 times.', difficulty: 'Easy', rewardRobux: 0.3, rewardUsd: 0.03, rewardXp: 30 },
    { id: 't3', title: 'Visit 3 Partner Sites', description: 'Click and open at least 3 suggested sites from the AI search results.', difficulty: 'Medium', rewardRobux: 0.7, rewardUsd: 0.05, rewardXp: 75 },
    { id: 't4', title: 'Watch a Video Ad', description: 'Watch a short promotional video.', difficulty: 'Medium', rewardRobux: 1.0, rewardUsd: 0.10, rewardXp: 100 },
    { id: 't5', title: 'Invite a Friend', description: 'Successfully refer a new user with your referral link.', difficulty: 'Hard', rewardRobux: 5.0, rewardUsd: 0.50, rewardXp: 500 },
];

const getDifficultyClass = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
        case 'Easy': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'Medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
        case 'Hard': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
};

const TaskCard: React.FC<{ task: DailyTask, onComplete: (task: DailyTask) => void, isCompleted: boolean }> = ({ task, onComplete, isCompleted }) => (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-3">
        <div className="flex justify-between items-start">
            <div>
                <h3 className="font-bold text-md">{task.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{task.description}</p>
            </div>
            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getDifficultyClass(task.difficulty)}`}>{task.difficulty}</span>
        </div>
        <div className="flex justify-between items-center mt-3">
            <div className="flex space-x-3 text-xs">
                <span className="font-bold text-green-500">+{task.rewardRobux} R$</span>
                <span className="font-bold text-blue-500">+{task.rewardXp} XP</span>
                <span className="font-bold text-yellow-500">+{task.rewardUsd.toFixed(2)}$</span>
            </div>
            <button 
                onClick={() => onComplete(task)}
                disabled={isCompleted}
                className="bg-gray-800 text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed"
            >
                {isCompleted ? 'Completed' : 'Complete'}
            </button>
        </div>
    </div>
);


const TasksTab: React.FC = () => {
    const { user, updateUser } = useContext(UserContext);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    const handleCompleteTask = (task: DailyTask) => {
        if (!user || completedTasks.includes(task.id)) return;

        updateUser({
            balanceRobux: user.balanceRobux + task.rewardRobux,
            balanceUSD: user.balanceUSD + task.rewardUsd,
            experience: user.experience + task.rewardXp,
            tasksCompleted: user.tasksCompleted + 1,
        });

        setCompletedTasks(prev => [...prev, task.id]);
    };

    const tasksCompletedCount = completedTasks.length;
    const totalTasks = TASKS_DATA.length;
    const dailyProgress = (tasksCompletedCount / totalTasks) * 100;

    return (
        <div className="p-4 bg-white dark:bg-black text-black dark:text-white h-full overflow-y-auto">
            <header className="mb-4">
                <h1 className="text-3xl font-bold">Daily Tasks</h1>
                <p className="text-gray-500 dark:text-gray-400">Complete tasks to earn rewards and XP.</p>
            </header>

            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-xl mb-6">
                <div className="flex justify-between items-center mb-1">
                    <p className="font-bold">Daily Progress</p>
                    <p className="text-xs text-gray-400">{tasksCompletedCount} / {totalTasks} Completed</p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${dailyProgress}%` }}></div>
                </div>
            </div>

            <div>
                {TASKS_DATA.map(task => (
                    <TaskCard 
                        key={task.id} 
                        task={task} 
                        onComplete={handleCompleteTask} 
                        isCompleted={completedTasks.includes(task.id)}
                    />
                ))}
            </div>
        </div>
    );
};

export default TasksTab;
