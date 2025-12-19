import { Trash2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

interface Todo {
    id: string;
    title: string;
    is_complete: boolean;
}

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string, is_complete: boolean) => void;
    onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -10 }}
            whileHover={{ scale: 1.01 }}
            className={cn(
                "group flex items-center justify-between rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-gray-200 hover:shadow-md",
                todo.is_complete && "bg-gray-50 opacity-75"
            )}
        >
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onToggle(todo.id, !todo.is_complete)}
                    className={cn(
                        "flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
                        todo.is_complete
                            ? "border-green-500 bg-green-500 text-white"
                            : "border-gray-300 text-transparent hover:border-green-500"
                    )}
                >
                    <CheckCircle className="h-4 w-4" />
                </button>
                <span
                    className={cn(
                        "text-base font-medium transition-all",
                        todo.is_complete ? "text-gray-500 line-through" : "text-gray-900"
                    )}
                >
                    {todo.title}
                </span>
            </div>
            <button
                onClick={() => onDelete(todo.id)}
                className="opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
            >
                <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500" />
            </button>
        </motion.div>
    );
}
