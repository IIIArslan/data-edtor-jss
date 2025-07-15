import React from "react";

function DataTree({ data, onPathSelect, selectedPath, onDataChange }) {
  const addDefaultChild = (node, path) => {
    const updated = structuredClone(data);
    let ref = updated;
    for (const key of path) {
      ref = ref[key];
    }

    const level = path.length;
    if (level === 0) {
      // Ülke düzeyi
      let newKey = "Yeni Ülke";
      let counter = 1;
      while (ref[newKey]) newKey = `Yeni Ülke ${counter++}`;
      ref[newKey] = {
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
                  "Örnek Konaklama": [[1, 4, 0]]
                }
              }
            }
          }
        }
      };
    } else if (level === 1) {
      // Okul düzeyi
      let newKey = "Yeni Okul";
      let counter = 1;
      while (ref[newKey]) newKey = `Yeni Okul ${counter++}`;
      ref[newKey] = {
        "Yeni Şehir": {
          paraBirimi: "birim",
          ekHizmetler: [{ isim: "örnek hizmet", ucret: 0 }],
          programlar: {
            "Yeni Program": {
              ucretAraliklari: [[1, 4, 0]],
              ozelDonemler: [["2025-01-01", "2025-01-15"]],
              ozelDonemEkUcret: 0,
              konaklamalar: {
                "Örnek Konaklama": [[1, 4, 0]]
              }
            }
          }
        }
      };
    } else if (level === 2) {
      // Şehir düzeyi
      let newKey = "Yeni Şehir";
      let counter = 1;
      while (ref[newKey]) newKey = `Yeni Şehir ${counter++}`;
      ref[newKey] = {
        paraBirimi: "birim",
        ekHizmetler: [{ isim: "örnek hizmet", ucret: 0 }],
        programlar: {
          "Yeni Program": {
            ucretAraliklari: [[1, 4, 0]],
            ozelDonemler: [["2025-01-01", "2025-01-15"]],
            ozelDonemEkUcret: 0,
            konaklamalar: {
              "Örnek Konaklama": [[1, 4, 0]]
            }
          }
        }
      };
    } else if (level === 3) {
      // Program düzeyi
      let newKey = "Yeni Program";
      let counter = 1;
      while (ref.programlar[newKey]) newKey = `Yeni Program ${counter++}`;
      ref.programlar[newKey] = {
        ucretAraliklari: [[1, 4, 0]],
        ozelDonemler: [["2025-01-01", "2025-01-15"]],
        ozelDonemEkUcret: 0,
        konaklamalar: {
          "Örnek Konaklama": [[1, 4, 0]]
        }
      };
    }

    onDataChange(updated);
  };

  const renderTree = (node, path = []) => {
    if (typeof node !== "object" || node === null) return null;

    return Object.entries(node).map(([key, child]) => {
      const newPath = [...path, key];
      const isSelected = JSON.stringify(selectedPath) === JSON.stringify(newPath);

      return (
        <li key={key}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
            <div
              style={{ cursor: "pointer", fontWeight: "bold", color: "#c24a00", flexGrow: 1 }}
              onClick={() => onPathSelect(newPath)}
              title="Tıklayarak düzenle"
            >
              {isSelected ? "▾" : "▸"} {key}
            </div>

            <button
              onClick={() => addDefaultChild(data, newPath)}
              title="Alt grup ekle"
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >
              ＋
            </button>

            <button
              onClick={() => {
                const confirmed = window.confirm("Bu öğeyi silmek istediğinizden emin misiniz?");
                if (!confirmed) return;

                const updated = structuredClone(data);
                let ref = updated;
                for (let i = 0; i < newPath.length - 1; i++) {
                  ref = ref[newPath[i]];
                }
                delete ref[newPath[newPath.length - 1]];
                onDataChange(updated);
                if (isSelected) onPathSelect([]);
              }}
              title="Bu öğeyi sil"
              style={{ fontWeight: "bold", cursor: "pointer" }}
            >
              ✖
            </button>
          </div>

          {typeof child === "object" && (
            <ul style={{ paddingLeft: "1.2rem" }}>{renderTree(child, newPath)}</ul>
          )}
        </li>
      );
    });
  };

  return (
    <div className="card">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Veri Yapısı</h3>
        <button
          onClick={() => addDefaultChild(data, [])}
          title="Yeni ülke ekle"
          style={{ fontWeight: "bold", padding: "0.3rem 0.6rem" }}
        >
          ＋ Ülke Ekle
        </button>
      </div>
      <ul>{renderTree(data)}</ul>
    </div>
  );
}

export default DataTree;
