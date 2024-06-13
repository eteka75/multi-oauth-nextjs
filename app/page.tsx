import Image from "next/image";
import { LoginButton, LogoutButton } from "./components/LoginButton";
import { auth } from "@/src/lib/auth";
import { signIn } from "next-auth/react";

export default async function Home() {
  const session = await auth();
  return (
    <div className="p-4 max-w-xl m-auto">
      <h1 className="text-xl font-bold mt-11">
        {session?.user
          ? "Authentificated as : " + session?.user.email
          : "Not Authnifiated"}
      </h1>
      <div className="flex mt-8 gap-4">
        {!session?.user ? <LoginButton /> : <LogoutButton />}
      </div>
    </div>
  );
}
