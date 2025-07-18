import React, { useState } from "react";

function EditorPanel({ veri, setVeri, aktifYol, aktifVeri }) {
  const [secilenProgram, setSecilenProgram] = useState("");
  const [secilenKonaklama, setSecilenKonaklama] = useState("");

  const guncelle = (yeniDeger) => {
    const yeniVeri = { ...veri };
    const hedef = aktifYol.slice(0, -1).reduce((o, k) => o[k], yeniVeri);
    hedef[aktifYol[aktifYol.length - 1]] = yeniDeger;
    setVeri(yeniVeri);
  };

  if (aktifVeri === null || aktifVeri === undefined) {
    return <div className="editor-panel">Bir öğe seçin</div>;
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

  const guncelleAltAlan = (kategori, alan, deger) => {
    const yeni = { ...aktifVeri };
    yeni.programlar[secilenProgram][alan] = deger;
    guncelle(yeni);
  };

  const guncelleKonaklama = (deger) => {
    const yeni = { ...aktifVeri };
    yeni.programlar[secilenProgram].konaklamalar[secilenKonaklama].ucretAraliklari = deger;
    guncelle(yeni);
  };

  const guncelleKonaklamaNot = (deger) => {
    const yeni = { ...aktifVeri };
    yeni.programlar[secilenProgram].konaklamalar[secilenKonaklama].konaklama_panel_not = deger;
    guncelle(yeni);
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
              <button
                className="ikon-sadece-btn"
                onClick={() => handleArrayRemove("ekHizmetler", i)}
              >
                🗑️
              </button>
            </div>
          ))}
          <button
            className="buton-ekle"
            onClick={() =>
              handleArrayAdd("ekHizmetler", { isim: "Yeni Hizmet", ucret: 0 })
            }
          >
            + Ekle
          </button>
        </div>
      )}

      {aktifVeri.programlar && (
        <div>
          <label>Program Seçin</label>
          <select
            value={secilenProgram}
            onChange={(e) => {
              setSecilenProgram(e.target.value);
              setSecilenKonaklama("");
            }}
          >
            <option value="">Program seçin</option>
            {Object.keys(aktifVeri.programlar).map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      )}

      {secilenProgram && aktifVeri.programlar?.[secilenProgram] && (
        <>
          <div>
            <label>ücretAraliklari</label>
            {aktifVeri.programlar[secilenProgram].ucretAraliklari.map((aralik, i) => (
              <div key={i} className="array-row">
                {aralik.map((v, j) => (
                  <input
                    key={j}
                    type="number"
                    value={v}
                    onChange={(e) => {
                      const yeni = [...aktifVeri.programlar[secilenProgram].ucretAraliklari];
                      yeni[i][j] = Number(e.target.value);
                      guncelleAltAlan("programlar", "ucretAraliklari", yeni);
                    }}
                  />
                ))}
                <button
                  className="ikon-sadece-btn"
                  onClick={() => {
                    const yeni = [...aktifVeri.programlar[secilenProgram].ucretAraliklari];
                    yeni.splice(i, 1);
                    guncelleAltAlan("programlar", "ucretAraliklari", yeni);
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
            <button
              className="buton-ekle"
              onClick={() => {
                const yeni = [
                  ...aktifVeri.programlar[secilenProgram].ucretAraliklari,
                  [1, 2, 0]
                ];
                guncelleAltAlan("programlar", "ucretAraliklari", yeni);
              }}
            >
              + Ekle
            </button>
          </div>

          <div>
            <label>özelDönemler</label>
            {aktifVeri.programlar[secilenProgram].ozelDonemler.map((donem, i) => (
              <div key={i} className="array-row">
                <input
                  type="date"
                  value={donem[0]}
                  onChange={(e) => {
                    const yeni = [...aktifVeri.programlar[secilenProgram].ozelDonemler];
                    yeni[i][0] = e.target.value;
                    guncelleAltAlan("programlar", "ozelDonemler", yeni);
                  }}
                />
                <input
                  type="date"
                  value={donem[1]}
                  onChange={(e) => {
                    const yeni = [...aktifVeri.programlar[secilenProgram].ozelDonemler];
                    yeni[i][1] = e.target.value;
                    guncelleAltAlan("programlar", "ozelDonemler", yeni);
                  }}
                />
                <input
                  type="number"
                  value={donem[2]}
                  onChange={(e) => {
                    const yeni = [...aktifVeri.programlar[secilenProgram].ozelDonemler];
                    yeni[i][2] = Number(e.target.value);
                    guncelleAltAlan("programlar", "ozelDonemler", yeni);
                  }}
                />
                <button
                  className="ikon-sadece-btn"
                  onClick={() => {
                    const yeni = [...aktifVeri.programlar[secilenProgram].ozelDonemler];
                    yeni.splice(i, 1);
                    guncelleAltAlan("programlar", "ozelDonemler", yeni);
                  }}
                >
                  🗑️
                </button>
              </div>
            ))}
            <button
              className="buton-ekle"
              onClick={() => {
                const yeni = [
                  ...aktifVeri.programlar[secilenProgram].ozelDonemler,
                  ["2025-01-01", "2025-01-15", 0]
                ];
                guncelleAltAlan("programlar", "ozelDonemler", yeni);
              }}
            >
              + Ekle
            </button>
          </div>

          <div>
            <label>Program Panel Notu</label>
            <textarea
              value={aktifVeri.programlar[secilenProgram].program_panel_not || ""}
              onChange={(e) =>
                guncelleAltAlan("programlar", "program_panel_not", e.target.value)
              }
            />
          </div>

          <div>
            <label>Konaklama Seçin</label>
            <select
              value={secilenKonaklama}
              onChange={(e) => setSecilenKonaklama(e.target.value)}
            >
              <option value="">Konaklama seçin</option>
              {Object.keys(aktifVeri.programlar[secilenProgram].konaklamalar || {}).map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </div>

          {secilenKonaklama && (
            <div>
              <label>{secilenKonaklama} Ücret Aralıkları</label>
              {(aktifVeri.programlar[secilenProgram].konaklamalar[secilenKonaklama].ucretAraliklari || []).map((aralik, i) => (
                <div key={i} className="array-row">
                  {aralik.map((v, j) => (
                    <input
                      key={j}
                      type="number"
                      value={v}
                      onChange={(e) => {
                        const yeni = [
                          ...aktifVeri.programlar[secilenProgram].konaklamalar[secilenKonaklama].ucretAraliklari
                        ];
                        yeni[i][j] = Number(e.target.value);
                        guncelleKonaklama(yeni);
                      }}
                    />
                  ))}
                  <button
                    className="ikon-sadece-btn"
                    onClick={() => {
                      const yeni = [
                        ...aktifVeri.programlar[secilenProgram].konaklamalar[secilenKonaklama].ucretAraliklari
                      ];
                      yeni.splice(i, 1);
                      guncelleKonaklama(yeni);
                    }}
                  >
                    🗑️
                  </button>
                </div>
              ))}
              <button
                className="buton-ekle"
                onClick={() => {
                  const yeni = [
                    ...(aktifVeri.programlar[secilenProgram].konaklamalar[secilenKonaklama].ucretAraliklari || []),
                    [1, 4, 0]
                  ];
                  guncelleKonaklama(yeni);
                }}
              >
                + Ekle
              </button>

              <div>
                <label>Konaklama Panel Notu</label>
                <textarea
                  value={
                    aktifVeri.programlar[secilenProgram].konaklamalar[secilenKonaklama].konaklama_panel_not || ""
                  }
                  onChange={(e) => guncelleKonaklamaNot(e.target.value)}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default EditorPanel;
