import React, { useState, useEffect } from "react";
import DataTree from "./DataTree";
import EditorPanel from "./EditorPanel";
import UploadInput from "./UploadInput";
import DownloadButton from "./DownloadButton";
import SearchBox from "./SearchBox";
import "./App.css";

const LOCAL_KEY = "geciciVeri";

function ResetButton() {
  const resetData = () => {
    const confirmed = window.confirm("Tüm geçici verileri silip sayfayı sıfırlamak istiyor musunuz?");
    if (confirmed) {
      localStorage.removeItem(LOCAL_KEY);
      window.location.reload();
    }
  };

  return (
    <button
      onClick={resetData}
      title="LocalStorage verisini sıfırla"
      style={{
        padding: "0.4rem 0.8rem",
        backgroundColor: "#dc3545",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}
    >
      Sıfırla
    </button>
  );
}

function App() {
  const [veri, setVeri] = useState({});
  const [aktifVeri, setAktifVeri] = useState(null);
  const [araSonuc, setAraSonuc] = useState([]);
  const [tema, setTema] = useState(localStorage.getItem("tema") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", tema);
    localStorage.setItem("tema", tema);
  }, [tema]);

  useEffect(() => {
    const kayitliVeri = localStorage.getItem(LOCAL_KEY);
    if (kayitliVeri) {
      try {
        const parsed = JSON.parse(kayitliVeri);
        setVeri(parsed);
      } catch (e) {
        console.warn("LocalStorage verisi okunamadı.");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(veri));
  }, [veri]);

  const toggleTema = () => {
    setTema((prev) => (prev === "light" ? "dark" : "light"));
  };

  const handleDosyaYukle = (icerik) => {
    try {
      const temiz = icerik.replace(/export const \w+\s*=\s*/, "").trim();
      const obj = eval("(" + temiz + ")");
      setVeri(obj);
      alert("✔ Değişiklikler yüklendi.");
    } catch (err) {
      alert("⛔ JSON formatında hata var.");
    }
  };

  const handleIndir = () => {
    const icerik = "export const genisVeri = " + JSON.stringify(veri, null, 2) + ";";
    const blob = new Blob([icerik], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "data.js";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="App">
      <header className="ust-bar">
        <h2>Veri Düzenleyici</h2>
        <div>
          <button onClick={toggleTema} title="Tema Değiştir">🌓</button>
          <UploadInput onYukle={handleDosyaYukle} />
          <DownloadButton onClick={handleIndir} />
        </div>
      </header>

      <div className="ana-icerik">
        <div className="sol-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>Veri Yapısı</h3>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => {
                  const yeniVeri = { ...veri };
                  let sayac = 1;
                  let yeniUlke = "Yeni Ülke";
                  while (yeniVeri[yeniUlke]) {
                    yeniUlke = "Yeni Ülke " + sayac++;
                  }
                  yeniVeri[yeniUlke] = {
                    "Yeni Okul": {
                      "Yeni Şehir": {
                        paraBirimi: "birim",
                        ekHizmetler: [{ isim: "örnek hizmet", ucret: 0 }],
                        programlar: {
                          "Yeni Program": {
                            ucretAraliklari: [[1, 4, 0]],
                            ozelDonemler: [["2025-01-01", "2025-01-15"]],
                            ozelDonemEkUcret: 0,
                            konaklamalar: {
                              "Örnek Konaklama": [[1, 4, 0]],
                            },
                          },
                        },
                      },
                    },
                  };
                  setVeri(yeniVeri);
                }}
              >
                + Ülke Ekle
              </button>
              <ResetButton />
            </div>
          </div>

          <SearchBox data={veri} onResults={setAraSonuc} />
          <DataTree data={veri} setData={setVeri} onSelect={setAktifVeri} searchResults={araSonuc} />
        </div>

        <div className="sag-panel">
          <EditorPanel seciliVeri={aktifVeri} setData={setVeri} />
        </div>
      </div>
    </div>
  );
}

export default App;
