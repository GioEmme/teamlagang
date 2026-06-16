# Collegare teamlagang.it a Vercel (registrar: Aruba, con posta attiva)

> ⚠️ Sul dominio è attiva la **posta Aruba**. Usa **solo la Strada A (modifica dei record)**.
> NON cambiare i nameserver verso Vercel: cancelleresti tutta la configurazione email.
> Si toccano in tutto **5 record**, il resto resta intatto.

## PARTE 1 — Vercel: aggiungi il dominio

1. Vai su **vercel.com**, fai login.
2. Clicca sul progetto del sito (teamlagang).
3. In alto clicca la tab **Settings**.
4. Nel menu a sinistra clicca **Domains**.
5. Nel campo di testo scrivi `teamlagang.it` e clicca **Add**.
6. Se compare una scelta tra "teamlagang.it" / "www.teamlagang.it" / "Redirect", seleziona l'opzione **`teamlagang.it` (redirect www to teamlagang.it)** e conferma.
7. Vercel ora mostra il dominio con scritto **Invalid Configuration** e ti elenca i record da creare. Leggi e **annota l'IP che indica per il record A** dell'apex. Dovrebbe essere `76.76.21.21`. Se è diverso, usa quello che vedi tu.
8. Lascia questa pagina Vercel aperta. Apri Aruba in un'altra scheda.

## PARTE 2 — Aruba: apri la gestione DNS

9. Vai su **aruba.it**, clicca **Login** (in alto a destra) → entra nell'**Area Clienti** (Pannello Admin).
10. Vai in **Domini** (o "I tuoi domini") e clicca su **teamlagang.it**.
11. Cerca la voce **Gestione DNS** / **Gestione record DNS** e aprila.

## PARTE 3 — Aruba: modifica il record A dell'apex

12. Trova la riga: `A` — nome host `@` — valore `89.46.110.75`.
13. Clicca **Modifica** su quella riga.
14. Nel campo del valore/IP cancella `89.46.110.75` e scrivi **`76.76.21.21`**.
15. Salva/Conferma.

## PARTE 4 — Aruba: elimina il record AAAA dell'apex

16. Trova la riga: `AAAA` — nome host `@` — valore `2a00:6d40:4:1::c318:75`.
17. Clicca **Elimina** su quella riga → conferma.

## PARTE 5 — Aruba: elimina i record del www

18. Trova la riga: `A` — nome host `www` — valore `89.46.110.75`. Clicca **Elimina** → conferma.
19. Trova la riga: `AAAA` — nome host `www` — valore `2a00:6d40:4:1::c318:75`. Clicca **Elimina** → conferma.

## PARTE 6 — Aruba: crea il CNAME del www

20. Cerca il pulsante **Aggiungi record** (o "Nuovo record").
21. Compila:
    - **Tipo:** `CNAME`
    - **Nome host:** `www`
    - **Valore:** `cname.vercel-dns.com`
    - **TTL:** lascia il default (1 Ora)
22. Salva/Conferma.

## PARTE 7 — Aruba: controllo finale (NON toccare nient'altro)

23. Verifica che lo stato finale dei record gestiti sia:
    - `A` `@` → `76.76.21.21` ✅
    - `CNAME` `www` → `cname.vercel-dns.com` ✅
    - nessun `AAAA` su `@` né su `www` ✅
24. **Tutto il resto resta com'era.** Non eliminare e non modificare nessuno di questi:
    - `A` `mail` / `mx` / `pop3` / `smtp` / `webmail`
    - `CNAME` `imap` / `autoconfig` / `autodiscover`
    - i 3 record `SRV` (`_autodiscover._tcp`, `_xmpp-client._tcp`, `_xmpp-server._tcp`)
    - `TXT @` (SPF `v=spf1 include:_spf.aruba.it ~all`)
    - `TXT _dmarc`, `TXT a1._domainkey` (DKIM Aruba)
    - `TXT resend._domainkey` e `TXT send` (servono al sito per inviare le mail di registrazione/reset via Resend — fondamentali)
    - `A` `ftp` / `localhost`, `CNAME` `_domainconnect` / `admin` / `sms` / `stat` / `statistiche`

## PARTE 8 — Vercel: verifica

25. Torna nella scheda Vercel → **Settings → Domains**.
26. Clicca **Refresh** accanto al dominio (o ricarica la pagina). Può volerci da pochi minuti fino a 1 ora.
27. Quando entrambi diventano **Valid Configuration** ✅, Vercel emette l'**SSL** in automatico (altri pochi minuti, appare il lucchetto).
28. Sempre in Domains, controlla che `teamlagang.it` sia il dominio **principale** e che `www` faccia **redirect** a teamlagang.it.
29. Verifica che il dominio sia agganciato alla **Production** (branch `main`), non a una preview.

## PARTE 9 — Test

30. Apri una finestra **in incognito**: vai su `https://teamlagang.it` → deve apparire il nuovo sito col lucchetto.
31. Vai su `https://www.teamlagang.it` → deve reindirizzare a `https://teamlagang.it`.
32. Manda una mail di prova a una casella `@teamlagang.it` per confermare che la posta funziona ancora.

---

### Se al punto 26 resta "Invalid" dopo un'ora
- Ricontrolla che `A @` sia **esattamente** `76.76.21.21`.
- Assicurati che **non** sia rimasto un `AAAA` sull'apex o sul www.
- Verifica che il `CNAME www` punti a `cname.vercel-dns.com` (senza punto finale o spazi).

### Riassunto modifiche (5 record)
| Azione   | Tipo  | Host | Valore |
|----------|-------|------|--------|
| Modifica | A     | @    | `89.46.110.75` → `76.76.21.21` |
| Elimina  | AAAA  | @    | `2a00:6d40:4:1::c318:75` |
| Elimina  | A     | www  | `89.46.110.75` |
| Elimina  | AAAA  | www  | `2a00:6d40:4:1::c318:75` |
| Aggiungi | CNAME | www  | `cname.vercel-dns.com` |
