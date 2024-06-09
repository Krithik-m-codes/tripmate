import React from "react";

interface WebsiteLayoutProps {
  children: React.ReactNode;
}

const WebsiteLayout: React.FC<WebsiteLayoutProps> = ({ children }) => {
  return (
    <div className="text-2xl flex justify-center items-center flex-col " >
      <header className="bg-black-800 w-full h-[6vh] flex justify-center items-center">
        <h1>Website Header</h1>
      </header>
      <main className="h-[94vh] flex justify-center items-center bg-gradient-to-l from-slate-800 to-slate-950 w-full" >{children}</main>
      <footer className="w-full " >Website Footer</footer>
    </div>
  );
};

export default WebsiteLayout;
