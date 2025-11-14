import { DescriptionProps } from "@repo/types";

export default function DescriptionComponent({
  description,
  guildLeaderId,
  guildId,
  setDescription,
  descriptionToggle,
  descriptionData,
  descriptionMutate,
}: DescriptionProps) {
  return (
    <div className="absolute flex items-center justify-center h-full w-full">
      <div className="absolute bg-white border border-cyan-300 rounded-lg shadow-lg p-4 w-[80%] z-50">
        <h3 className="text-sm font-semibold mb-2 text-gray-700">Edit Description</h3>
        <textarea
          value={description!}
          placeholder="No Description"
          onChange={(e) => setDescription(e.target.value)}
          className="w-full resize-y border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500 text-sm"
          maxLength={300}
          rows={9}
          autoFocus
        />
        <div className="flex justify-end gap-2 mt-3">
          <button
            onClick={() => {
              setDescription(descriptionData || "No description");
              descriptionToggle.close();
            }}
            className="w-17 px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() =>
              descriptionMutate.mutate({ leaderId: guildLeaderId, guildId, description })
            }
            className="w-17 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
