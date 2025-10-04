"use client";

import { AlertTriangle, Edit2, Lock, UserCheck, UserRound } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FormField } from "./formField";
import { useState } from "react";
import { FieldErrorTypes } from "@repo/types";
import { useUser } from "@/context/user.context";
import { toReadableDate } from "@/utils/formatDate";

const defaultFieldErrors = {
  nameError: "",
  currentPasswordError: "",
  newPasswordError: "",
  confirmPasswordError: "",
};

export default function ProfileForm() {
  const { user } = useUser();

  const [formData, setFormData] = useState({
    name: user?.global_name,
    oldName: user?.global_name,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profileImage: user?.profileImage ?? "/userIcon.svg",
    oldProfileImage: user?.profileImage,
  });

  const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);
  const [fieldError, setFieldError] = useState<Partial<FieldErrorTypes>>(defaultFieldErrors);

  return (
    <div className="h-1/2 bg-gray-800 bg-opacity-90 flex flex-col items-center">
      {/* Header */}
      {/* <UserMenuNav tab={"profile"} name={user.name} /> */}
      {/* {emailModalToggle.isOpen && <EmailVerificationModal onClose={emailModalToggle.toggle} />} */}
      <div className="w-full max-w-4xl bg-white">
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row">
            <div className="flex-1 space-y-6">
              {/* Profile Picture */}
              <div className="relative flex justify-center">
                <div className="relative w-20 h-20 rounded-full bg-purple-700 flex items-center justify-center border-4 border-purple-600">
                  <img
                    src={"/userIcon.svg"}
                    alt="Profile"
                    className="object-cover w-full rounded-full"
                  />
                  <button className="absolute -bottom-1 -right-1 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-100">
                    <Edit2
                      className="left-0 h-7 w-7 p-2 text-gray-800"
                      // onClick={avatarPickToggle.toggle}
                    />
                  </button>
                </div>
                {/* {avatarPickToggle.isOpen && <AvatarPicker />} */}
              </div>
              {/* Email */}
              <div className="mb-6">
                <FormField
                  label="Email Address"
                  name="email"
                  value={user?.email ?? ""}
                  labelStyle="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide"
                  inputStyle="w-full bg-gray-800 rounded px-4 py-3 text-white focus:outline-none"
                  readOnly={true}
                />
              </div>
              {/* Verification Status */}
              {user?.status === "verified" ? (
                // verified
                <div className="mb-6 inline-flex items-center gap-2 border border-pink-300 text-pink-300 px-4 py-2 rounded-full text-md font-medium">
                  <UserCheck className="w-6 h-6" />
                  <span>Verified</span>
                </div>
              ) : (
                // not verified
                <div className="mb-6 bg-gray-900 border border-gray-800 rounded sm:p-4">
                  <div className="flex items-center text-sm">
                    <AlertTriangle className="text-yellow-500 mr-2 h-auto w-10" />
                    <div>
                      <p className="text-white">
                        Your account has not been verified.
                        <button
                          className="text-pink-400 cursor-pointer hover:underline"
                          // onClick={sendEmailVerification}
                        >
                          Click here
                        </button>{" "}
                        to send verification email.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* Name */}
              <div className="mb-6 h-20">
                <FormField
                  label="YOUR NAME"
                  name="name"
                  value={user?.global_name ?? ""}
                  // onChangeEvent={handleChange}
                  labelStyle="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide"
                  inputStyle={`w-full bg-gray-800 rounded px-4 py-3 text-white ${fieldError.nameError ? "border border-2 border-red-400 shake" : null}`}
                />
                {/* {fieldError.nameError ?
                    <div className="text-red-400 text-sm">{fieldError.nameError}</div> : null
                  } */}
              </div>
              {/* Join Date */}
              <div className="mb-6 h-20">
                <FormField
                  label="Joined"
                  name="email"
                  value={toReadableDate(user?.createdAt ?? "")}
                  labelStyle="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide"
                  inputStyle="w-full bg-gray-800 rounded px-4 py-3 text-white focus:outline-none"
                  readOnly={true}
                />
              </div>
              {/* Change Password */}
              <div className="mb-6">
                <button
                  className="text-gray-400 text-lg flex items-center hover:text-gray-300 cursor-pointer mb-6"
                  // onClick={() => setShowPasswordFields(!showPasswordFields)}
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Change password
                </button>
                <AnimatePresence initial={false}>
                  {showPasswordFields && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden mt-4"
                    >
                      <div className="space-y-3">
                        <div className="mb-6 h-20">
                          <FormField
                            label="CURRENT PASSWORD"
                            name="currentPassword"
                            type="password"
                            value={formData.currentPassword}
                            // onChangeEvent={handleChange}
                            labelStyle="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide"
                            inputStyle={`w-full bg-gray-800 rounded px-4 py-3 text-white ${fieldError.currentPasswordError ? "border border-2 border-red-400 shake" : null}`}
                          />
                          {fieldError.currentPasswordError ? (
                            <div className="text-red-400 text-sm">
                              {fieldError.currentPasswordError}
                            </div>
                          ) : null}
                        </div>
                        <div className="mb-6 h-20">
                          <FormField
                            label="NEW PASSWORD"
                            name="newPassword"
                            type="password"
                            value={formData.newPassword}
                            // onChangeEvent={handleChange}
                            labelStyle="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide"
                            inputStyle={`w-full bg-gray-800 rounded px-4 py-3 text-white ${fieldError.newPasswordError ? "border border-2 border-red-400 shake" : null}`}
                          />
                          {fieldError.newPasswordError ? (
                            <div className="text-red-400 text-sm">
                              {fieldError.newPasswordError}
                            </div>
                          ) : null}
                        </div>
                        <div className="mb-6 h-20">
                          <FormField
                            label="CONFIRM PASSWORD"
                            name="confirmPassword"
                            type="password"
                            value={formData.confirmPassword}
                            // onChangeEvent={handleChange}
                            labelStyle="block text-gray-400 text-xs font-bold mb-2 uppercase tracking-wide"
                            inputStyle={`w-full bg-gray-800 rounded px-4 py-3 text-white ${fieldError.confirmPasswordError ? "border border-2 border-red-400 shake" : null}`}
                          />
                          {fieldError.confirmPasswordError ? (
                            <div className="text-red-400 text-sm">
                              {fieldError.confirmPasswordError}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Save Button */}
              {/* <Form method="post" action="/user/profile">
                <button
                  className="w-full h-12 bg-pink-300 hover:bg-pink-400 text-gray-900 font-medium py-3 px-4 rounded transition-colors cursor-pointer"
                  value={JSON.stringify(formData)}
                  name="profileFormData"
                  disabled={navigation.formAction === "/user/profile"}
                  onClick={() => {
                    avatarPickToggle.close;
                    setFormData((prev) => ({
                      ...prev,
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    }));
                  }}
                >
                  {navigation.formAction === "/user/profile" ? (
                    <Spinner parentClassName="w-full h-full" spinSize="ml-1 w-5 h-5" />
                  ) : (
                    "Save"
                  )}
                </button>
              </Form> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
