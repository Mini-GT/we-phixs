"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import { FormField } from "../form/formField";
import { CreateCanvas } from "@repo/types";
import { createCanvas } from "api/canvas.service";
import IconButton from "../ui/iconButton";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useSelectedContent } from "@/context/selectedContent.context";
import { validateError } from "@/utils/validate";

export default function CreateCanvasField() {
  const { setSelectedContent } = useSelectedContent();
  const [newCanvas, setNewCanvas] = useState<CreateCanvas>({
    name: "",
    gridSize: "",
  });

  const mutation = useMutation({
    mutationFn: async (newCanvas: CreateCanvas) => {
      const res = createCanvas(newCanvas);
      return res;
    },
    onSuccess: (success) => {
      toast.success(success || "Canvas created successfully");
      setNewCanvas({
        name: "",
        gridSize: "",
      });
      setSelectedContent(null);
    },
    onError: (err) => {
      validateError(err);
    },
  });

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCanvas((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate(newCanvas);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 z-1">
      <FormField
        label="Canvas Name"
        name="name"
        value={newCanvas.name}
        onChangeEvent={handleChange}
        labelStyle="block text-slate-600 text-xs font-bold mb-2 uppercase tracking-wide"
        // inputStyle={`w-full bg-slate-50 rounded-lg px-4 py-3 text-slate-800 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${fieldError.nameError ? "border-2 border-red-400 shake" : "border-slate-200"}`}
      />
      <FormField
        label="Grid Size"
        name="gridSize"
        value={newCanvas.gridSize}
        onChangeEvent={handleChange}
        labelStyle="block text-slate-600 text-xs font-bold mb-2 uppercase tracking-wide"
        // inputStyle={`w-full bg-slate-50 rounded-lg px-4 py-3 text-slate-800 border transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white ${fieldError.nameError ? "border-2 border-red-400 shake" : "border-slate-200"}`}
      />
      <div className="w-full flex justify-center">
        <IconButton
          type="submit"
          disabled={mutation.isPending}
          className="w-full text-center max-w-1/2 border-none hover:scale-95 text-white px-3 py-5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500  cursor-pointer"
        >
          {mutation.isPending ? "Submitting..." : "Submit"}
        </IconButton>
      </div>
    </form>
  );
}
