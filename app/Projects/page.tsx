
export default function Project() {
    return (
        <div className = "bg-gray-1000 min-h-screen flex items-center justify-center">
        <div>
            <h1 className = "text-4xl font-bold text-gray-300">Project Page</h1>

            <div className = "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className = "bg-gray-800 p-4 m-4 rounded-lg text-gray-300">
                    
                    <h2 className = "text-2xl font-semibold mb-2">Project 1</h2>
                    <p className = "text-gray-400">Description of Project 1.</p>
                </div>
            </div>

        </div>
        </div>
    );
    }