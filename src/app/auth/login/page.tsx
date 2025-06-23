import AuthForm from "@/components/Auth/AuthForm";
import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Login",
};

export default function SignIn() {
  return (
  <AuthForm type="login" />
  );
}
