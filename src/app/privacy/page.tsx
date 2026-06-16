import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Informativa sul trattamento dei dati personali ai sensi del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 per il sito teamlagang.it.",
};

const UPDATED = "Giugno 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        index="—"
        label="Informativa"
        title="Privacy"
        accent="policy."
        color="yellow"
        subtitle="Come trattiamo i dati personali raccolti tramite il sito teamlagang.it, ai sensi del Regolamento UE 2016/679 (GDPR) e del D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018."
      />

      <section className="relative py-16 md:py-24 bg-bg">
        <div className="mx-auto max-w-3xl px-5 md:px-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-12">
            Ultimo aggiornamento · {UPDATED}
          </p>

          <Block n="01" title="Titolare del trattamento">
            <p>
              Il titolare del trattamento è <strong>A.S. Team La Gang</strong>,
              in persona del suo legale rappresentante pro tempore, con sede in
              Via Fratelli Rosselli 13, 42019 Scandiano (Reggio Emilia), Italia.
            </p>
            <p>
              Codice Fiscale: 91077300357 · Partita IVA: 02514650353.
            </p>
            <p>
              Per qualsiasi richiesta relativa ai tuoi dati puoi scrivere a{" "}
              <a href="mailto:info@teamlagang.it" className="text-yellow hover:underline">
                info@teamlagang.it
              </a>
              .
            </p>
            <p>
              Il titolare non ha nominato un Responsabile della protezione dei
              dati (DPO), non ricorrendo i presupposti di obbligatorietà previsti
              dall&apos;art. 37 del GDPR.
            </p>
          </Block>

          <Block n="02" title="Tipologie di dati trattati">
            <p>Trattiamo solo i dati che ci fornisci o che sono necessari al funzionamento del sito:</p>
            <ul>
              <li>
                <strong>Modulo contatti</strong> — nome, indirizzo email,
                categoria di interesse (facoltativa) e testo del messaggio. Questi
                dati ci vengono recapitati via email e non vengono inseriti in
                archivi strutturati ulteriori.
              </li>
              <li>
                <strong>Registrazione all&apos;area personale</strong> — nome,
                cognome, indirizzo email, codice tessera e password (conservata
                esclusivamente in forma cifrata, mai in chiaro).
              </li>
              <li>
                <strong>Dati tecnici di navigazione</strong> — log generati
                automaticamente dai server (indirizzo IP, data e ora della
                richiesta, tipo di browser), trattati per sicurezza e
                funzionamento del sito.
              </li>
            </ul>
            <p>
              Non trattiamo categorie particolari di dati (art. 9 GDPR) e non
              effettuiamo alcuna attività di profilazione.
            </p>
          </Block>

          <Block n="03" title="Finalità e basi giuridiche">
            <ul>
              <li>
                <strong>Rispondere alle tue richieste</strong> inviate tramite il
                modulo contatti — base giuridica: riscontro a una tua richiesta
                ed eventuali misure precontrattuali, oltre al legittimo interesse
                a gestire le comunicazioni (art. 6.1.b/f GDPR).
              </li>
              <li>
                <strong>Gestire l&apos;account e l&apos;accesso all&apos;area
                riservata</strong> — base giuridica: esecuzione del rapporto
                associativo e delle misure richieste dall&apos;interessato
                (art. 6.1.b GDPR).
              </li>
              <li>
                <strong>Garantire sicurezza e corretto funzionamento del
                sito</strong> — base giuridica: legittimo interesse del titolare
                (art. 6.1.f GDPR).
              </li>
            </ul>
          </Block>

          <Block n="04" title="Natura del conferimento e conseguenze del rifiuto">
            <p>
              Il conferimento dei dati è sempre facoltativo. Tuttavia, i dati
              contrassegnati come necessari nei moduli sono indispensabili per
              ottenere il servizio richiesto: senza di essi non possiamo dare
              riscontro al tuo messaggio né creare e gestire il tuo account.
            </p>
          </Block>

          <Block n="05" title="Modalità del trattamento e tempi di conservazione">
            <p>
              I dati sono trattati con strumenti elettronici, adottando misure
              tecniche e organizzative adeguate a proteggerli da accessi non
              autorizzati, perdita o divulgazione.
            </p>
            <ul>
              <li>
                I messaggi inviati dal modulo contatti sono conservati per il
                tempo strettamente necessario a gestire la richiesta e le
                comunicazioni correlate.
              </li>
              <li>
                I dati dell&apos;account sono conservati finché l&apos;account
                resta attivo; alla cancellazione vengono rimossi o resi anonimi,
                salvo diversi obblighi di legge.
              </li>
              <li>
                I log tecnici sono conservati per il periodo necessario alle
                finalità di sicurezza e diagnostica.
              </li>
            </ul>
          </Block>

          <Block n="06" title="Destinatari e responsabili del trattamento">
            <p>
              Non vendiamo né cediamo i tuoi dati. Per erogare il servizio ci
              avvaliamo di fornitori che agiscono come responsabili del
              trattamento ai sensi dell&apos;art. 28 GDPR, ciascuno per la propria
              parte:
            </p>
            <ul>
              <li>
                <strong>Vercel Inc.</strong> — hosting e distribuzione del sito.
              </li>
              <li>
                <strong>Neon Inc.</strong> — database in cui sono conservati i
                dati degli account.
              </li>
              <li>
                <strong>Resend</strong> — invio delle email generate dal sito
                (messaggi del modulo contatti, email di registrazione e gestione
                account).
              </li>
              <li>
                <strong>Aruba S.p.A.</strong> — gestione delle caselle di posta
                del dominio teamlagang.it.
              </li>
            </ul>
            <p>
              I dati possono inoltre essere comunicati ad autorità competenti
              qualora previsto dalla legge.
            </p>
          </Block>

          <Block n="07" title="Contenuti e servizi di terze parti">
            <p>
              La mappa della pista è realizzata con la libreria Leaflet e
              utilizza tessere cartografiche fornite da{" "}
              <strong>OpenStreetMap</strong> e <strong>CARTO</strong>. Quando
              visualizzi la mappa, il tuo browser richiede tali immagini ai server
              di questi fornitori, ai quali viene quindi comunicato il tuo
              indirizzo IP. Questi servizi non installano cookie attraverso il
              nostro sito. I caratteri tipografici sono ospitati direttamente sui
              nostri server e non comportano richieste a terze parti.
            </p>
          </Block>

          <Block n="08" title="Trasferimento dei dati fuori dall'Unione Europea">
            <p>
              Alcuni fornitori (es. Vercel, Resend) possono trattare i dati anche
              al di fuori dello Spazio Economico Europeo. In tali casi il
              trasferimento avviene sulla base delle garanzie previste dagli
              artt. 44 e seguenti del GDPR, in particolare le Clausole
              Contrattuali Standard approvate dalla Commissione Europea.
            </p>
          </Block>

          <Block n="09" title="Trattamento dei dati dei minori">
            <p>
              L&apos;area personale è destinata ai soci e tesserati. Qualora il
              tesserato sia minore di 14 anni, la registrazione e il conferimento
              dei dati devono essere effettuati da chi esercita la responsabilità
              genitoriale, ai sensi dell&apos;art. 8 del GDPR e dell&apos;art.
              2-quinquies del D.Lgs. 196/2003.
            </p>
          </Block>

          <Block n="10" title="Cookie">
            <p>
              Il sito utilizza esclusivamente cookie tecnici necessari. Per il
              dettaglio consulta la{" "}
              <a href="/cookie" className="text-yellow hover:underline">
                Cookie Policy
              </a>
              .
            </p>
          </Block>

          <Block n="11" title="I tuoi diritti">
            <p>
              In qualità di interessato puoi in ogni momento esercitare i diritti
              previsti dagli articoli 15–22 del GDPR: accesso ai tuoi dati,
              rettifica, cancellazione, limitazione e opposizione al trattamento,
              portabilità dei dati e revoca del consenso (ove il trattamento si
              fondi sul consenso).
            </p>
            <p>
              Per esercitarli scrivi a{" "}
              <a href="mailto:info@teamlagang.it" className="text-yellow hover:underline">
                info@teamlagang.it
              </a>
              . Hai inoltre il diritto di proporre reclamo all&apos;Autorità
              Garante per la protezione dei dati personali (Piazza Venezia 11,
              00187 Roma — www.garanteprivacy.it).
            </p>
          </Block>

          <Block n="12" title="Modifiche a questa informativa">
            <p>
              Possiamo aggiornare questa informativa per adeguarla a modifiche
              normative o ai servizi offerti. La versione vigente è sempre
              pubblicata su questa pagina, con la data dell&apos;ultimo
              aggiornamento indicata in alto.
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
      <div className="flex flex-col gap-4 text-ink-dim leading-relaxed [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5 [&_li]:list-disc [&_strong]:text-ink">
        {children}
      </div>
    </div>
  );
}
