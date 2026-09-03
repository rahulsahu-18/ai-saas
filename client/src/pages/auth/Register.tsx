import AuthLayout from "../../components/auth/AuthLayout";
import SocialButtons from "../../components/auth/SocialButtons";

export default function Register() {
  return (
    <AuthLayout
      title="Create your account"
      description="Start building your AI knowledge base."
    >
      <SocialButtons />

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <a
          href="/login"
          className="font-medium text-zinc-950 hover:underline"
        >
          Sign in
        </a>
      </p>
    </AuthLayout>
  );
}