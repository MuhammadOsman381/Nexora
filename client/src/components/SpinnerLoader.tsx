const SpinnerLoader = ({ color, size }: { color: string, size: string }) => {
    return (
        <div className="flex items-center justify-center">
            <svg
                className={`animate-spin h-${size} w-${size} text-${color}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
            >
                <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                ></circle>
                <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                ></path>
            </svg>
        </div>
    );
};

export default SpinnerLoader;