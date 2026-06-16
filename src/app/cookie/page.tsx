import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Informativa sui cookie utilizzati dal sito teamlagang.it: solo cookie tecnici necessari, nessuna profilazione.",
};

const UPDATED = "Giugno 2026";

export default function CookiePage() {
  return (
    <>
      <PageHero
        index="—"
        label="Informativa"
        title="Cookie"
        accent="policy."
        color="yellow"
        subtitle="Quali cookie usa teamlagang.it. In breve: solo cookie tecnici necessari al funzionamento, nessun cookie di profilazione o di terze parti."
      />

      <section className="relative py-16 md:py-24 bg-bg">
        <div className="mx-auto max-w-3xl px-5 md:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-12">
            Ultimo aggiornamento · {UPDATED}
          </p>

          <Block n="01" title="Cosa sono i cookie">
            <p>
              I cookie sono piccoli file di testo che i siti salvano sul tuo
              dispositivo durante la navigazione. Servono a far funzionare il
              sito, a ricordare le tue scelte o, in alcuni casi, a raccogliere
              statistiche e profilare gli utenti.
            </p>
          </Block>

          <Block n="02" title="Quali cookie usiamo">
            <p>
              Questo sito utilizza <strong>esclusivamente cookie tecnici
              necessari</strong>, indispensabili per fornire le funzionalità che
              richiedi (in particolare l&apos;accesso all&apos;area personale).
              Per questi cookie, ai sensi della normativa vigente, non è
              richiesto il consenso preventivo.
            </p>

            <div className="mt-6 border border-white/10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg-elev">
                  <tr className="font-mono text-[10px] uppercase tracking-widest text-ink-faint text-left">
                    <th className="px-3 py-3">Cookie</th>
                    <th className="px-3 py-3">Finalità</th>
                    <th className="px-3 py-3">Durata</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-ink-dim align-top">
                  <tr>
                    <td className="px-3 py-3 font-mono text-xs text-ink">
                      authjs.session-token
                      <span className="block text-ink-faint mt-1">
                        (e variante __Secure- su HTTPS)
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      Mantiene l&apos;utente autenticato nell&apos;area personale.
                    </td>
                    <td className="px-3 py-3">Fino a 7 giorni</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-mono text-xs text-ink">
                      authjs.csrf-token
                      <span className="block text-ink-faint mt-1">
                        (e variante __Host- su HTTPS)
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      Protegge i moduli da attacchi CSRF (sicurezza).
                    </td>
                    <td className="px-3 py-3">Sessione</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-3 font-mono text-xs text-ink">
                      authjs.callback-url
                      <span className="block text-ink-faint mt-1">
                        (e variante __Secure- su HTTPS)
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      Gestisce il reindirizzamento corretto dopo l&apos;accesso.
                    </td>
                    <td className="px-3 py-3">Sessione</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-ink-faint">
              I cookie sono installati direttamente dal nostro sito (cookie di
              prima parte) e i loro nomi possono variare leggermente a seconda
              della configurazione del browser e del protocollo (HTTP/HTTPS).
            </p>
          </Block>

          <Block n="03" title="Cookie di profilazione e di terze parti">
            <p>
              Questo sito <strong>non utilizza</strong> cookie di profilazione,
              cookie analitici né cookie di terze parti per finalità
              pubblicitarie o di tracciamento. Per questo motivo non è presente
              alcun banner di consenso ai cookie.
            </p>
            <p>
              La mappa della pista carica le tessere cartografiche da
              OpenStreetMap e CARTO: tale operazione comporta una richiesta ai
              loro server (con comunicazione dell&apos;indirizzo IP) ma{" "}
              <strong>non installa cookie</strong> tramite il nostro sito. Maggiori
              dettagli nella{" "}
              <a href="/privacy" className="text-yellow hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </Block>

          <Block n="04" title="Come gestire i cookie">
            <p>
              Puoi in ogni momento bloccare o eliminare i cookie tramite le
              impostazioni del tuo browser. Tieni presente che disabilitando i
              cookie tecnici alcune funzioni del sito — in particolare
              l&apos;accesso all&apos;area personale — potrebbero non funzionare
              correttamente.
            </p>
            <p>
              Le istruzioni per gestire i cookie sono disponibili nelle pagine di
              supporto del tuo browser (Chrome, Firefox, Safari, Edge).
            </p>
          </Block>

          <Block n="05" title="Aggiornamenti">
            <p>
              Questa cookie policy può essere aggiornata nel tempo. La versione
              vigente è sempre disponibile su questa pagina, con la data
              dell&apos;ultimo aggiornamento indicata in alto.
            </p>
            <p>
              Per maggiori dettagli sul trattamento dei dati personali consulta
              la nostra{" "}
              <a href="/privacy" className="text-yellow hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </Block>
        </div>
      </section>
    </>
  );
}

function Block({
  n,
  title,
  children,
}: {
  n: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-12 md:mb-16">
      <div className="flex items-baseline gap-4 mb-4">
        <span className="font-mono text-xs text-yellow">{n}</span>
        <h2 className="text-display text-2xl md:text-3xl text-ink leading-tight">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-4 text-ink-dim leading-relaxed [&_strong]:text-ink">
        {children}
      </div>
    </div>
  );
}
