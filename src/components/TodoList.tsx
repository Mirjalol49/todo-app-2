import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { TodoItem } from './TodoItem';
import { AddTodo } from './AddTodo';
import { Loader2, LogOut } from 'lucide-react';
import { Button } from './ui/Button';
import { AnimatePresence, motion } from 'framer-motion';

interface Todo {
    id: string;
    title: string;
    is_complete: boolean;
    user_id: string;
    created_at: string;
}

type FilterType = 'all' | 'active' | 'completed';

export function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<FilterType>('all');

    useEffect(() => {
        fetchTodos();
    }, []);

    const fetchTodos = async () => {
        try {
            const { data, error } = await supabase
                .from('todos')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setTodos(data || []);
        } catch (error) {
            console.error('Error fetching todos:', error);
        } finally {
            setLoading(false);
        }
    };

    const addTodo = async (title: string) => {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const { data, error } = await supabase
                .from('todos')
                .insert([{ title, user_id: user.id }])
                .select()
                .single();

            if (error) throw error;
            setTodos([data, ...todos]);
        } catch (error) {
            console.error('Error adding todo:', error);
        }
    };

    const toggleTodo = async (id: string, is_complete: boolean) => {
        try {
            // Optimistic update
            setTodos(
                todos.map((todo) =>
                    todo.id === id ? { ...todo, is_complete } : todo
                )
            );

            const { error } = await supabase
                .from('todos')
                .update({ is_complete })
                .eq('id', id);

            if (error) {
                // Revert on error
                setTodos(
                    todos.map((todo) =>
                        todo.id === id ? { ...todo, is_complete: !is_complete } : todo
                    )
                );
                throw error;
            }
        } catch (error) {
            console.error('Error updating todo:', error);
        }
    };

    const deleteTodo = async (id: string) => {
        try {
            // Optimistic update
            const previousTodos = [...todos];
            setTodos(todos.filter((todo) => todo.id !== id));

            const { error } = await supabase.from('todos').delete().eq('id', id);

            if (error) {
                setTodos(previousTodos);
                throw error;
            }
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    const filteredTodos = todos.filter((todo) => {
        if (filter === 'active') return !todo.is_complete;
        if (filter === 'completed') return todo.is_complete;
        return true;
    });

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                        My Tasks
                    </h1>
                    <p className="mt-2 text-gray-500">
                        {todos.filter((t) => !t.is_complete).length} tasks remaining
                    </p>
                </div>
                <Button variant="ghost" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                </Button>
            </div>

            <div className="mb-8">
                <AddTodo onAdd={addTodo} />
            </div>

            <div className="mb-6 flex gap-2">
                {(['all', 'active', 'completed'] as FilterType[]).map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${filter === f
                                ? 'bg-gray-900 text-white'
                                : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                            }`}
                    >
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                ))}
            </div>

            <motion.div layout className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {filteredTodos.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={toggleTodo}
                            onDelete={deleteTodo}
                        />
                    ))}
                </AnimatePresence>
                {filteredTodos.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="py-12 text-center"
                    >
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                            <CheckCircle className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900">
                            No tasks found
                        </h3>
                        <p className="mt-1 text-gray-500">
                            {filter === 'all'
                                ? "You haven't created any tasks yet."
                                : `No ${filter} tasks found.`}
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

function CheckCircle(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}
