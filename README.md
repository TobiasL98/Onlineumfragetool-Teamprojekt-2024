

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

<table>
  <tr>
    <td>Home Page</td>
    <td>Umfrage starten</td>
  </tr>
  <tr>
    <td>Survey Page</td>
    <td>Pflichtfelder:<br>
      <ul>
        <li>Wochentag anklicken</li>
        <li>Tagezzeit ausw&auml;hlen</li>
      </ul>
      Optionale Felder:<br>
      <ul>
        <li>Alter</li>
        <li>Geschlecht</li>
        <li>Berufst&auml;tigkeit</li>
        <li>Ern&auml;hrungstil</li>
        <li>Anzahl an Erwachsene/Kinder für die eingekauft werden</li>
      </ul>
      Weiter Button:<br>
      <ul>
        <li>Speichern der User Daten in der Datenbank</li>
        <li>Weiterleiten zur ShoppingStrategy Page</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>ShoppingStrategy Page</td>
    <td>
      <ul>
        <li>Per Linksklick ist es möglich die Reihenfolge durchzuklicken in welcher der Einkauf statt findet.</li>
        <li>Aus dem Contextmenu wird die Dauer ausgewählt, die am Regal verbracht wird.</li>
        <li>Per Rechtklick ist es möglich ein Regal/Kasse wieder zu entwählen. Zuletzt muss eine Kasse ausgewählt worden sein.</li>
      </ul>
      Fertig Button:
      <ul>
        <li>Speichern der angeklickten Supermarkt Route in der Datenbank</li>
        <li>Lokales Speichern des SupermarktLayout als JSON mit transformierten Koordinaten (*_supermarket.json). <strong>wichtig: JSON Dateien mit dieser Datenstruktur werden für die PersonenFlow Berechnungen genutzt!</strong></li>
        <li>Weiterleiten zur ThankYou Page</li>        
      </ul>
    </td>
  </tr>
  <tr>
    <td>ThankYou Page</td>
    <td>Umfrage Beenden Button zum
      Beenden der Umfrage und weiterleiten zur Home Page</td>
  </tr>
</table>

### **Als Admin**

<table>
  <tr>
    <td>Login Page</td>
    <td>Login mit:
      <ul><li>Username: admin</li><li>Password: 1234567890</li></ul>
    </td>
  </tr>
  <tr>
    <td>Home Page</td>
    <td>
      <ul>        
        <li>Neues Layout: Weiterleiten zur Edit Page</li>
        <li>Supermarkt Vorlage laden: Weiterleiten zur Edit Page, aber mit Supermarkt Vorlage als Startlayout</li>
        <li>Eigene Vorlage laden: Weiterleiten zur Edit Page und öffnen des File Explorers um eine eigene
          JSON Datei hochzuladen als Start Layout</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>Edit Page</td>
    <td>
      <ul>
        <li>Layout Name ändern ("Ihr Layout" is ein Textfeld)</li>
        <li>Supermarkt Vorlage hochladen</li>
        <li>Wände</li>
        <li>Türen (in *_supermarket.json als "Entrance")</li>
        <li>Regale (rotierbar)</li>
        <li>Kasse (in *_supermarket.json als "Exit") (rotierbar)</li>
        <li>Speichern Button:
          <ul>
            <li>Lokales Speichern des
              Layouts als JSON (mit invertierter Y-Achse). <strong>wichtig: Nur JSON Dateien mit dieser Datenstruktur können verwendet werden um als Admin ein Layout in der Edit Page hochzuladen!</strong></li>
            <li>Das gespeicherte Layout
         ist nun das current_supermarket.json (im public folder) und ist nun
         das Layout, welches für den User auf der ShoppingStrategy Page
         angezeigt wird.</li>
          </ul>
        </li>
      </ul>
    </td>
  </tr>
  <tr>
    <td>Results Page</td>
    <td>
      Zukunftsmusik: Hier soll
      für bestimmte Wochentage/Uhrzeiten, die Routen im Layout dargestellt
      werden.
    </td>
  </tr>
</table>
