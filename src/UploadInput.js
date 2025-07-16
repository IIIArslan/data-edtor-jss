import React, { useState } from "react";

function UploadInput({ setVeri }) {
  const [dosyaAdi, setDosyaAdi] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDosyaAdi(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      try {
        const jsonStart = text.indexOf("{");
        const jsonString = text.slice(jsonStart);
        const obj = new Function("return " + jsonString)();
        setVeri(obj);
        localStorage.setItem("veri", JSON.stringify(obj));
        alert("Veri başarıyla yüklendi ✅");
      } catch (err) {
        alert("Yüklenen dosya geçerli bir .js veri dosyası değil ❌");
      }
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setVeri({});
    localStorage.removeItem("veri");
    setDosyaAdi("");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
      <label className="ikon-btn" title="Veri Yükle (.js)">
        ⬆️
        <input
          type="file"
          accept=".js"
          onChange={handleUpload}
          style={{ display: "none" }}
        />
      </label>
      {dosyaAdi && (
        <div style={{ fontSize: "0.85rem", marginTop: "0.3rem", display: "flex", alignItems: "center", gap: "0.3rem" }}>
          ✅ {dosyaAdi}
          <button
            onClick={handleClear}
            title="Dosyayı Sıfırla"
            style={{ fontSize: "0.9rem", background: "none", border: "none", color: "#ff5252", cursor: "pointer" }}
          >
            🗑️
          </button>
        </div>
      )}
    </div>
  );
}

export default UploadInput;
