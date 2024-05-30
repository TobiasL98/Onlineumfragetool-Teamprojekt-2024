"use client"

import { useState } from "react"
import { useEffect } from "react";
import Link from "next/link";
import Select, { StylesConfig} from 'react-select';


export default function SurveyPage() {
    const [isRotated, setIsRotated] = useState(false);
    const [marginTop, setMarginTop] = useState("0.6rem");
    const [selectedGender, setSelectedGender] = useState("");
    //const [selectedAllergy, setSelectedAllergy] = useState("");
    const [selectedOtherPersons, setSelectedOtherPersons] = useState("");
    //const [selectedWeekday, setSelectedWeekday] = useState("");
    const [selectedTime, setSelectedTime] = useState("");

    type OptionType = {
        value: string;
        label: string;
    };

    type WeekdayType = {
        [key: string]: boolean;
        monday: boolean;
        tuesday: boolean;
        wednesday: boolean;
        thursday: boolean;
        friday: boolean;
        saturday: boolean;
        noPreferredDay: boolean;
    };

    type AllergyType = {
        [key: string]: boolean;
        gluten: boolean;
        soja: boolean;
        lactose: boolean;
        peanuts: boolean;
        fructose: boolean;
        noAllergies: boolean;
        otherAllergies: boolean;
    };

    const [selectedWeekday, setSelectedWeekday] = useState<WeekdayType>({
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false,
        noPreferredDay: false,
    });

    const weekdayOptions = [
        { value: 'monday', label: 'Montag' },
        { value: 'tuesday', label: 'Dienstag' },
        { value: 'wednesday', label: 'Mittwoch' },
        { value: 'thursday', label: 'Donnerstag' },
        { value: 'friday', label: 'Freitag' },
        { value: 'saturday', label: 'Samstag' },
        { value: 'noPreferredDay', label: 'Kein bevorzugter Tag' },
    ];

    const timeOptions = [
        { value: 'morning', label: 'Morgens 08:00-10:00' },
        { value: 'forenoon', label: 'Vormittags 10:00-12:00' },
        { value: 'noon', label: 'Mittags 12:00-14:00' },
        { value: 'afternoon', label: 'Nachmittags 14:00-17:00' },
        { value: 'evening', label: 'Abends 17:00-20:00' },
        { value: 'noPreferredTime', label: 'Keine bevorzugte Zeit' },
    ];

    const nutritionOptions = [
        { value: 'vegan', label: 'Vegan' },
        { value: 'vegetarian', label: 'Vegetarisch' },
        { value: 'omnivore', label: 'Omnivor' },
    ];

    const occupationOptions = [
        { value: 'fulltime', label: 'Vollzeit / Unflexible Arbeitszeiten' },
        { value: 'parttime', label: 'Teilzeit / Flexible Arbeitszeiten / Hausarbeit' },
        { value: 'retired', label: 'Rente' },
        { value: 'student', label: 'Student' },
        { value: 'pupil', label: 'Schüler' },
        { value: 'unemployed', label: 'Arbeitslos' },
    ];

    const [selectedAllergies, setSelectedAllergy] = useState<AllergyType>({
        gluten: false,
        soja: false,
        lactose: false,
        peanuts: false,
        fructose: false,
        noAllergies: false,
        otherAllergies: false,
    });

    const allergyOptions = [
        { value: 'gluten', label: 'Gluten' },
        { value: 'soja', label: 'Soja' },
        { value: 'lactose', label: 'Laktose' },
        { value: 'peanuts', label: 'Erdnüsse' },
        { value: 'fructose', label: 'Fruktose' },
        { value: 'noAllergies', label: 'Keine' },
        { value: 'otherAllergies', label: 'Andere' },
    ];

    const selectStyles: StylesConfig = {
        control: (styles, {  isFocused}) => ({
            ...styles,
            backgroundColor  : 'rgba(var(--inputBackgroundColor), 1)',
            borderColor
                : isFocused ? 'rgba(204, 204, 204, 1) !important'
                : 'rgba(var(--inputBorderColor), 1)',
            boxShadow
                : isFocused ? 'transparent'
                : 'transparent',
            borderRadius: '0.375rem',
            color: 'rgba(var(--inputBorderColor), 1)',
            fontSize: '80%',
        }),
        menu: (styles) => ({
            ...styles,
            // TO DO: Make border in menu show
            backgroundColor: 'rgba(43, 57, 65, 1) !important',
            border: '1px solid rgba(var(--inputBorderColor), 1) !important',
            borderColor: 'rgba(var(--inputBorderColor), 1) !important',
            fontSize: '80%',
        }),
        indicatorsContainer: (styles) => ({
            ...styles,
            color: 'rgba(var(--inputBorderColor), 1)',
        }),
        option: (styles, {  isFocused, isSelected }) => ({
            ...styles,
            backgroundColor
                : isSelected
                    ? 'rgba(var(--dropdown-hover-color), 1)'
                : isFocused
                    ? 'rgba(var(--dropdown-hover-color), 0.2)'
                : undefined,
            color
                : isSelected
                    ? 'white'
                : isFocused
                    ? 'white'
                : undefined,
            border: '1px solid rgba(var(--inputBorderColor), 1) !important',

            borderBottom: '1px solid rgba(var(--inputBorderColor), 1)',
        }),
        singleValue: (styles) => ({
            ...styles,
            color:  'rgba(204, 204, 204, 1) !important',
            textAlign: 'left',
        }),
        placeholder: (styles) => ({
            ...styles,
            color: 'rgba(var(--inputBorderColor), 1)',
            textAlign: 'left',
        }),
        input: (styles) => ({
            ...styles,
            color:  'rgba(204, 204, 204, 1) !important',
        }),
    };

    useEffect(() => {
        const isAnyWeekdaySelected = Object.values(selectedWeekday).some(value => value);
        const enterWeekdayDiv = document.getElementById('enterWeekday');
        if (isAnyWeekdaySelected && enterWeekdayDiv) {
            enterWeekdayDiv.style.display = 'none';
        }
    }, [selectedWeekday]);

    useEffect(() => {
        const isTimeSelected = selectedTime !== "";
        const enterTimeOptionDiv = document.getElementById('enterTimeOption');
        if (isTimeSelected && enterTimeOptionDiv) {
            enterTimeOptionDiv.style.display = 'none';
        }
    }, [selectedTime])

    function handleCaretClick() {
        const optionalQuestions = document.getElementById('optionalQuestions');

        if (optionalQuestions) {
            if (optionalQuestions.style.display === 'none' || !optionalQuestions.style.display) {
                optionalQuestions.style.display = 'flex';
                setIsRotated(true);
                setMarginTop("0.2rem");
            } else {
                optionalQuestions.style.display = 'none';
                setIsRotated(false);
                setMarginTop("0.6rem");
            }
        }
    }

    function handleContinueClick(event: React.MouseEvent) {
        const isAnyWeekdaySelected = Object.values(selectedWeekday).some(value => value);
        const isTimeSelected = selectedTime !== "";

        if (!isAnyWeekdaySelected) {
            const enterWeekdayDiv = document.getElementById('enterWeekday');
            if (enterWeekdayDiv) {
                enterWeekdayDiv.style.display = 'block';
            }
        }

        if (!isTimeSelected) {
            const enterTimeOptionDiv = document.getElementById('enterTimeOption');
            if (enterTimeOptionDiv) {
                enterTimeOptionDiv.style.display = 'block';
            }
        }

        if (!isAnyWeekdaySelected || !isTimeSelected) {
            event.preventDefault();
        }
    }

    return (
        <div className="w-80-percent flex flex-col items-center justify-center m-5">
            <div className="flex rounded-3xl w-full bg-borderBackgroundColor m-5">
                <form className="w-3/5 flex flex-col items-center justify-center flex-grow">
                    <div className="flex flex-col m-5 mb-5 mt-7">
                        <div className="flex text-center justify-center">
                            <p>An welchem Wochentag gehen Sie für gewöhnlich einkaufen?<span className="p-2" style={{color: 'red'}}>*</span></p>
                        </div>
                        <div id="enterWeekday" className="pt-1 pl-5 hidden opacity-75 hint" style={{color:'red'}}>
                            * Bitte wählen Sie mindestens eine Option.
                        </div>
                        <small className="pl-5 pr-8 text-center flex flex-wrap mt-3 mb-5">
                            {weekdayOptions.map((option) => (
                                <label key={option.value} className="flex items-center m-2">
                                    <input
                                        type="checkbox"
                                        checked={selectedWeekday[option.value]}
                                        onChange={() => setSelectedWeekday(prev => ({ ...prev, [option.value]: !prev[option.value] }))}
                                        className="styled-checkbox mr-2 border border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none"
                                    />
                                    {option.label}
                                </label>
                            ))}
                        </small>
                        <div className="hint opacity-30 flex p-1 pl-5">
                            <div className="flex">
                                <p className="mr-1  font-bold">Hinweis: </p> Sie können mehrere Tage auswählen, jedoch wird anschließend
                                nur eine Einkaufsstrategie für alle ausgewählten Tage angewendet.
                                Sie können die Umfrage für verschiedene Tage wiederholen.
                            </div>
                        </div>
                    </div>
                </form>
                <p className="my-4 flex-grow border-l border-borderSeparatorColor"></p>
                <form className="w-3/5 flex flex-col items-center flex-grow">
                    <div className="flex flex-col m-5 mb-5 mt-7">
                        <div className="text-center">
                            <p>Zu welcher Tageszeit gehen Sie für gewöhnlich einkaufen?<span className="p-2" style={{color: 'red'}}>*</span></p>
                        </div>
                        <div id="enterTimeOption" className="pt-1 hidden opacity-75 hint" style={{color:'red'}}>
                            * Bitte wählen Sie eine Option.
                        </div>
                        <div className="flex justify-center mt-5">
                            <Select
                                className="mb-1 mx-6 w-80-percent bg-inputBackgroundColor text-inputBorderColor"
                                options={timeOptions}
                                styles={selectStyles}
                                placeholder="Bitte wählen"
                                onChange={(newValue: unknown, actionMeta) => {
                                    const option = newValue as OptionType | null;
                                    if (actionMeta.action === 'select-option' || actionMeta.action === 'clear') {
                                        setSelectedTime(option ? option.value : "");
                                    }
                                }}
                            />
                        </div>
                    </div>
                </form>
            </div>
            <div className="flex flex-col w-full justify-center rounded-3xl bg-borderBackgroundColor text-center m-5 mb-7 p-3 px-5">
                <div className="flex items-start align-center p-2">
                    <button
                        className="border border-l-transparent border-t-transparent border-b-buttonBorderColor border-r-buttonBorderColor p-1 mx-1"
                        style={{ transform: isRotated ? "rotate(45deg)" : "rotate(225deg)", marginTop: marginTop }}
                        onClick={handleCaretClick}
                    >
                    </button>
                    <div className="px-2">
                        Weitere Fragen
                    </div>
                    <div className="text-buttonBorderColor">
                        (optional)
                    </div>
                </div>
                <div id="optionalQuestions" className="hidden border-t border-t-borderSeparatorColor ">
                    <form className="w-3/5 flex flex-col items-center flex-grow">
                        <div className="flex flex-col m-6">
                            <div className="flex">
                                <div className="ml-2 mr-3 flex">
                                    Alter in Jahren
                                </div>
                                <input
                                    className="px-1 h-6 w-15-percent rounded-lg border border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none focus:outline-inputBorderColor"
                                ></input>
                            </div>
                            <p className="my-5 flex-grow border-b border-b-borderSeparatorColor"></p>
                            <div className="flex flex-col">
                                <div className="flex ml-2 mb-3">
                                    Bitte geben Sie Ihr Geschlecht an
                                </div>
                                <div className="flex">
                                    <small className="mx-2 ml-5">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="gender"
                                                value="male"
                                                checked={selectedGender === "male"}
                                                onClick={() => setSelectedGender(prev => prev === "male" ? "" : "male")}
                                                className="mr-2 rounded-lg border border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none"
                                            />
                                            Männlich
                                        </label>
                                    </small>
                                    <small className="mx-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="female"
                                                value="female"
                                                checked={selectedGender === "female"}
                                                onClick={() => setSelectedGender(prev => prev === "female" ? "" : "female")}
                                                className="mr-2 rounded-lg border border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none"
                                            />
                                            Weiblich
                                        </label>
                                    </small>
                                    <small className="mx-2">
                                        <label className="flex items-center">
                                            <input
                                                type="radio"
                                                name="divers"
                                                value="divers"
                                                checked={selectedGender === "divers"}
                                                onClick={() => setSelectedGender(prev => prev === "divers" ? "" : "divers")}
                                                className="mr-2 rounded-lg border border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none"
                                            />
                                            Divers
                                        </label>
                                    </small>
                                </div>
                            </div>
                            <p className="my-5 flex-grow border-b border-b-borderSeparatorColor"></p>
                            <div className="flex">
                                <div className="flex ml-2 mr-3">
                                    Ernährungsstil
                                </div>
                                <Select
                                    className="mr-4 w-full bg-inputBackgroundColor text-inputBorderColor"
                                    options={nutritionOptions}
                                    styles={selectStyles}
                                    placeholder="Bitte wählen"
                                />
                            </div>
                            <p className="my-5 flex-grow border-b border-b-borderSeparatorColor"></p>
                            <div className="flex">
                                <div className="flex ml-2 mr-3">
                                    Berufstätigkeit
                                </div>
                                <Select
                                    className="mr-4  w-full bg-inputBackgroundColor text-inputBorderColor"
                                    options={occupationOptions}
                                    styles={selectStyles}
                                    placeholder="Bitte wählen"
                                />
                            </div>
                        </div>
                    </form>
                    <p className="my-4 flex-grow border-l border-borderSeparatorColor"></p>
                    <form className="w-3/5 flex flex-col items-center flex-grow">
                        <div className="flex flex-col m-6">
                            <div className="">
                                <div className="flex ml-2 mb-3">
                                    Für wie viele weitere Personen kaufen sie ein?
                                </div>
                                <div className="flex ml-5">
                                    <div className="flex flex-col" style={{width: "45%"}}>
                                        <div className="flex justify-between">
                                            <small className="">
                                                Anzahl Erwachsene
                                            </small>
                                            <input
                                                className="px-1 h-6 w-min-2 w-20-percent rounded-lg border border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none focus:outline-inputBorderColor"
                                            ></input>
                                        </div>
                                        <div className="flex justify-between mt-2">
                                            <small className="">
                                                Anzahl Kinder
                                            </small>
                                            <input
                                                className="px-1 ml-8 h-6 w-min-2 w-20-percent rounded-lg border border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none focus:outline-inputBorderColor"
                                            ></input>
                                        </div>
                                    </div>
                                    <div className="flex">
                                        <small className="ml-10">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="noOtherPersons"
                                                    value="noOtherPersons"
                                                    checked={selectedOtherPersons === "noOtherPersons"}
                                                    onClick={() => setSelectedOtherPersons(prev => prev === "noOtherPersons" ? "" : "noOtherPersons")}
                                                    className="mr-2 rounded-lg border border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none"
                                                />
                                                Keine
                                            </label>
                                        </small>
                                    </div>
                                </div>
                            </div>
                            <p className="my-5 flex-grow border-b border-b-borderSeparatorColor"></p>
                            <div className="flex flex-col">
                                <div className="flex ml-2 mb-3">
                                    Allergien / Unverträglichkeiten
                                </div>
                                <div className="grid grid-cols-3 gap-2 ml-5">
                                    {allergyOptions.map((option) => (
                                        <small key={option.value} className="flex justify-start">
                                            <label className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedAllergies[option.value]}
                                                    onChange={() => setSelectedAllergy(prev => ({ ...prev, [option.value]: !prev[option.value] }))}
                                                    className="styled-checkbox mr-2 border border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none"
                                                />
                                                {option.label}
                                            </label>
                                        </small>
                                    ))}
                                    <small className="flex justify-start">
                                        <input
                                            className="flex px-1 justify-start col-span-2 h-6 rounded-lg border border-inputBorderColor bg-inputBackgroundColor text-inputBorderColor focus:outline-none focus:outline-inputBorderColor"
                                            style={{marginLeft: '-4rem'}}
                                        ></input>
                                    </small>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <div className="flex justify-between w-full">
                <Link className="flex justify-start w-full" href="/user">
                    <button className="font-mono border border-buttonBorderColor bg-buttonBackgroundColor p-1 px-4 text-buttonBorderColor">
                        Zurück
                    </button>
                </Link>
                <Link className="flex justify-end w-full" href="/shoppingStrategy">
                    <button
                        className="font-mono border border-buttonBorderColor bg-buttonBackgroundColor p-1 px-4 text-buttonBorderColor"
                        onClick={handleContinueClick}
                    >
                        Weiter
                    </button>
                </Link>
            </div>
        </div>
    );
}
