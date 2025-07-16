import React, { useState } from "react";

function UploadInput({ setVeri }) {
  const [dosyaAdi, setDosyaAdi] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [geciciAd, setGeciciAd] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDosyaAdi(file.name);
    setGeciciAd(file.name);

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
    setGeciciAd("");
    setIsEditing(false);
  };

  const handleEditSave = () => {
    setDosyaAdi(geciciAd);
    setIsEditing(false);
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
        <div
          style={{
            fontSize: "0.85rem",
            marginTop: "0.3rem",
            display: "flex",
            alignItems: "center",
            gap: "0.3rem",
          }}
        >
          ✅
          {isEditing ? (
            <input
              value={geciciAd}
              onChange={(e) => setGeciciAd(e.target.value)}
              onBlur={handleEditSave}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleEditSave();
              }}
              autoFocus
              style={{
                padding: "2px 6px",
                fontSize: "0.8rem",
                background: "var(--input-bg)",
                color: "var(--fg)",
                border: "1px solid var(--border)",
                borderRadius: "4px",
              }}
            />
          ) : (
            <span style={{ cursor: "text" }}>{dosyaAdi}</span>
          )}
          <button
            onClick={() => setIsEditing(true)}
            title="Adı Düzenle"
            style={{ fontSize: "0.9rem", background: "none", border: "none", color: "#61dafb", cursor: "pointer" }}
          >
            ✏️
          </button>
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
