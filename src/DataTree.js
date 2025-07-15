import React, { useState } from "react";

function DataTree({ data, onDataChange }) {
  const [selectedPath, setSelectedPath] = useState(null);
  const [editingPath, setEditingPath] = useState(null);
  const [editingValue, setEditingValue] = useState("");
  const [expandedPaths, setExpandedPaths] = useState([]);

  const isExpanded = (path) => expandedPaths.includes(path.join(" > "));

  const toggleExpand = (path) => {
    const pathKey = path.join(" > ");
    setExpandedPaths((prev) =>
      prev.includes(pathKey)
        ? prev.filter((p) => p !== pathKey)
        : [...prev, pathKey]
    );
  };

  const handlePathSelect = (path) => {
    setSelectedPath(path);
    setEditingPath(null);
  };

  const handleEditChange = (e) => {
    setEditingValue(e.target.value);
  };

  const handleKeyEdit = (path, newKey) => {
    const newData = { ...data };
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    const oldKey = path[path.length - 1];
    const value = current[oldKey];
    delete current[oldKey];
    current[newKey] = value;
    onDataChange(newData);
  };

  const handleDelete = (path) => {
    if (!window.confirm("Bu öğeyi silmek istediğinize emin misiniz?")) return;
    const newData = { ...data };
    let current = newData;
    for (let i = 0; i < path.length - 1; i++) {
      current = current[path[i]];
    }
    const keyToDelete = path[path.length - 1];
    delete current[keyToDelete];
    onDataChange(newData);
  };

  const handleAdd = (path) => {
    const newData = { ...data };
    let current = newData;
    for (let key of path) {
      if (!current[key]) current[key] = {};
      current = current[key];
    }

    const level = path.length;
    const defaultKeys = [
      "Yeni Ülke",
      "Yeni Okul",
      "Yeni Şehir",
      "Yeni Program"
    ];
    const defaultKey = defaultKeys[level] || "Yeni Alan";

    const uniqueKey = Object.keys(current).includes(defaultKey)
      ? `${defaultKey} ${Object.keys(current).length + 1}`
      : defaultKey;

    current[uniqueKey] =
      level === 3
        ? {
            paraBirimi: "birim",
            ekHizmetler: [{ isim: "Ek hizmet", ucret: 0 }],
            programlar: {
              "Yeni Program": {
                ucretAraliklari: [[1, 4, 200]],
                ozelDonemler: [["2025-01-01", "2025-01-15"]],
                ozelDonemEkUcret: 50,
                konaklamalar: {
                  "Aile Yanı": [[1, 4, 220]],
                  "Yurt": [[1, 4, 240]]
                }
              }
            }
          }
        : {};

    onDataChange(newData);
    setExpandedPaths((prev) => [...prev, path.join(" > ")]);
  };

  const renderTree = (obj, path = []) => {
    return Object.entries(obj).map(([key, value]) => {
      const newPath = [...path, key];
      const isBranch =
        typeof value === "object" && value !== null && !Array.isArray(value);

      return (
        <div
          key={newPath.join(" > ")}
          style={{ marginLeft: path.length * 15, marginBottom: "5px" }}
        >
          <div
            style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}
          >
            <div
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                color: "#c24a00",
                flexGrow: 1
              }}
              onClick={() => {
                toggleExpand(newPath);
                handlePathSelect(newPath);
              }}
            >
              {isBranch ? (isExpanded(newPath) ? "▾" : "▸") : "•"}{" "}
              {editingPath &&
              editingPath.join(" > ") === newPath.join(" > ") ? (
                <input
                  type="text"
                  value={editingValue}
                  onChange={handleEditChange}
                  onBlur={() => {
                    handleKeyEdit(newPath, editingValue);
                    setEditingPath(null);
                  }}
                  autoFocus
                  style={{ fontSize: "0.9rem", padding: "2px 6px" }}
                />
              ) : (
                key
              )}
            </div>

            {isBranch && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAdd(newPath);
                  }}
                  title="Alt eleman ekle"
                >
                  ＋
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(newPath);
                  }}
                  title="Bu öğeyi sil"
                >
                  ✖
                </button>
              </>
            )}

            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditingPath(newPath);
                setEditingValue(key);
              }}
              title="Adı değiştir"
            >
              ✏
            </button>
          </div>

          {isBranch && isExpanded(newPath) && (
            <div>{renderTree(value, newPath)}</div>
          )}
        </div>
      );
    });
  };

  return (
    <div style={{ marginTop: "1rem", marginLeft: "1rem" }}>
      <h3 style={{ color: "#7a3e00" }}>📁 Veri Yapısı</h3>
      <button
        onClick={() => handleAdd([])}
        style={{ marginBottom: "10px" }}
        title="Yeni ülke ekle"
      >
        + Ülke Ekle
      </button>
      {renderTree(data)}
    </div>
  );
}

export default DataTree;
