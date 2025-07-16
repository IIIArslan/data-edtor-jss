import React from "react";

function UploadInput({ setVeri }) {
  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target.result;
      try {
        // "export const genisVeri = {" satırıyla başlayan .js dosyasını parse et
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

  return (
    <label className="ikon-btn" title="Veri Yükle (.js)">
      ⬆️
      <input
        type="file"
        accept=".js"
        onChange={handleUpload}
        style={{ display: "none" }}
      />
    </label>
  );
}

export default UploadInput;
