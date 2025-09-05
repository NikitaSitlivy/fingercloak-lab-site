import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  right?: React.ReactNode; // доп. элементы в заголовке (опционально)
};

export const Card: React.FC<Props> = ({ title, right, children }) => (
  <section className="card">
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <h2>{title}</h2>
      {right}
    </div>
    <div className="inner">{children}</div>
  </section>
);

export default Card;
