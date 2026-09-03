import AuthLayout from "../../components/auth/AuthLayout";
import SocialButtons from "../../components/auth/SocialButtons";


export default function Login() {
  return (
    <AuthLayout
      title="Welcome back"
      description="Sign in to continue to your workspace."
    >
      <SocialButtons />

      <p className="mt-6 text-center text-sm text-zinc-500">
        Don't have an account?{" "}
        <a
          href="/register"
          className="font-medium text-zinc-950 hover:underline"
        >
          Create one
        </a>
      </p>
    </AuthLayout>
  );
}