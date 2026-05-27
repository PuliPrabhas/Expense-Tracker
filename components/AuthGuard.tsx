"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({
  children,
}: AuthGuardProps) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
    } else {
      setAuthorized(true);
    }

    setChecking(false);
  }, [router]);

  if (checking) {
    return null;
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}