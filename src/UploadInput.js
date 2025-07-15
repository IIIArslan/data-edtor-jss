import React from "react";

function UploadInput({ onUpload }) {
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;

      try {
        const match = text.match(/export const genisVeri\s*=\s*(\{[\s\S]*\});?/);
        if (!match) throw new Error("Geçerli bir genisVeri yapısı bulunamadı.");
        const parsed = JSON.parse(match[1]);
        onUpload(parsed);
        alert("✔ Dosya başarıyla yüklendi.");
      } catch (err) {
        alert("⚠ Dosya içeriği geçersiz. JSON formatında olmalı.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="card">
      <label>Veri Dosyası Yükle (.js):</label>
      <input type="file" accept=".js" onChange={handleFileChange} />
    </div>
  );
}

export default UploadInput;
