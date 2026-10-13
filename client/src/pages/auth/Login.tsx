import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import SocialButtons from "../../components/auth/SocialButtons";
import { useAuth } from "../../components/auth/AuthProvider";

export default function Login() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/chat", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue to your workspace."
    >
      <SocialButtons />
      <p className="mt-6 text-center text-sm text-zinc-500">
        Don't have an account?{" "}
        <Link to="/register" className="font-medium text-zinc-950 underline-offset-2 hover:underline">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}