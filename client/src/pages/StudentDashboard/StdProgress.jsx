import React, { useState, useEffect, useRef } from "react";
import StudentNavbar from "../../components/layouts/StudentNavbar";
import StudentProgressLineChart from "../../components/Charts/StudentProgressLineChart";
import axiosInstance from "../../utils/axiosInstance.js";
import { API_PATHS } from "../../utils/apiPaths";
import "../../index.css";
import "../../student.css";

function StdProgress() {
  const navbarRef = useRef(null);

  const [navbarHeight, setNavbarHeight] = useState(85);
  const [selectedGrade, setSelectedGrade] = useState("");
  const [progressData, setProgressData] = useState([]);
  const [motivationalQuote, setMotivationalQuote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const quotes = [
    "📘 Keep learning, your hard work will pay off!",
    "🚀 Every quiz is a step toward mastery!",
    "💡 Mistakes mean you are trying, and trying means progress.",
    "🔥 Believe in yourself — success follows consistency!",
    "🌟 The expert in anything was once a beginner.",
  ];

  useEffect(() => {
    const updateNavbarHeight = () => {
      if (navbarRef.current) {
        setNavbarHeight(navbarRef.current.offsetHeight);
      }
    };

    updateNavbarHeight();

    window.addEventListener("resize", updateNavbarHeight);

    return () => {
      window.removeEventListener("resize", updateNavbarHeight);
    };
  }, []);

  // Load the logged-in student's current grade
  useEffect(() => {
    const loadStudentGrade = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await axiosInstance.get(API_PATHS.STUDENT.PROGRESS);

        if (!response.data?.success || !response.data?.grade?.name) {
          throw new Error("Student grade could not be loaded.");
        }

        setSelectedGrade(response.data.grade.name);
      } catch (err) {
        console.error("Failed to load student grade:", err);

        setError(
          err.response?.data?.message ||
            "Unable to load your current grade."
        );
      } finally {
        setLoading(false);
      }
    };

    loadStudentGrade();
  }, []);

  // Generate progress only for the student's current grade
  useEffect(() => {
    if (!selectedGrade) {
      return;
    }

    const subjects = [
      "Science",
      "Mathematics",
      "ICT",
      "English",
      "History",
    ];

    const data = subjects.map((subject) => ({
      subject,
      score: Math.floor(60 + Math.random() * 40),
    }));

    setProgressData(data);

    const randomQuote =
      quotes[Math.floor(Math.random() * quotes.length)];

    setMotivationalQuote(randomQuote);
  }, [selectedGrade]);

  const averageMarks =
    progressData.length > 0
      ? (
          progressData.reduce(
            (acc, curr) => acc + curr.score,
            0
          ) / progressData.length
        ).toFixed(1)
      : "0.0";

  const bestEntry =
    progressData.length > 0
      ? progressData.reduce(
          (best, current) =>
            current.score > best.score ? current : best,
          { subject: "", score: 0 }
        )
      : { subject: "", score: 0 };

  return (
    <div className="min-h-screen flex flex-col app-background">
      {/* Navbar */}
      <header
        ref={navbarRef}
        className="w-full fixed top-0 left-0 z-50"
      >
        <StudentNavbar />
      </header>

      {/* Main Content */}
      <main
        className="flex-1 p-8 overflow-y-auto transition-all duration-500"
        style={{ paddingTop: `${navbarHeight + 130}px` }}
      >
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">
          My Progress Tracker
        </h1>

        {/* Current Grade */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-8">
          <span className="text-indigo-700 font-semibold">
            Current Grade:
          </span>

          <div className="px-5 py-3 rounded-xl bg-white border border-indigo-200 shadow-sm text-indigo-700 font-semibold">
            {loading ? "Loading..." : selectedGrade || "Not Assigned"}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-50 border border-red-200 text-red-600">
            {error}
          </div>
        )}

        {/* Motivational Card */}
        {selectedGrade && (
          <div className="motivational-card mb-8">
            <p className="text-lg text-indigo-800 font-semibold text-center">
              {motivationalQuote}
            </p>
          </div>
        )}

        {/* Chart Box */}
        {selectedGrade && (
          <div className="chart-container mb-10">
            <StudentProgressLineChart
              data={progressData}
              grade={selectedGrade}
            />
          </div>
        )}

        {/* Summary Cards */}
        {selectedGrade && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="progress-card bg-white/80 p-6 rounded-xl border border-indigo-100 shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                Average Marks
              </h3>

              <p className="text-3xl font-bold text-indigo-800">
                {averageMarks}%
              </p>
            </div>

            <div className="progress-card bg-white/80 p-6 rounded-xl border border-indigo-100 shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                Best Mark
              </h3>

              <p className="text-2xl font-bold text-green-600">
                {bestEntry.score}% — {bestEntry.subject}
              </p>
            </div>

            <div className="progress-card bg-white/80 p-6 rounded-xl border border-indigo-100 shadow-md hover:shadow-lg transition">
              <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                Keep Going!
              </h3>

              <p className="text-gray-700 leading-relaxed">
                You’re improving steadily! Stay consistent and aim higher
                every week. 🌟
              </p>
            </div>
          </div>
        )}

        {/* Inspiration */}
        {selectedGrade && (
          <div className="mt-12 text-center">
            <h2 className="text-2xl font-bold text-purple-700 mb-4">
              🌈 Progress is not about perfection — it’s about persistence!
            </h2>

            <p className="text-gray-700 text-lg">
              Keep track of your learning journey and celebrate every small
              win. Each quiz brings you one step closer to mastery.
            </p>
          </div>
        )}
      </main>

      <style>{`
        .motivational-card {
          background: linear-gradient(
            90deg,
            rgba(99, 102, 241, 0.1),
            rgba(167, 139, 250, 0.1)
          );
          border-left: 6px solid #6366f1;
          border-radius: 1rem;
          padding: 1rem;
        }

        .chart-container {
          background: white;
          border-radius: 1rem;
          padding: 1rem;
          box-shadow: 0 4px 10px rgba(99, 102, 241, 0.15);
        }
      `}</style>
    </div>
  );
}

export default StdProgress;