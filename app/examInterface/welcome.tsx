// Main App Structure
// CBTApp.tsx - Main container component
import React, { useState } from "react";
import { View } from "react-native";
import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import Dashboard from "../screens/Dashboard";
import ExamScreen from "../screens/ExamScreen";
import InstructionScreen from "../screens/InstructionScreen";
import ResultScreen from "../screens/ResultScreen";

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

const CBTApp: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("dashboard");
  const [examConfig, setExamConfig] = useState<ExamConfig | null>(null);
  const [examResults, setExamResults] = useState<ExamResults | null>(null);
  const [currentSubject, setCurrentSubject] = useState<string>("");
  const [currentQuestionInSubject, setCurrentQuestionInSubject] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{
    [questionId: string]: string;
  }>({});
  const [examStartTime, setExamStartTime] = useState<number | null>(null);

  // Navigation handlers
  const handleStartExamSetup = (config: ExamConfig) => {
    setExamConfig(config);
    setCurrentSubject(config.subjects[0]); // Start with first subject
    setCurrentScreen("instructions");
  };

  const handleStartExam = () => {
    setCurrentScreen("exam");
    setCurrentQuestionInSubject(0);
    setExamStartTime(Date.now()); // Start timer only when exam begins
  };

  const handleBackNavigation = () => {
    switch (currentScreen) {
      case "instructions":
        setCurrentScreen("dashboard");
        setExamConfig(null);
        break;
      case "exam":
        setCurrentScreen("instructions");
        setExamStartTime(null); // Reset timer
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
    console.log("=== SUBMIT EXAM TRIGGERED ===");
    console.log(
      "Current userAnswers:",
      Object.keys(userAnswers).length,
      "answers"
    );
    console.log("ExamConfig subjects:", examConfig?.subjects);

    const timeUsed = examStartTime
      ? Math.floor((Date.now() - examStartTime) / 1000)
      : 0;

    // Calculate results based on current userAnswers state
    const totalQuestions = examConfig ? examConfig.subjects.length * 40 : 0;
    let correctAnswers = 0;
    const subjectBreakdown: {
      [subject: string]: { correct: number; total: number };
    } = {};

    // Initialize subject breakdown
    examConfig?.subjects.forEach((subject) => {
      subjectBreakdown[subject] = { correct: 0, total: 40 };
    });

    // Mock calculation - replace with real logic
    examConfig?.subjects.forEach((subject) => {
      for (let i = 1; i <= 40; i++) {
        const questionId = `${subject}_q_${i}`;
        if (userAnswers[questionId]) {
          // Mock: assume 70% of answered questions are correct
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

    console.log("Calculated results:", results);
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

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header - conditional based on screen */}
      {currentScreen !== "dashboard" && examConfig && (
        <TopBar
          examConfig={examConfig}
          showSubmit={currentScreen === "exam"}
          onSubmit={handleSubmitExam} // Direct function reference, no closure
          onBack={handleBackNavigation}
          currentSubject={currentSubject}
          onSubjectChange={setCurrentSubject}
          examStartTime={examStartTime}
          showTimer={currentScreen === "exam"} // Only show active timer in exam
        />
      )}

      <View className="flex-1 flex-row">
        {/* Main Content */}
        <View className="flex-1">{renderMainContent()}</View>

        {/* Persistent Sidebar */}
        <Sidebar />
      </View>
    </View>
  );
};

export default CBTApp;
