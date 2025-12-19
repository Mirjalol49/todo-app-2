import { AlertCircle } from 'lucide-react';

export function SetupRequired() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-xl ring-1 ring-gray-900/5 text-center">
                <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50">
                    <AlertCircle className="h-8 w-8 text-indigo-600" />
                </div>
                <h1 className="mb-4 text-2xl font-bold text-gray-900">Setup Required</h1>
                <p className="mb-6 text-gray-600">
                    Your app is running, but it's missing the connection to Supabase.
                </p>

                <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left font-mono text-sm leading-relaxed text-gray-700">
                    <p className="font-bold text-gray-900 mb-2">1. Open .env file:</p>
                    <p>
                        VITE_SUPABASE_URL=...<br />
                        VITE_SUPABASE_ANON_KEY=...
                    </p>
                </div>

                <p className="text-sm text-gray-500">
                    Update the <code>.env</code> file with your credentials from the Supabase dashboard and restart the server.
                </p>
            </div>
        </div>
    );
}
