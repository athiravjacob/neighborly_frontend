import { useState } from "react";
import { resetPassword } from "../../../api/apiRequests";

export const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = new URLSearchParams(window.location.search).get("token") || "";

    async function handleResetPassword(event: React.FormEvent): Promise<void> {
        event.preventDefault();
        setError(null);

        if (!newPassword || !confirmPassword) {
            setError("Please fill in both password fields");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Basic password strength check
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            return;
        }

        if (!token) {
            setError("Invalid or missing reset token");
            return;
        }

        setIsLoading(true);
        try {
            await resetPassword(token, newPassword);
            setIsSuccess(true);
        } catch (error: any) {
            setIsLoading(false);
            setError(error.message || "Failed to reset password. The link may have expired.");
        }
    }

    return (
        <div className="min-h-screen w-full bg-gray-50 p-6">
            {/* Logo in Top Left */}
            <div className="max-w-7xl">
                <h1 className="text-3xl font-bold text-violet-950 tracking-tight">
                    Neighborly
                </h1>
            </div>

            {/* Main Content */}
            <div className="max-w-md mx-auto mt-12 space-y-8">
                {/* Header Section */}
                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-semibold text-gray-900">
                        Set New Password
                    </h2>
                    <p className="text-gray-600 text-sm">
                        {isSuccess
                            ? "Your password has been successfully reset"
                            : "Enter your new password below"}
                    </p>
                </div>

                {/* Form Section */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    {isSuccess ? (
                        <div className="text-center space-y-4">
                            <div className="flex justify-center">
                                <svg
                                    className="w-12 h-12 text-violet-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <p className="text-gray-600">
                                You can now log in with your new password.
                            </p>
                            <a
                                href="/login"
                                className="inline-block bg-violet-600 text-white py-2 px-4 rounded-lg 
                                    hover:bg-violet-700 transition-colors duration-200 font-medium"
                            >
                                Go to Login
                            </a>
                        </div>
                    ) : (
                        <>
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                                    {error}
                                </div>
                            )}
                            <form className="space-y-6" onSubmit={handleResetPassword}>
                                <div className="space-y-2">
                                    <label
                                        htmlFor="newPassword"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        New Password
                                    </label>
                                    <input
                                        id="newPassword"
                                        type="password"
                                        value={newPassword}
                                        placeholder="Enter new password"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                                            focus:ring-2 focus:ring-violet-500 focus:border-transparent 
                                            placeholder-gray-400 transition-all duration-200"
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label
                                        htmlFor="confirmPassword"
                                        className="block text-sm font-medium text-gray-700"
                                    >
                                        Confirm Password
                                    </label>
                                    <input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        placeholder="Confirm new password"
                                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg 
                                            focus:ring-2 focus:ring-violet-500 focus:border-transparent 
                                            placeholder-gray-400 transition-all duration-200"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-violet-600 text-white py-2.5 px-4 rounded-lg 
                                        hover:bg-violet-700 focus:outline-none focus:ring-2 
                                        focus:ring-violet-500 focus:ring-offset-2 
                                        transition-colors duration-200 font-medium disabled:bg-violet-400 
                                        disabled:cursor-not-allowed flex items-center justify-center"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg
                                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                                                />
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                />
                                            </svg>
                                            Resetting...
                                        </>
                                    ) : (
                                        "Reset Password"
                                    )}
                                </button>
                            </form>

                            <p className="mt-4 text-center text-sm text-gray-600">
                                Remember your password?{" "}
                                <a
                                    href="/login"
                                    className="text-violet-600 hover:text-violet-800 
                                        font-medium transition-colors duration-200"
                                >
                                    Back to Login
                                </a>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};