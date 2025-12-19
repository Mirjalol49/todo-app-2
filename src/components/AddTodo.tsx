import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

interface AddTodoProps {
    onAdd: (title: string) => Promise<void>;
}

export function AddTodo({ onAdd }: AddTodoProps) {
    const [title, setTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        await onAdd(title);
        setTitle('');
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="relative flex items-center">
            <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a new task..."
                className="h-14 rounded-2xl border-none bg-white pl-4 pr-32 shadow-sm ring-1 ring-gray-900/5 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500"
            />
            <div className="absolute right-2">
                <Button
                    type="submit"
                    size="sm"
                    disabled={!title.trim() || isLoading}
                    className="h-10 rounded-xl px-4"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                </Button>
            </div>
        </form>
    );
}
