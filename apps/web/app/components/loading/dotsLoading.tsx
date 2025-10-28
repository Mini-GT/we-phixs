export default function DotsLoader() {
  return (
    <div className="flex items-center justify-center gap-1">
      <div className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"></div>
      <div
        className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"
        style={{ animationDelay: "0.1s" }}
      ></div>
      <div
        className="w-2 h-2 bg-gray-900 rounded-full animate-bounce"
        style={{ animationDelay: "0.2s" }}
      ></div>
    </div>
  );
}
