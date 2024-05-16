import Headline from "components/Headline";
import Link from "next/link";

export default function ThankYouPage() {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="text-center">
                <Headline
                    className="w-full flex-grow"
                >
                    <h1 className="text-4xl font-medium">
                        Vielen Dank für Ihre Teilnahme!
                    </h1>
                </Headline>
                <div className="mx-72">
                    <p className="my-5 mb-9">
                        Ihre Antworten wurden gespeichert.
                    </p>
                    <h3 className="mt-10 my-9 font-semibold">
                        Mit Ihrer Teilnahme helfen Sie uns, die Gestaltung von
                        Superm&auml;rkten kontinuierlich zu verbessern!
                    </h3>
                    <h3 className="my-9 font-semibold font-semibold">
                        Vielen Dank f&uuml;r Ihre Unterst&uuml;tzung!
                    </h3>
                </div>
            </div>
            <Link
                className="font-mono mt-10 border border-buttonBorderColor bg-buttonBackgroundColor p-4 text-buttonBorderColor"
                href="/user"
            >
                Umfrage Beenden
            </Link>
        </div>
    );
}