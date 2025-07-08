"use client";

import React from "react";
import { useRouter } from "next/navigation";
import FamilyTreeVisualization from "@/app/family-tree/FamilyTreeVisualization";
import { samplePersons, sampleMarriages } from "./sample-data";
import CommonHeader from "@/app/_components/CommonHeader";
import CommonFooter from "@/app/_components/CommonFooter";

const FamilyTreeDemoPage = () => {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push("/family-tree");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CommonHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">家系図サンプル</h2>
          <FamilyTreeVisualization persons={samplePersons} marriages={sampleMarriages} treeId="sample-tree" />
        </div>
        <div style={{ padding: "20px", textAlign: "center", backgroundColor: "#fff" }}>
          <button
            onClick={handleLoginClick}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              color: "#fff",
              backgroundColor: "#0070f3",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            ログインして使う
          </button>
        </div>
      </main>
      <CommonFooter />
    </div>
  );
};

export default FamilyTreeDemoPage;
