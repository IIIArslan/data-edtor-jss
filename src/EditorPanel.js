import React, { useState, useEffect } from "react";

function EditorPanel({ data, selectedPath, onDataChange }) {
  const [jsonInput, setJsonInput] = useState("");

  useEffect(() => {
    try {
      const node = selectedPath.reduce((obj, key) => obj?.[key], data);
      setJsonInput(node ? JSON.stringify(node, null, 2) : "");
    } catch {
      setJsonInput("");
    }
  }, [data, selectedPath]);

  const handleChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSave = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      const updated = { ...data };
      let ref = updated;
      for (let i = 0; i < selectedPath.length - 1; i++) {
        ref = ref[selectedPath[i]];
      }
      ref[selectedPath[selectedPath.length - 1]] = parsed;
      onDataChange(updated);
      alert("✔ Değişiklikler kaydedildi.");
    } catch (err) {
      alert("⚠ Hatalı JSON formatı.");
    }
  };

  if (selectedPath.length === 0) {
    return <div className="card"><p className="bos-veri">Düzenlemek için bir öğe seçin.</p></div>;
  }

  return (
    <div className="card">
      <h3>Seçilen: {selectedPath.join(" > ")}</h3>
      <textarea
        rows={20}
        value={jsonInput}
        onChange={handleChange}
        placeholder="JSON biçiminde veri girin"
      />
      <button onClick={handleSave}>Kaydet</button>
    </div>
  );
}

export default EditorPanel;

