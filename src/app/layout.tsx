"use client"
import { useState } from "react"
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import { IeFlowFile } from "interfaces/edit/IeFlowFile"

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    const [configFile, setConfigFile] = useState<IeFlowFile>()

    return (
        <html lang="en">
            <body>
                    {children}
            </body>
        </html>
    )
}