"use client";

import { AlertTriangle, Check, Edit2, Lock, UserCheck, UserRound, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { FormField } from "./formField";
import { ChangeEvent, useState } from "react";
import { FieldErrorTypes } from "@repo/types";
import { useUser } from "@/context/user.context";
import { toReadableDate } from "@/utils/formatDate";
import Image from "next/image";
import Link from "next/link";

const defaultFieldErrors = {
  nameError: "",
  currentPasswordError: "",
  newPasswordError: "",
  confirmPasswordError: "",
};

export default function ProfileForm() {
  const { user } = useUser();
  const [fieldError, setFieldError] = useState<Partial<FieldErrorTypes>>(defaultFieldErrors);
  const [showPasswordFields, setShowPasswordFields] = useState<boolean>(false);

  if (!user) return <div>Couldn't load user data</div>;

  const [formData, setFormData] = useState({
    name: user.global_name,
    oldName: user.global_name,
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    profileImage: user?.profileImage ?? "/userIcon.svg",
    oldProfileImage: user?.profileImage,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const profileImage = () => {
    if (user.profileImage) return user.profileImage;
    if (user.avatar && user.discordId)
      return `https://cdn.discordapp.com/avatars/${user.discordId}/${user.avatar}?size=1024`;
    return "/userIcon.svg";
  };

  return (
    <div className="h-[650px]">
      {/* Avatar */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 via-cyan-500 to-blue-600 p-1">
            <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
              <Image
                width={1024}
                height={1024}
                src={profileImage()}
                alt="Avatar"
                className="w-full h-full"
              />
            </div>
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center hover:from-blue-600 hover:to-cyan-600 transition-all shadow-lg">
            <Edit2 size={16} className="text-white" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        {/* Name */}
        <FormField
          label="YOUR NAME"
          name="name"
          value={user.global_name}
          onChangeEvent={handleChange}
          labelStyle="block text-slate-600 text-xs font-bold mb-2 uppercase tracking-wide"
          inputStyle={`w-full bg-slate-50 rounded-lg px-4 py-3 text-slate-800 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${fieldError.nameError ? "border-2 border-red-400 shake" : "border-slate-200"}`}
        />

        {/* Warning */}
        {!user.discordId ? (
          <div className="bg-amber-50 border-l-4 border-amber-500 rounded-lg p-4 flex items-start gap-3">
            <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
            <div className="text-sm">
              <span className="text-slate-700">Your account is not connected to Discord.</span>
              <Link href={`${process.env.NEXT_PUBLIC_discordRedirect}`}>
                <span className="text-blue-600 hover:text-blue-700 ml-1 font-medium transition-colors hover:underline hover:cursor-pointer">
                  Click here
                </span>
              </Link>
              <span className="text-slate-700"> to connect Discord.</span>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-2 bg-[#EBEDFB] border border-[#7983F5] text-[#5865F2] px-4 py-2 rounded-full text-md font-medium">
            <Check size={24} className="w-5" />
            <Image
              src="/imgs/discord.png"
              alt="Discord Logo"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span>Connected to Discord</span>
          </div>
        )}

        <div className="mb-6 space-y-2 px-1">
          <FormField
            label="DISCORD USERNAME"
            name="discordUsername"
            value={user.username}
            onChangeEvent={handleChange}
            labelStyle="block text-slate-600 text-xs font-bold mb-2 uppercase tracking-wide"
            inputStyle={`w-full bg-slate-50 rounded-lg px-4 py-3 text-slate-800 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${fieldError.nameError ? "border-2 border-red-400 shake" : "border-slate-200"}`}
          />
          {/* Email */}
          <div className="mb-4 px-1">
            <FormField
              label="Email Address"
              name="email"
              value={user.email}
              labelStyle="block text-slate-600 text-xs font-bold mb-2 uppercase tracking-wide"
              inputStyle="w-full bg-slate-50 rounded-lg px-4 py-3 text-slate-800 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              readOnly={true}
            />
          </div>
        </div>

        {/* Join Date */}
        <div className="mb-6 h-20 px-1">
          <FormField
            label="Joined"
            name="joined"
            value={toReadableDate(user.createdAt)}
            labelStyle="block text-slate-600 text-xs font-bold mb-2 uppercase tracking-wide"
            inputStyle="w-full bg-slate-100 rounded-lg px-4 py-3 text-slate-500 border border-slate-200 focus:outline-none cursor-not-allowed"
            readOnly={true}
          />
        </div>

        <div className="mb-6">
          <button
            className="text-slate-600 text-lg flex items-center hover:text-blue-600 cursor-pointer mb-6 transition-colors"
            onClick={() => setShowPasswordFields(!showPasswordFields)}
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
                <div className="space-y-3 px-1 mt-4">
                  <div className="mb-4 h-20">
                    <FormField
                      label="CURRENT PASSWORD"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChangeEvent={handleChange}
                      labelStyle="block text-slate-600 text-xs font-bold mb-2 uppercase tracking-wide"
                      inputStyle={`w-full bg-slate-50 rounded-lg px-4 py-3 text-slate-800 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${fieldError.currentPasswordError ? "border-2 border-red-400 shake" : "border-slate-200"}`}
                    />
                    {fieldError.currentPasswordError ? (
                      <div className="text-red-500 text-sm mt-1">
                        {fieldError.currentPasswordError}
                      </div>
                    ) : null}
                  </div>
                  <div className="mb-4 h-20">
                    <FormField
                      label="NEW PASSWORD"
                      name="newPassword"
                      type="password"
                      value={formData.newPassword}
                      onChangeEvent={handleChange}
                      labelStyle="block text-slate-600 text-xs font-bold mb-2 uppercase tracking-wide"
                      inputStyle={`w-full bg-slate-50 rounded-lg px-4 py-3 text-slate-800 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${fieldError.newPasswordError ? "border-2 border-red-400 shake" : "border-slate-200"}`}
                    />
                    {fieldError.newPasswordError ? (
                      <div className="text-red-500 text-sm mt-1">{fieldError.newPasswordError}</div>
                    ) : null}
                  </div>
                  <div className="h-20">
                    <FormField
                      label="CONFIRM PASSWORD"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChangeEvent={handleChange}
                      labelStyle="block text-slate-600 text-xs font-bold mb-2 uppercase tracking-wide"
                      inputStyle={`w-full bg-slate-50 rounded-lg px-4 py-3 text-slate-800 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${fieldError.confirmPasswordError ? "border-2 border-red-400 shake" : "border-slate-200"}`}
                    />
                    {fieldError.confirmPasswordError ? (
                      <div className="text-red-500 text-sm mt-1">
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
        <button
          className={`w-full h-12 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-blue-500/30 cursor-pointer ${showPasswordFields && "mb-6"}`}
        >
          Save
        </button>
      </div>
    </div>
  );
}
