import React, { useState } from "react";
import { Plus, Trash2, ChevronRight, ChevronDown, Pencil } from "lucide-react";

function DataTree({ veri, setVeri, aktifYol, setAktifYol, arama }) {
  const [expandedPaths, setExpandedPaths] = useState([]);
  const [editingPath, setEditingPath] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const toggleExpand = (yol) => {
    const yolStr = yol.join("/");
    setExpandedPaths((prev) =>
      prev.includes(yolStr)
        ? prev.filter((p) => p !== yolStr)
        : [...prev, yolStr]
    );
  };

  const handleSec = (yol) => setAktifYol(yol);

  const getYeniAd = (yol) => {
    const seviye = yol.length;
    switch (seviye) {
      case 0:
        return "Yeni Ülke";
      case 1:
        return "Yeni Okul";
      case 2:
        return "Yeni Şehir";
      case 3:
        return "Yeni Program";
      case 4:
        return "Yeni Konaklama";
      default:
        return "Yeni Alan";
    }
  };

  const handleEkle = (yol, tip) => {
    const yeniVeri = { ...veri };
    const hedef = yol.reduce((o, k) => (o[k] = o[k] || {}), yeniVeri);
    const yeniAd = getYeniAd(yol);

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

  const handleKeyEdit = (yol, yeniKey) => {
    const yeniVeri = { ...veri };
    const ebeveyn = yol.slice(0, -1).reduce((o, k) => o[k], yeniVeri);
    const eskiKey = yol[yol.length - 1];
    if (!yeniKey || yeniKey === eskiKey) return;
    ebeveyn[yeniKey] = ebeveyn[eskiKey];
    delete ebeveyn[eskiKey];
    setVeri(yeniVeri);
    setEditingPath(null);
  };

  const renderTree = (obj, yol = []) => {
    return Object.entries(obj).map(([key, val]) => {
      const yeniYol = [...yol, key];
      const isExpanded = expandedPaths.includes(yeniYol.join("/"));
      const isActive = JSON.stringify(aktifYol) === JSON.stringify(yeniYol);
      const isObject = typeof val === "object" && val !== null && !Array.isArray(val);
      const isEditingKey = editingPath && JSON.stringify(editingPath) === JSON.stringify(yeniYol);

      if (arama && !yeniYol.join("/").toLowerCase().includes(arama.toLowerCase())) return null;

      return (
        <div key={yeniYol.join("/")} className="veri-satir">
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <div
              style={{ cursor: "pointer", fontWeight: "bold", color: "#c24a00", flexGrow: 1 }}
              onClick={() => toggleExpand(yeniYol)}
            >
              {isObject && (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)}{" "}
              {isEditingKey ? (
                <input
                  type="text"
                  value={editingValue}
                  onChange={(e) => setEditingValue(e.target.value)}
                  onBlur={() => handleKeyEdit(yeniYol, editingValue)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleKeyEdit(yeniYol, editingValue);
                  }}
                  autoFocus
                  style={{ fontSize: "0.9rem", padding: "2px 6px" }}
                />
              ) : (
                <span
                  onClick={() => handleSec(yeniYol)}
                  className={isActive ? "aktif-yol" : ""}
                >
                  {key}
                </span>
              )}
            </div>
            <button
              className="ikon-sadece-btn"
              onClick={() => {
                setEditingPath(yeniYol);
                setEditingValue(key);
              }}
            >
              <Pencil size={16} />
            </button>
            <button className="ikon-sadece-btn" onClick={() => handleEkle(yeniYol, Object.keys(val)[0] ? "Program" : "Alt")}>
              <Plus size={16} />
            </button>
            <button className="ikon-sadece-btn" onClick={() => handleSil(yeniYol)}>
              <Trash2 size={16} />
            </button>
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
        <Plus size={16} style={{ marginRight: "0.3rem" }} /> Ülke Ekle
      </button>
      <div className="veri-agaci-scroll">{renderTree(veri)}</div>
    </div>
  );
}

export default DataTree;
