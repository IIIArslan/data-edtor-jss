import React, { useState, useEffect } from "react";
import DataTree from "./DataTree";
import EditorPanel from "./EditorPanel";
import DownloadButton from "./DownloadButton";
import UploadInput from "./UploadInput";
import SearchBox from "./SearchBox";
import { Moon, Sun } from "lucide-react";
import { genisVeri } from "./data"; // Yeni data.js import
import "./App.css";

function App() {
  const [veri, setVeri] = useState(() => {
    const localData = localStorage.getItem("veri");
    return localData ? JSON.parse(localData) : genisVeri; // İlk yüklemede genisVeri kullanılıyor
  });

  const [aktifYol, setAktifYol] = useState([]);
  const [tema, setTema] = useState("dark");
  const [arama, setArama] = useState("");

  useEffect(() => {
    document.documentElement.className = tema;
  }, [tema]);

  useEffect(() => {
    localStorage.setItem("veri", JSON.stringify(veri));
  }, [veri]);

  const aktifVeri = aktifYol.reduce((o, k) => (o && o[k] ? o[k] : null), veri);

  return (
    <div className="app-container">
      <div className="ust-bar">
        <SearchBox arama={arama} setArama={setArama} />
        <div className="ikon-grubu">
          <button
            onClick={() => setTema(tema === "dark" ? "light" : "dark")}
            className="ikon-btn"
            title="Tema Değiştir"
          >
            {tema === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <UploadInput setVeri={setVeri} />
          <DownloadButton veri={veri} />
        </div>
      </div>

      <div className="ana-icerik">
        <DataTree
          veri={veri}
          setVeri={setVeri}
          aktifYol={aktifYol}
          setAktifYol={setAktifYol}
          arama={arama}
        />
        <EditorPanel
          veri={veri}
          setVeri={setVeri}
          aktifYol={aktifYol}
          aktifVeri={aktifVeri}
        />
      </div>
    </div>
  );
}

export default App;
