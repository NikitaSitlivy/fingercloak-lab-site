import React from "react";

export const Card: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section style={{
    background: "linear-gradient(180deg,#0c1322,#0e1628)", border: "1px solid #2a4058aa",
    borderRadius: "16px", padding: 16, position: "relative", boxShadow: "0 0 0 1px #0a1724 inset, 0 30px 60px #0008", overflow: "hidden"
  }}>
    <h2 style={{ margin: "0 0 12px 0", fontSize: 18, fontWeight: 700, letterSpacing: ".3px" }}>{title}</h2>
    {children}
  </section>
);
