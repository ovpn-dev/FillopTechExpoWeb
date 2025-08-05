// cbtApp.tsx - Updated Main App with Authentication Integration
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import Sidebar from "./components/Sidebar";
import TopBar from "./components/TopBar";
import { useAuth } from "./contexts/AuthContext";
import Dashboard from "./screens/Dashboard";
import ExamScreen from "./screens/ExamScreen";
import InstructionScreen from "./screens/InstructionScreen";
import ResultScreen from "./screens/ResultScreen";

export type ExamMode = "TIMED" | "UNTIMED" | "STUDY" | "NEWS";
export type ExamType = "JAMB" | "WAEC" | "NECO" | "NABTEB" | "OTHER";
export type AppScreen = "dashboard" | "instructions" | "exam" | "results";

export interface ExamConfig {
  mode: ExamMode;
  examType: ExamType;
  subjects: string[];
  source: string;
  duration: { minutes: number; seconds: number };
  numberOfQuestions: number;
  totalTime: number;
}

export interface Question {
  id: string;
  subject: string;
  text: string;
  options: string[];
  correctAnswer: string;
}

export interface ExamResults {
  score: number;
  totalQuestions: number;
  timeUsed: number;
  subjectBreakdown: { [subject: string]: { correct: number; total: number } };
  answers: { [questionId: string]: string };
}

// Main CBT App Component (wrapped with auth)
const CBTAppContent: React.FC = () => {
  const router = useRouter();
  const { authState, logout } = useAuth();

  const [currentScreen, setCurrentScreen] = useState<AppScreen>("dashboard");
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [currentSubject, setCurrentSubject] = useState<string>("");
  const [currentQuestionInSubject, setCurrentQuestionInSubject] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{
    [questionId: string]: string;
  }>({});
  const [examStartTime, setExamStartTime] = useState<number | null>(null);

  // Check authentication on component mount
  useEffect(() => {
    if (!authState.isAuthenticated) {
      console.log("User not authenticated, redirecting to login");
      router.push("/");
    }
  }, [authState.isAuthenticated, router]);

  // Handle logout from sidebar
  const handleLogout = async () => {
    await logout();
    // Reset all exam state
    setCurrentScreen("dashboard");
    setExamConfig(null);
    setExamResults(null);
    setUserAnswers({});
    setCurrentQuestionInSubject(0);
    setCurrentSubject("");
    setExamStartTime(null);
    // Navigate back to login
    router.push("/");
  };

  // Helper function to check if timer should be used
  const shouldUseTimer = (mode: ExamMode): boolean => {
    return mode === "TIMED";
  };

  // Navigation handlers (unchanged)
  const handleStartExamSetup = (config: ExamConfig) => {
    setExamConfig(config);
    setCurrentSubject(config.subjects[0]);
    setCurrentScreen("instructions");
  };

  const handleStartExam = () => {
    setCurrentScreen("exam");
    setCurrentQuestionInSubject(0);

    if (examConfig && shouldUseTimer(examConfig.mode)) {
      setExamStartTime(Date.now());
    } else {
      setExamStartTime(null);
    }
  };

  const handleBackNavigation = () => {
    switch (currentScreen) {
      case "instructions":
        setCurrentScreen("dashboard");
        setExamConfig(null);
        break;
      case "exam":
        setCurrentScreen("instructions");
        setExamStartTime(null);
        break;
      case "results":
        setCurrentScreen("dashboard");
        setExamConfig(null);
        setExamResults(null);
        break;
      default:
        break;
    }
  };

  const handleSubmitExam = () => {
    console.log("=== SUBMIT EXAM HANDLER CALLED ===");
    console.log("Current userAnswers count:", Object.keys(userAnswers).length);
    console.log("ExamConfig subjects:", examConfig?.subjects);
    console.log("Current screen:", currentScreen);
    console.log("User:", authState.user?.firstName, authState.user?.lastName);

    if (!examConfig) {
      console.error("No exam config available!");
      return;
    }

    let timeUsed = 0;
    if (shouldUseTimer(examConfig.mode) && examStartTime) {
      timeUsed = Math.floor((Date.now() - examStartTime) / 1000);
    }

    const totalQuestions = examConfig.subjects.length * 40;
    let correctAnswers = 0;
    const subjectBreakdown: {
      [subject: string]: { correct: number; total: number };
    } = {};

    examConfig.subjects.forEach((subject) => {
      subjectBreakdown[subject] = { correct: 0, total: 40 };
    });

    examConfig.subjects.forEach((subject) => {
      for (let i = 1; i <= 40; i++) {
        const questionId = `${subject}_q_${i}`;
        if (userAnswers[questionId]) {
          if (Math.random() > 0.3) {
            correctAnswers++;
            subjectBreakdown[subject].correct++;
          }
        }
      }
    });

    const results: ExamResults = {
      score: correctAnswers,
      totalQuestions,
      timeUsed,
      subjectBreakdown,
      answers: userAnswers,
    };

    console.log("Final calculated results:", results);
    setExamResults(results);
    setCurrentScreen("results");
  };

  const handleReturnToDashboard = () => {
    setCurrentScreen("dashboard");
    setExamConfig(null);
    setExamResults(null);
    setUserAnswers({});
    setCurrentQuestionInSubject(0);
    setCurrentSubject("");
    setExamStartTime(null);
  };

  const renderMainContent = () => {
    switch (currentScreen) {
      case "dashboard":
        return <Dashboard onStartExam={handleStartExamSetup} />;
      case "instructions":
        return (
          <InstructionScreen
            examConfig={examConfig!}
            onStartExam={handleStartExam}
            onCancel={handleReturnToDashboard}
          />
        );
      case "exam":
        return (
          <ExamScreen
            examConfig={examConfig!}
            currentSubject={currentSubject}
            onSubjectChange={setCurrentSubject}
            currentQuestionInSubject={currentQuestionInSubject}
            onQuestionChange={setCurrentQuestionInSubject}
            userAnswers={userAnswers}
            onAnswerChange={setUserAnswers}
            examStartTime={examStartTime}
          />
        );
      case "results":
        return (
          <ResultScreen
            results={examResults!}
            onRetakeExam={() => setCurrentScreen("instructions")}
            onReturnToDashboard={handleReturnToDashboard}
          />
        );
      default:
        return <Dashboard onStartExam={handleStartExamSetup} />;
    }
  };

  // Show loading while checking authentication
  if (authState.isLoading) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center">
        <Text className="text-xl text-gray-600">Loading...</Text>
      </View>
    );
  }

  // If not authenticated, show nothing (will redirect)
  if (!authState.isAuthenticated) {
    return (
      <View className="flex-1 bg-gray-100 items-center justify-center">
        <Text className="text-xl text-gray-600">Redirecting to login...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header - conditional based on screen */}
      {currentScreen !== "dashboard" && examConfig && (
        <TopBar
          examConfig={examConfig}
          showSubmit={currentScreen === "exam"}
          onSubmit={handleSubmitExam}
          onBack={handleBackNavigation}
          currentSubject={currentSubject}
          onSubjectChange={setCurrentSubject}
          examStartTime={examStartTime}
          showTimer={
            currentScreen === "exam" && shouldUseTimer(examConfig.mode)
          }
        />
      )}

      <View className="flex-1 flex-row w-full">
        {/* Main Content */}
        <View className="flex-1 w-[80%]">{renderMainContent()}</View>

        {/* Persistent Sidebar with logout functionality */}
        <Sidebar onLogout={handleLogout} />
      </View>
    </View>
  );
};

// Main export component (AuthProvider now in _layout.tsx)
const CBTApp: React.FC = () => {
  return <CBTAppContent />;
};

export default CBTApp;
