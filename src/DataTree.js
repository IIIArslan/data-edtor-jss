import React, { useState } from "react";
import { Plus, Trash2, ChevronRight, ChevronDown, Pencil } from "lucide-react";

function DataTree({ veri, setVeri, aktifYol, setAktifYol, arama }) {
  const [expandedPaths, setExpandedPaths] = useState([]);
  const [editingPath, setEditingPath] = useState(null);
  const [editingValue, setEditingValue] = useState("");

  const sabitAlanlar = [
    "paraBirimi",
    "ekHizmetler",
    "ucretAraliklari",
    "ozelDonemler",
    "ozelDonemEkUcret"
  ];

  const toggleExpand = (yol) => {
    const yolStr = yol.join("/");
    setExpandedPaths((prev) =>
      prev.includes(yolStr)
        ? prev.filter((p) => p !== yolStr)
        : [...prev, yolStr]
    );
  };

  const handleSec = (yol) => setAktifYol(yol);

  const getYeniAd = (mevcut, base) => {
    let index = 1;
    let yeniAd = base;
    while (mevcut.hasOwnProperty(yeniAd)) {
      yeniAd = `${base} ${index++}`;
    }
    return yeniAd;
  };

  const handleEkle = (yol, tip) => {
    const yeniVeri = structuredClone(veri);
    const hedef = yol.reduce((o, k) => (o[k] = o[k] || {}), yeniVeri);

    let yeniAd;
    if (tip === "Ülke") {
      yeniAd = getYeniAd(yeniVeri, "Yeni Ülke");
      yeniVeri[yeniAd] = {
        "Yeni Okul": {
          "Yeni Şehir": getSehirSablonu()
        }
      };
    } else if (tip === "Okul") {
      yeniAd = getYeniAd(hedef, "Yeni Okul");
      hedef[yeniAd] = {
        "Yeni Şehir": getSehirSablonu()
      };
    } else if (tip === "Şehir") {
      yeniAd = getYeniAd(hedef, "Yeni Şehir");
      hedef[yeniAd] = getSehirSablonu();
    } else if (tip === "Program") {
      yeniAd = getYeniAd(hedef, "Yeni Program");
      hedef[yeniAd] = getProgramSablonu();
    } else if (tip === "Konaklama") {
      yeniAd = getYeniAd(hedef, "Yeni Konaklama");
      hedef[yeniAd] = [[1, 4, 200]];
    } else {
      yeniAd = getYeniAd(hedef, "Yeni Alan");
      hedef[yeniAd] = {};
    }

    setVeri(yeniVeri);
    setExpandedPaths((prev) => [...new Set([...prev, yol.join("/"), [...yol, yeniAd].join("/")])]);
  };

  const getSehirSablonu = () => ({
    paraBirimi: "birim",
    ekHizmetler: [{ isim: "Havaalanı Transferi", ucret: 50 }],
    programlar: {
      "Yeni Program": getProgramSablonu()
    }
  });

  const getProgramSablonu = () => ({
    ucretAraliklari: [[1, 4, 100]],
    ozelDonemler: [["2025-01-01", "2025-01-15"]],
    ozelDonemEkUcret: 50,
    konaklamalar: {
      "Yeni Konaklama": [[1, 4, 200]]
    }
  });

  const handleSil = (yol) => {
    if (!yol.length) return;
    const yeniVeri = structuredClone(veri);
    const son = yol[yol.length - 1];
    const ebeveyn = yol.slice(0, -1).reduce((o, k) => o?.[k], yeniVeri);
    if (ebeveyn && ebeveyn[son]) delete ebeveyn[son];
    setVeri(yeniVeri);
    setAktifYol([]);
  };

  const handleKeyEdit = (yol, yeniKey) => {
    const yeniVeri = structuredClone(veri);
    const ebeveyn = yol.slice(0, -1).reduce((o, k) => o[k], yeniVeri);
    const eskiKey = yol[yol.length - 1];
    if (!yeniKey || yeniKey === eskiKey) {
      setEditingPath(null);
      return;
    }
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

      const isSabitAlan = sabitAlanlar.includes(key);

      const showAdd =
        (yeniYol.at(-1) === "konaklamalar") ||
        (yeniYol.at(-1) === "programlar") ||
        (yeniYol.length === 0) ||
        (yeniYol.length === 1) ||
        (yeniYol.length === 2);

      const showEditDelete = !isSabitAlan;

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
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleKeyEdit(yeniYol, editingValue);
                    }
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
            {showEditDelete && (
              <>
                <button className="ikon-sadece-btn" onClick={() => {
                  setEditingPath(yeniYol);
                  setEditingValue(key);
                }}>
                  <Pencil size={16} />
                </button>
                <button className="ikon-sadece-btn" onClick={() => handleSil(yeniYol)}>
                  <Trash2 size={16} />
                </button>
              </>
            )}
            {showAdd && (
              <button
                className="ikon-sadece-btn"
                onClick={() => {
                  const seviye = yeniYol.length;
                  const tip = yeniYol.at(-1);
                  if (tip === "programlar") handleEkle(yeniYol, "Program");
                  else if (tip === "konaklamalar") handleEkle(yeniYol, "Konaklama");
                  else if (seviye === 0) handleEkle(yeniYol, "Ülke");
                  else if (seviye === 1) handleEkle(yeniYol, "Okul");
                  else if (seviye === 2) handleEkle(yeniYol, "Şehir");
                  else handleEkle(yeniYol, "Alan");
                }}
              >
                <Plus size={16} />
              </button>
            )}
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
      <button onClick={() => handleEkle([], "Ülke") } className="ulke-ekle">
        <Plus size={16} style={{ marginRight: "0.3rem" }} /> Ülke Ekle
      </button>
      <div className="veri-agaci-scroll">{renderTree(veri)}</div>
    </div>
  );
}

export default DataTree;
