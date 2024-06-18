// import React from 'react';
"use client";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

const Dashboard = () => {
  const { data: session } = useSession();
  if (session) {
    return (
      <>
        Signed in as {session?.user.email} <br />
        <pre>
          {JSON.stringify(session)}
          <br />
          <button onClick={() => signOut()}>Sign out</button>
        </pre>
      </>
    );
  }

  return (
    <pre>
      {session}
      <br />
      <button onClick={() => signIn()}>Sign in</button>
      <button onClick={() => signOut()}>Sign out</button>
    </pre>
  );
};

export default Dashboard;
