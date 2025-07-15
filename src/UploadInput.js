import React from "react";

function UploadInput({ onYukle }) {
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
        onYukle(JSON.stringify(parsed, null, 2)); // App.js içinde tekrar eval edilecek
        alert("✔ Dosya başarıyla yüklendi.");
      } catch (err) {
        alert("HATA: Dosya geçerli bir .js biçiminde değil veya JSON hatası içeriyor.");
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
