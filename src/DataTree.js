import React, { useState } from "react";

function DataTree({ veri, setVeri, aktifYol, setAktifYol, arama }) {
  const [expandedPaths, setExpandedPaths] = useState([]);

  const toggleExpand = (yol) => {
    const yolStr = yol.join("/");
    setExpandedPaths((prev) =>
      prev.includes(yolStr)
        ? prev.filter((p) => p !== yolStr)
        : [...prev, yolStr]
    );
  };

  const handleSec = (yol) => setAktifYol(yol);

  const handleEkle = (yol, tip) => {
    const yeniVeri = { ...veri };
    const hedef = yol.reduce((o, k) => (o[k] = o[k] || {}), yeniVeri);
    const yeniAd = `Yeni ${tip}`;

    if (tip === "Ülke") {
      yeniVeri[yeniAd] = {
        "Yeni Okul": {
          "Yeni Şehir": {
            paraBirimi: "birim",
            ekHizmetler: [{ isim: "Hizmet İsmi", ucret: 0 }],
            programlar: {
              "Yeni Program": {
                ucretAraliklari: [[1, 4, 100]],
                ozelDonemler: [["2025-01-01", "2025-01-15"]],
                ozelDonemEkUcret: 50,
                konaklamalar: {
                  "Aile Yanı": [[1, 4, 200]]
                }
              }
            }
          }
        }
      };
    } else {
      hedef[yeniAd] = tip === "Program"
        ? {
            ucretAraliklari: [[1, 4, 100]],
            ozelDonemler: [["2025-01-01", "2025-01-15"]],
            ozelDonemEkUcret: 50,
            konaklamalar: {
              "Aile Yanı": [[1, 4, 200]]
            }
          }
        : {};
    }
    setVeri(yeniVeri);
    setExpandedPaths((prev) => [...prev, yol.join("/")]);
  };

  const handleSil = (yol) => {
    if (!yol.length) return;
    const yeniVeri = { ...veri };
    const son = yol[yol.length - 1];
    const ebeveyn = yol.slice(0, -1).reduce((o, k) => o?.[k], yeniVeri);
    if (ebeveyn && ebeveyn[son]) delete ebeveyn[son];
    setVeri(yeniVeri);
    setAktifYol([]);
  };

  const renderTree = (obj, yol = []) => {
    return Object.entries(obj).map(([key, val]) => {
      const yeniYol = [...yol, key];
      const isExpanded = expandedPaths.includes(yeniYol.join("/"));
      const isActive = JSON.stringify(aktifYol) === JSON.stringify(yeniYol);
      const isObject = typeof val === "object" && val !== null && !Array.isArray(val);

      if (
        arama &&
        !yeniYol.join("/").toLowerCase().includes(arama.toLowerCase())
      )
        return null;

      return (
        <div key={yeniYol.join("/")} className="veri-satir">
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
          >
            <div
              style={{ cursor: "pointer", fontWeight: "bold", color: "#c24a00", flexGrow: 1 }}
              onClick={() => toggleExpand(yeniYol)}
            >
              {isObject && (isExpanded ? "▼" : "▶")} {" "}
              <span
                onClick={() => handleSec(yeniYol)}
                className={isActive ? "aktif-yol" : ""}
              >
                {key}
              </span>
            </div>
            <button onClick={() => handleEkle(yeniYol, Object.keys(val)[0] ? "Program" : "Alt")}>+</button>
            <button onClick={() => handleSil(yeniYol)}>🗑️</button>
          </div>
          {isExpanded && isObject && (
            <div style={{ paddingLeft: "1rem" }}>{renderTree(val, yeniYol)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div className="data-tree">
      <button onClick={() => handleEkle([], "Ülke")} className="ulke-ekle">
        + Ülke Ekle
      </button>
      <div className="veri-agaci-scroll">
        {renderTree(veri)}
      </div>
    </div>
  );
}

export default DataTree;
