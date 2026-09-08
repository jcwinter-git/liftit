import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth-context";
import { ProtectedRoute, PublicOnlyRoute } from "@/components/protected-route";
import { Layout } from "@/components/layout";
import LoginPage from "@/pages/login-page";
import ForgotPasswordPage from "@/pages/forgot-password-page";
import ResetPasswordPage from "@/pages/reset-password-page";
import WorkoutsPage from "@/pages/workouts-page";
import NewWorkoutPage from "@/pages/new-workout-page";
import WorkoutDetailPage from "@/pages/workout-detail-page";
import HistoryPage from "@/pages/history-page";
import ExerciseDetailPage from "@/pages/exercise-detail-page";

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        <Route path="/reset-password" element={<ResetPasswordPage />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/workouts" replace />} />
            <Route path="/workouts" element={<WorkoutsPage />} />
            <Route path="/workouts/new" element={<NewWorkoutPage />} />
            <Route path="/workouts/:id" element={<WorkoutDetailPage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/exercises/:id" element={<ExerciseDetailPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </AuthProvider>
  );
}
