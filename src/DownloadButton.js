import React from "react";

function DownloadButton({ data }) {
  const handleDownload = () => {
    const fileContent = `export const genisVeri = ${JSON.stringify(data, null, 2)};`;
    const blob = new Blob([fileContent], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "data.js";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button onClick={handleDownload} title="Güncel dosyayı indir">
      ⬇ İndir
    </button>
  );
}

export default DownloadButton;
