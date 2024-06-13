"use client";

import { signIn, signOut } from "next-auth/react";

const LoginButton = () => {
  return (
    <div>
      <p>This is login page - public route</p>
      <hr />
      <button onClick={async () => await signIn("github")}>
        Sign in with github
      </button>
      <br></br>
      <button onClick={async () => await signIn("google")}>
        Sign in with google
      </button>
    </div>
  );
};
const LogoutButton = () => {
  return (
    <div>
      <a
        onClick={() => signOut()}
        className="inline-flex items-center gap-2 rounded border border-indigo-600 px-8 py-3 text-indigo-600 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring active:bg-indigo-500"
        href="#"
      >
        <span className="text-sm font-medium"> Logout With GitHub </span>

        <svg
          className="size-5 rtl:rotate-180"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17 8l4 4m0 0l-4 4m4-4H3"
          />
        </svg>
      </a>
    </div>
  );
};
export { LoginButton, LogoutButton };
