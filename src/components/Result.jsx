import { useLocation, useNavigate } from "react-router-dom"
import { CheckCircle, XCircle, ArrowLeft } from "lucide-react"

export default function Result() {
  const location = useLocation()
  const navigate = useNavigate()
  const data = location.state

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold mb-4">Analysis Result</h1>
          <p className="text-sm sm:text-base">No analysis result found. Please run an analysis first.</p>
          <button
            onClick={() => navigate("/analyze")}
            className="mt-4 px-6 py-2 bg-[#10e956] text-black rounded hover:bg-[#0ef052] text-sm sm:text-base"
          >
            Go to Analyze
          </button>
        </div>
      </div>
    )
  }

  // Verdict
  const finalVerdict = data.verdict
  const isCredible = finalVerdict === "Credible"

  // --- Improved analysis splitting ---
  const analysisText = data.analysis || ""
  // Split by newlines OR inline numbering like "1. "
  const analysisParts = analysisText
    .split(/(?:\n+|\s*\d+\.\s+)/)
    .map(line => line.trim())
    .filter(Boolean)

  const isNumberedList = /\d+\.\s/.test(analysisText)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Back Button */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate("/analyze")}
            className="p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl sm:text-2xl font-bold">Analysis Result</h1>
        </div>

        {/* Container with credibility bar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          {/* Vertical/Horizontal credibility bar */}
          <div
            className={`w-full sm:w-2 h-2 sm:h-auto rounded-lg ${
              isCredible ? "bg-green-500" : "bg-red-500"
            }`}
          />

          {/* Main content */}
          <div className="flex-1 space-y-4 sm:space-y-6 min-w-0">
            {/* Score + Verdict - Mobile First */}
            <div className="flex items-center gap-3 bg-gray-800 p-4 rounded-lg">
              {isCredible ? (
                <CheckCircle className="text-green-500 w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              ) : (
                <XCircle className="text-red-500 w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-base sm:text-lg font-semibold">
                  Credibility Score:{" "}
                  <span
                    className={isCredible ? "text-green-400" : "text-red-400"}
                  >
                    {data.score}%
                  </span>
                </p>
                <p
                  className={`text-xs sm:text-sm ${
                    isCredible ? "text-green-400" : "text-red-400"
                  }`}
                >
                  Verdict: {finalVerdict}
                </p>
              </div>
            </div>

            {/* Original Content */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#10e956] mb-2">
                Original Content:
              </h2>
              <div className="whitespace-pre-line text-xs sm:text-sm bg-gray-800 p-3 sm:p-4 rounded break-words overflow-wrap-anywhere">
                {data.text}
              </div>
            </div>

            {/* Summary */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#10e956] mb-2">
                AI Summary:
              </h2>
              <div className="whitespace-pre-line text-xs sm:text-sm bg-gray-800 p-3 sm:p-4 rounded break-words">
                {data.summary}
              </div>
            </div>

            {/* Analysis */}
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-[#10e956] mb-2">
                AI Analysis:
              </h2>
              <div className="bg-gray-800 p-3 sm:p-4 rounded text-xs sm:text-sm leading-relaxed">
                {isNumberedList ? (
                  <ol className="list-decimal list-inside space-y-2 sm:space-y-3">
                    {analysisParts.map((item, idx) => (
                      <li key={idx} className="break-words">{item}</li>
                    ))}
                  </ol>
                ) : (
                  analysisParts.map((line, idx) => (
                    <p key={idx} className="mb-2 sm:mb-3 break-words">{line}</p>
                  ))
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <button
                onClick={() => navigate("/analyze")}
                className="w-full sm:w-auto px-6 py-3 bg-[#10e956] text-black rounded-lg font-medium hover:bg-[#0ef052] transition-all duration-200"
              >
                Analyze Another
              </button>
              <button
                onClick={() => navigate("/history")}
                className="w-full sm:w-auto px-6 py-3 bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-600 transition-all duration-200"
              >
                View History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}