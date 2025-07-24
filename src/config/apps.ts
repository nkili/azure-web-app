import { AppOption } from '../components/app-menu';

export const availableApps: AppOption[] = [
  {
    id: 'dangerous-writing',
    name: 'Dangerous Writing',
    description: 'A writing challenge that keeps you typing. Stop for too long and lose your progress!',
    icon: '✍️',
    category: 'Productivity',
  },
  {
    id: 'task-prioritizer',
    name: 'Task Prioritizer',
    description: 'Use the Swiss System tournament format to prioritize your tasks through head-to-head comparisons.',
    icon: '🎯',
    category: 'Productivity',
  },
  {
    id: 'task-manager',
    name: 'Task Manager',
    description: 'Organize your daily tasks with a sleek, intuitive interface.',
    icon: '📋',
    category: 'Productivity',
    isComingSoon: true,
  },
  {
    id: 'weather-dashboard',
    name: 'Weather Dashboard',
    description: 'Check the weather with beautiful visualizations and forecasts.',
    icon: '🌤️',
    category: 'Utilities',
    isComingSoon: true,
  },
  {
    id: 'expense-tracker',
    name: 'Expense Tracker',
    description: 'Track your expenses and manage your budget with smart insights.',
    icon: '💰',
    category: 'Finance',
    isComingSoon: true,
  },
  {
    id: 'habit-tracker',
    name: 'Habit Tracker',
    description: 'Build better habits with streak tracking and motivational insights.',
    icon: '🎯',
    category: 'Health & Wellness',
    isComingSoon: true,
  },
  {
    id: 'note-taking',
    name: 'Note Taking',
    description: 'Create, organize, and search through your notes with markdown support.',
    icon: '📝',
    category: 'Productivity',
    isComingSoon: true,
  },
];
