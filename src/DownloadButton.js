import React from "react";

function DownloadButton({ veri }) {
  const handleDownload = () => {
    const blob = new Blob([
      "export const genisVeri = " + JSON.stringify(veri, null, 2) + ";"
    ], { type: "text/javascript" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "data.js";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} className="ikon-btn" title="Veriyi İndir (.js)">
      ⬇️
    </button>
  );
}

export default DownloadButton;
