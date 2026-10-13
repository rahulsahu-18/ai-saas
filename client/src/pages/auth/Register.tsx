import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";
import SocialButtons from "../../components/auth/SocialButtons";
import { useAuth } from "../../components/auth/AuthProvider";

export default function Register() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/chat", { replace: true });
  }, [isAuthenticated, navigate]);

  return (
    <AuthLayout
      title="Create your account"
      description="Start building your AI knowledge base."
    >
      <SocialButtons />
      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-zinc-950 underline-offset-2 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}