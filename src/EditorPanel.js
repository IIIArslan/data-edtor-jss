import React, { useState } from "react";

function EditorPanel({ veri, setVeri, aktifYol, aktifVeri }) {
  const guncelle = (yeniDeger) => {
    const yeniVeri = { ...veri };
    const hedef = aktifYol.slice(0, -1).reduce((o, k) => o[k], yeniVeri);
    hedef[aktifYol[aktifYol.length - 1]] = yeniDeger;
    setVeri(yeniVeri);
  };

  if (!aktifVeri || typeof aktifVeri !== "object") {
    return <div className="editor-panel">Bir öğe seçin</div>;
  }

  const handleInput = (alan, deger) => {
    guncelle({ ...aktifVeri, [alan]: deger });
  };

  const handleArrayChange = (alan, index, key, deger) => {
    const yeniListe = [...aktifVeri[alan]];
    yeniListe[index][key] = deger;
    guncelle({ ...aktifVeri, [alan]: yeniListe });
  };

  const handleArrayAdd = (alan, yeni) => {
    guncelle({ ...aktifVeri, [alan]: [...(aktifVeri[alan] || []), yeni] });
  };

  const handleArrayRemove = (alan, index) => {
    const yeniListe = [...aktifVeri[alan]];
    yeniListe.splice(index, 1);
    guncelle({ ...aktifVeri, [alan]: yeniListe });
  };

  const handleProgramSecimi = (e) => {
    const secilen = e.target.value;
    const yol = [...aktifYol.slice(0, -1), secilen];
    setAktifYol(yol);
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
              <button onClick={() => handleArrayRemove("ekHizmetler", i)}>🗑️</button>
            </div>
          ))}
          <button onClick={() => handleArrayAdd("ekHizmetler", { isim: "Yeni Hizmet", ucret: 0 })}>+ Ekle</button>
        </div>
      )}

      {aktifVeri.programlar && (
        <div>
          <label>programlar</label>
          <select onChange={handleProgramSecimi} defaultValue="">
            <option disabled value="">Program Seçin</option>
            {Object.keys(aktifVeri.programlar).map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
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
              <button onClick={() => handleArrayRemove("ucretAraliklari", i)}>🗑️</button>
            </div>
          ))}
          <button onClick={() => handleArrayAdd("ucretAraliklari", [1, 2, 0])}>+ Ekle</button>
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
              <button onClick={() => handleArrayRemove("ozelDonemler", i)}>🗑️</button>
            </div>
          ))}
          <button onClick={() => handleArrayAdd("ozelDonemler", ["2025-01-01", "2025-01-15"])}>+ Ekle</button>
        </div>
      )}

      {aktifVeri.konaklamalar && (
        <div>
          <label>konaklamalar</label>
          {Object.entries(aktifVeri.konaklamalar).map(([tip, araliklar], i) => (
            <div key={i}>
              <input
                value={tip}
                onChange={(e) => {
                  const yeni = { ...aktifVeri.konaklamalar };
                  const yeniTip = e.target.value;
                  yeni[yeniTip] = yeni[tip];
                  delete yeni[tip];
                  guncelle({ ...aktifVeri, konaklamalar: yeni });
                }}
              />
              {araliklar.map((a, j) => (
                <div key={j} className="array-row">
                  {a.map((v, k) => (
                    <input
                      key={k}
                      type="number"
                      value={v}
                      onChange={(e) => {
                        const yeni = [...araliklar];
                        yeni[j][k] = Number(e.target.value);
                        const tum = { ...aktifVeri.konaklamalar, [tip]: yeni };
                        guncelle({ ...aktifVeri, konaklamalar: tum });
                      }}
                    />
                  ))}
                  <button
                    onClick={() => {
                      const yeni = [...araliklar];
                      yeni.splice(j, 1);
                      const tum = { ...aktifVeri.konaklamalar, [tip]: yeni };
                      guncelle({ ...aktifVeri, konaklamalar: tum });
                    }}
                  >🗑️</button>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EditorPanel;
