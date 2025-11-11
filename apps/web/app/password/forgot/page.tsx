"use client";

import { useState } from "react";

// const emailService = new EmailService()

export default function ForgotPasswordPage() {
  const [passFormData, setPassFormData] = useState({
    newPassword: "",
    confirmNewPassword: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassFormData({ ...passFormData, [e.target.name]: e.target.value });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      {/* {messageModal.isOpen && <EmailVerificationModal message={apiMessage} details="" onClose={messageModal.close} />}  */}
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="flex flex-col mb-6 text-md font-bold text-gray-800 gap-1">
          <span>Resetting Password for:</span>
          {/* <span className="font-normal">{email || "example@email.com"}</span> */}
        </div>
        <form method="post" className="space-y-5">
          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <input
              id="password"
              name="newPassword"
              type="password"
              value={passFormData.newPassword}
              onChange={handleChange}
              // className={`mt-2 w-full rounded-lg border ${passErr || notMatch ? "border-red-500" : null} border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Password"
            />
            {/* <div className="absolute text-xs text-red-500 left-1">{passErr || notMatch}</div> */}
          </div>

          <div className="relative">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <input
              id="confirmPassword"
              name="confirmNewPassword"
              type="password"
              value={passFormData.confirmNewPassword}
              onChange={handleChange}
              // className={`mt-2 w-full rounded-lg border ${confirmErr || notMatch ? "border-red-500" : null} border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              placeholder="Password"
            />
            {/* <div className="absolute text-xs text-red-500 left-1">{confirmErr || notMatch}</div> */}
          </div>
          <button
            type="submit"
            // disabled={navigation.state === "submitting"}
            className="w-full rounded-lg bg-indigo-600 px-4 py-2 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {/* {navigation.state === "submitting" ? "Sending..." : "Reset Password"} */}
          </button>
        </form>
      </div>
    </div>
  );
}
