import React, { useEffect, useRef, useState } from "react";
import { CheckCircle, Send } from "lucide-react";
import { NewErrorsType } from "@repo/types";
import { useMutation } from "@tanstack/react-query";
import { createReport } from "api/reports.service";
import { displayError } from "@/utils/displayError";
import { toast } from "react-toastify";

export default function ReportForm() {
  const [formData, setFormData] = useState({
    category: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errors, setErrors] = useState<Partial<NewErrorsType>>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const categories = ["Bug Report", "Feature Request", "Other"];

  const validateForm = () => {
    const newErrors: Partial<NewErrorsType> = {};

    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const mutation = useMutation({
    mutationFn: createReport,
    onSuccess: (data) => {
      setFormData({ category: "", subject: "", message: "" });
      setStatus(data);
      toast.success("Report submitted successfully");

      timeoutRef.current = setTimeout(() => setStatus("idle"), 5000);
    },
    onError: (err) => {
      displayError(err);
    },
  });

  const handleSubmit = () => {
    if (!validateForm()) return;

    mutation.mutate({ ...formData });
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name as Exclude<keyof typeof formData, "userId">;
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <div className="w-full mx-auto">
      {/* Header */}

      {/* Form Fields */}
      <div className="space-y-6">
        {/* Category */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
            Category *
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.category ? "border-red-300 bg-red-50" : "border-slate-300"
            }`}
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-slate-700 mb-2">
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Brief description of the issue"
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition ${
              errors.subject ? "border-red-300 bg-red-50" : "border-slate-300"
            }`}
          />
          {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
        </div>

        {/* Message */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={6}
            maxLength={1000}
            placeholder="Please provide detailed information about your report..."
            className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none ${
              errors.message ? "border-red-300 bg-red-50" : "border-slate-300"
            }`}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.message ? (
              <p className="text-sm text-red-600">{errors.message}</p>
            ) : (
              <p className="text-sm text-slate-500">{formData.message.length} characters</p>
            )}
          </div>
        </div>

        {/* Success Message */}
        {status === "success" && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-green-800">Report submitted successfully!</p>
              <p className="text-sm text-green-700 mt-1">
                Thank you for your feedback. We'll review it shortly.
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-medium py-3 px-6 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {mutation.isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Submit Report
            </>
          )}
        </button>
      </div>

      {/* Footer Note */}
      <p className="mt-6 text-xs text-slate-500 text-center">All reports are reviewed carefully.</p>
    </div>
  );
}
