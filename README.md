This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Authentication

add a session key to the .env.local file: zB: NEXT_PUBLIC_SESSION_SECRET=1234567890

## Start Database

before running the database make sure you have added the database url key to your .env file, if not present yet. (Is currently in the .env file already (but should be changed in the fututre for security reasons)

start the database with npx drizzle-kit studio

if the database scheme was changed first regenerate the meta data for the scheme with the command: 

``npx drizzle-kit generate --dialect postgresql``

(keep in mind that sometimes its can be useful to first delete the previous meta data and also delete the lines with BEGIN END etc)

and then push the changes into the database with: 
``npm run db:migrate ``

## Learn More

To learn more about Next.js, take a look at the following resources:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.




## **Das Projekt:**

### **Als User**

| Home Page: | ◦ Umfrage starten |
| --- | --- |
| Survey Page: | ◦ Pflichtfelder:
        ▪ WochenTag anklicken
        ▪ Tageszeit auswählen
    ◦ Optionale Felder:
        ▪ Alter
        ▪ Geschlecht
        ▪ Berufstätigkeit
        ▪ Ernährungstil
        ▪ Anzahl an
         Erwachsene/Kinder für die eingekauft werden
        ▪ Allergien/Unverträglichkeiten
    ◦ Weiter Button:
        ▪ Speichern der User Daten
         in der Datenbank
        ▪ Weiterleiten zur
         ShoppingStrategy Page |
| ShoppingStrategy Page: | ◦ Per Linksklick ist es
        möglich die Reihenfolge durchzuklicken in welcher der Einkauf statt
        findet.
    ◦ Aus dem Contextmenu wird
        die Dauer ausgewählt, die am Regal verbracht wird.
    ◦ Per Rechtklick ist es
        möglich ein Regal/Kasse wieder zu entwählen.Zuletzt muss eine Kasse
        ausgewählt worden sein.
    ◦ Fertig Button:
        ▪ Speichern der
         angeklickten Supermarkt Route in der Datenbank
        ▪ Lokales Speichern des
         SupermarktLayout als Json mit transformierten Koordinaten
         (*_supermarket.json). wichtig: JSON Dateien mit dieser
         Datenstruktur werden für die PersonenFlow Berechnungen genutzt!
        ▪ Weiterleiten zur ThankYou
         Page |
| ThankYou Page: | ◦ Umfrage Beenden Button zum
        Beenden der Umfrage und weiterleiten zur Home Page |

### Login:

| Login Page: | ◦ Login mit:
        ▪  username: admin 
        ▪ password: 1234567890 |
| --- | --- |

### Als Admin:

| Home Page: | ◦ Neues LayoutButton:
        Weiterleiten zur Edit Page
    ◦ Supermarkt Vorlage laden
        Button: Weiterleiten zur Edit Page, aber mit Supermarkt Vorlage als
        Start Layout
    ◦ Eigene Vorlage laden:
        Weiterleiten zur Edit Page und öffnen des File Explorers um eine eigene
        JSON Datei hochzuladen als Start Layout |
| --- | --- |
| Edit Page: | ◦ Layout Name ändern
    ◦ Supermarkt Vorlage
        hochladen
    ◦ Eigene Vorlage hochladen
    ◦ Wände
    ◦ Türen (in
        *_supermarket.json als "Entrance") 
    ◦ Regale (rotierbar)
    ◦ Kasse (in
        *_supermarket.json als "Exit") (rotierbar)
    ◦ Speichern Button:
        ▪ Lokales Speichern des
         Layouts als JSON (mit invertierter Y-Achse). wichtig:
         Nur JSON Dateien mit dieser Datenstruktur können verwendet werden um
         als Admin ein Layout in der Edit Page hochzuladen!
        ▪ Das gespeicherte Layout
         ist nun das current_supermarket.json (im public folder) und ist nun
         das Layout, welches für den User auf der ShoppingStrategy Page
         angezeigt wird. |
| Results Page: | ◦ Zukunftsmusik: Hier soll
        für bestimmte Wochentage/Uhrzeiten, die Routen im Layout dargestellt
        werden. |
