import React from "react";

function EditorPanel({ veri, setVeri, aktifYol, aktifVeri }) {
  const guncelle = (yeniDeger) => {
    const yeniVeri = { ...veri };
    const hedef = aktifYol.slice(0, -1).reduce((o, k) => o[k], yeniVeri);
    hedef[aktifYol[aktifYol.length - 1]] = yeniDeger;
    setVeri(yeniVeri);
  };

  if (aktifVeri === null || aktifVeri === undefined) {
    return <div className="editor-panel">Bir öğe seçin</div>;
  }

  if (Array.isArray(aktifVeri) && Array.isArray(aktifVeri[0])) {
    const handleArrayChange = (index, subIndex, value) => {
      const yeni = [...aktifVeri];
      yeni[index][subIndex] = Number(value);
      guncelle(yeni);
    };

    const handleArrayRemove = (index) => {
      const yeni = [...aktifVeri];
      yeni.splice(index, 1);
      guncelle(yeni);
    };

    const handleArrayAdd = () => {
      guncelle([...aktifVeri, [1, 4, 0]]);
    };

    return (
      <div className="editor-panel">
        <label>{aktifYol.at(-1)}</label>
        {aktifVeri.map((aralik, i) => (
          <div key={i} className="array-row">
            {aralik.map((v, j) => (
              <input
                key={j}
                type="number"
                value={v}
                onChange={(e) => handleArrayChange(i, j, e.target.value)}
              />
            ))}
            <button className="ikon-sadece-btn" onClick={() => handleArrayRemove(i)}>🗑️</button>
          </div>
        ))}
        <button className="buton-ekle" onClick={handleArrayAdd}>+ Ekle</button>
      </div>
    );
  }

  if (typeof aktifVeri !== "object") {
    return <div className="editor-panel">Düzenlenebilir veri bulunamadı</div>;
  }

  const handleInput = (alan, deger) => {
    guncelle({ ...aktifVeri, [alan]: deger });
  };

  const handleArrayAdd = (alan, yeni) => {
    guncelle({ ...aktifVeri, [alan]: [...(aktifVeri[alan] || []), yeni] });
  };

  const handleArrayRemove = (alan, index) => {
    const yeniListe = [...aktifVeri[alan]];
    yeniListe.splice(index, 1);
    guncelle({ ...aktifVeri, [alan]: yeniListe });
  };

  return (
    <div className="editor-panel">
      {aktifVeri.paraBirimi !== undefined && (
        <div>
          <label>paraBirimi</label>
          <input
            value={aktifVeri.paraBirimi}
            onChange={(e) => handleInput("paraBirimi", e.target.value)}
          />
        </div>
      )}

      {aktifVeri.ekHizmetler && (
        <div>
          <label>ekHizmetler</label>
          {aktifVeri.ekHizmetler.map((h, i) => (
            <div key={i} className="array-row">
              <input
                value={h.isim}
                onChange={(e) => {
                  const yeni = [...aktifVeri.ekHizmetler];
                  yeni[i].isim = e.target.value;
                  guncelle({ ...aktifVeri, ekHizmetler: yeni });
                }}
              />
              <input
                type="number"
                value={h.ucret}
                onChange={(e) => {
                  const yeni = [...aktifVeri.ekHizmetler];
                  yeni[i].ucret = Number(e.target.value);
                  guncelle({ ...aktifVeri, ekHizmetler: yeni });
                }}
              />
              <button className="ikon-sadece-btn" onClick={() => handleArrayRemove("ekHizmetler", i)}>🗑️</button>
            </div>
          ))}
          <button className="buton-ekle" onClick={() => handleArrayAdd("ekHizmetler", { isim: "Yeni Hizmet", ucret: 0 })}>+ Ekle</button>
        </div>
      )}

      {aktifVeri.ucretAraliklari && (
        <div>
          <label>ücretAraliklari</label>
          {aktifVeri.ucretAraliklari.map((aralik, i) => (
            <div key={i} className="array-row">
              {aralik.map((v, j) => (
                <input
                  key={j}
                  type="number"
                  value={v}
                  onChange={(e) => {
                    const yeni = [...aktifVeri.ucretAraliklari];
                    yeni[i][j] = Number(e.target.value);
                    guncelle({ ...aktifVeri, ucretAraliklari: yeni });
                  }}
                />
              ))}
              <button className="ikon-sadece-btn" onClick={() => handleArrayRemove("ucretAraliklari", i)}>🗑️</button>
            </div>
          ))}
          <button className="buton-ekle" onClick={() => handleArrayAdd("ucretAraliklari", [1, 2, 0])}>+ Ekle</button>
        </div>
      )}

      {aktifVeri.ozelDonemler && (
        <div>
          <label>özelDönemler</label>
          {aktifVeri.ozelDonemler.map((donem, i) => (
            <div key={i} className="array-row">
              <input
                type="date"
                value={donem[0]}
                onChange={(e) => {
                  const yeni = [...aktifVeri.ozelDonemler];
                  yeni[i][0] = e.target.value;
                  guncelle({ ...aktifVeri, ozelDonemler: yeni });
                }}
              />
              <input
                type="date"
                value={donem[1]}
                onChange={(e) => {
                  const yeni = [...aktifVeri.ozelDonemler];
                  yeni[i][1] = e.target.value;
                  guncelle({ ...aktifVeri, ozelDonemler: yeni });
                }}
              />
              <button className="ikon-sadece-btn" onClick={() => handleArrayRemove("ozelDonemler", i)}>🗑️</button>
            </div>
          ))}
          <button className="buton-ekle" onClick={() => handleArrayAdd("ozelDonemler", ["2025-01-01", "2025-01-15"])}>+ Ekle</button>
        </div>
      )}
    </div>
  );
}

export default EditorPanel;
