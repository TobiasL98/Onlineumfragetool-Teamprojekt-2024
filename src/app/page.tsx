import { redirect } from "next/navigation";

/*
import React from 'react';
import { AppProps } from 'next/app';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { IeFlowFile } from "interfaces/edit/IeFlowFile";
import Editor from './(admin)/admin/edit/page';
import ShoppingStrategyPage from './(user)/(survey)/shoppingStrategy/page';

interface ConfigFile {
    // Define the structure of your configFile here
    [key: string]: any;
}

function MyApp({ Component, pageProps }: AppProps) {
 // const [configFile, setConfigFile] = useState<IeFlowFile>()
  console.log("APPPPP: ")// + typeof setConfigFile)
  return (
    <Router>
      <Routes>
          <Route path="/admin/edit" element={<Editor setConfigFile={setConfigFile}/>} />
        <Route path="/shoppingStrategy" element={<ShoppingStrategyPage configFile={configFile} />} />
      }</Routes>
      <Component {...pageProps} />
    </Router>
  );
}

export default MyApp;
*/

export default function Page() {
    redirect("/user");
}