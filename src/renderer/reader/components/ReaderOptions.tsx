// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import * as RadioGroup from "@radix-ui/react-radio-group";
import classNames from "classnames";
import * as QuitIcon from "readium-desktop/renderer/assets/icons/baseline-close-24px.svg";
import * as stylesModals from "readium-desktop/renderer/assets/styles/components/modals.css";
import * as TextAreaIcon from "readium-desktop/renderer/assets/icons/textarea-icon.svg";
import * as LayoutIcon from "readium-desktop/renderer/assets/icons/layout-icon.svg";
import * as AlignLeftIcon from "readium-desktop/renderer/assets/icons/alignleft-icon.svg";
import * as VolumeUpIcon from "readium-desktop/renderer/assets/icons/volup-icon.svg";
import * as SwatchesIcon from "readium-desktop/renderer/assets/icons/swatches-icon.svg";
import * as ScrollableIcon from "readium-desktop/renderer/assets/icons/scroll-icon.svg";
import * as PaginatedIcon from "readium-desktop/renderer/assets/icons/page-icon.svg";
import * as TwoColsIcon from "readium-desktop/renderer/assets/icons/2cols-icon.svg";
import * as AlignAutoIcon from "readium-desktop/renderer/assets/icons/align-auto-icon.svg";
import * as AlignJustifyIcon from "readium-desktop/renderer/assets/icons/align-justify-icon.svg";
import * as AlignRightIcon from "readium-desktop/renderer/assets/icons/align-right-icon.svg";
import * as DoneIcon from "readium-desktop/renderer/assets/icons/done.svg";
import SVG, { ISVGProps } from "readium-desktop/renderer/common/components/SVG";
// import { TDispatch } from "readium-desktop/typings/redux";
// import fontList, { FONT_ID_DEFAULT, FONT_ID_VOID } from "readium-desktop/utils/fontList";

// import { colCountEnum, textAlignEnum } from "@r2-navigator-js/electron/common/readium-css-settings";

import { IPdfPlayerColumn, IPdfPlayerScale, IPdfPlayerView } from "../pdf/common/pdfReader.type";
// import { readerLocalActionSetConfig } from "../redux/actions";
import { IReaderOptionsProps } from "./options-values";
import * as stylesSettings from "readium-desktop/renderer/assets/styles/components/settings.scss";
import { useTranslator } from "readium-desktop/renderer/common/hooks/useTranslator";
import * as stylesButtons from "readium-desktop/renderer/assets/styles/components/buttons.css";
import { ComboBox, ComboBoxItem } from "readium-desktop/renderer/common/components/ComboBox";
import { ReaderConfig } from "readium-desktop/common/models/reader";
import * as stylesReader from "readium-desktop/renderer/assets/styles/reader-app.css";
import debounce from "debounce";
import fontList from "readium-desktop/utils/fontList";
import { readerConfigInitialState } from "readium-desktop/common/redux/states/reader";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IBaseProps extends IReaderOptionsProps {
}

interface IState {
    pdfScale?: IPdfPlayerScale | undefined;
    pdfView?: IPdfPlayerView | undefined;
    pdfCol?: IPdfPlayerColumn | undefined;
}

const TabTitle = ({title}: {title: string}) => {
    return (
        <div className={stylesSettings.settings_tab_title}>
            <h2>{title}</h2>
        </div>
    );
};

/*


const LanguageSettings: React.FC<{}> = () => {
    const [__] = useTranslator();
    const locale = useSelector((state: IRendererCommonRootState) => state.i18n.locale);
    const currentLanguageISO = locale as keyof typeof AvailableLanguages;
    const currentLanguageString = AvailableLanguages[currentLanguageISO];
    const dispatch = useDispatch();
    const [options] = React.useState(() => Object.entries(AvailableLanguages).map(([k,v], i) => ({id: i, name: v, iso: k})));
    const setLang = (localeSelected: React.Key) => {

        if (typeof localeSelected !== "number") return;
        const obj = options.find(({id}) => id === localeSelected);
        dispatch(i18nActions.setLocale.build(obj.iso));
    };
    const selectedKey = options.find(({name}) => name === currentLanguageString);
    return (
        <ComboBox label={__("settings.language.languageChoice")} defaultItems={options} defaultSelectedKey={selectedKey?.id} onSelectionChange={setLang} svg={LanguageIcon}>
            {item => <ComboBoxItem>{item.name}</ComboBoxItem>}
        </ComboBox>
    );
};

 */


const Theme = ({theme, set}: {theme: Pick<ReaderConfig, "night" | "sepia">, set: (a: Pick<ReaderConfig, "night" | "sepia">) => void}) => {
    const [__] = useTranslator();
    const [options] = React.useState(() => [
        {
            id: 1,
            name: `${__("reader.settings.theme.name.Neutral")}`,
            value: "neutral",
        },
        {
            id: 2,
            name: `${__("reader.settings.theme.name.Sepia")}`,
            value: "sepia",
        },
        {
            id: 3,
            name: `${__("reader.settings.theme.name.Night")}`,
            value: "night",
        },
    ]);

    const defaultKey = theme.night ? 3 : theme.sepia ? 2 : 1;

    return (
        <ComboBox label={__("reader.settings.theme.title")} defaultItems={options} defaultSelectedKey={defaultKey} onSelectionChange={(key: React.Key) => {
            set({
                night: key === 3,
                sepia: key === 2,
            });
        }} svg={SwatchesIcon}>
            {item => <ComboBoxItem>{item.name}</ComboBoxItem>}
        </ComboBox>
    );
};

export const FontSize = ({config: {fontSize}, set}: {config: Pick<ReaderConfig, "fontSize">, set: (a: Pick<ReaderConfig, "fontSize">) => void}) => {
    const [__] = useTranslator();

    const [currentSliderValue, setCurrentSliderValue] = React.useState(fontSize.replace(/%/g, ""));

    const click = (direction: string) => {
        const step = 12.5;
        let newStepValue: number;

        if (direction === "out") {
            newStepValue = Number(currentSliderValue.replace(/%/g, "")) - step;
        } else {
            newStepValue = Number(currentSliderValue.replace(/%/g, "")) + step;
        }
        const clampedValue = Math.min(Math.max(newStepValue, 75), 250);
        const valueToString = clampedValue.toFixed(1);
        setCurrentSliderValue(valueToString);
        set({ fontSize: valueToString + "%" });
    };

    return (
        <section className={stylesSettings.section}>
            <h4>{__("reader.settings.fontSize")} ({fontSize})</h4>
            <div className={stylesSettings.size_range}>
                <button onClick={() => click("out")} className={stylesSettings.scale_button}><span>-</span></button>
                <input
                    type="range"
                    aria-labelledby="label_fontSize"
                    min={75}
                    max={250}
                    step={12.5}
                    aria-valuemin={0}
                    value={currentSliderValue}
                    onChange={(e) => {
                        const newValue = e.target?.value || "100";
                        setCurrentSliderValue(newValue);
                        set({ fontSize: newValue + "%" });
                    }
                    }
                />
                <button onClick={() => click("in")} className={stylesSettings.scale_button}><span>+</span></button>
            </div>
        </section>
    );
};

export const FontFamily = ({config: {font}, set}: {config: Pick<ReaderConfig, "font">, set: (a: Pick<ReaderConfig, "font">) => void}) => {
    const [__] = useTranslator();

    // font string value is the ID from FontList or a custom css font name

    console.log("RENDERED FONT ", font);

    // !!! why only 5 items in the combox works, one more trigger the keyboard interaction !!!

    // const options = [
    //     // { id: 0, value: 'DEFAULT', name: 'Original font', fontFamily: '' },
    //     {
    //       id: 1,
    //       value: 'OLD',
    //       name: 'Old Style',
    //       fontFamily: '"Iowan Old Style", "Sitka Text", Palatino, "Book Antiqua", serif'
    //     },
    //     {
    //       id: 2,
    //       value: 'MODERN',
    //       name: 'Modern',
    //       fontFamily: 'Athelas, Constantia, Georgia, serif'
    //     },
    //     {
    //       id: 3,
    //       value: 'SANS',
    //       name: 'Sans',
    //       fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    //     },
    //     {
    //       id: 4,
    //       value: 'HUMAN',
    //       name: 'Humanist',
    //       fontFamily: 'Seravek, Calibri, Roboto, Arial, sans-serif'
    //     },
    //     {
    //       id: 5,
    //       value: 'DYS',
    //       name: 'Readable (dys)',
    //       fontFamily: 'AccessibleDfa'
    //     },
    //     // {
    //     //   id: 6,
    //     //   value: 'DUO',
    //     //   name: 'Duospace',
    //     //   fontFamily: '"IA Writer Duospace", Consolas, monospace'
    //     // },
    //     {
    //       id: 7,
    //       value: 'MONO',
    //       name: 'Monospace',
    //       fontFamily: '"Andale Mono", Consolas, monospace'
    //     }
    //   ]


    const options = fontList.map((fontItem, id) => ({ id, value: fontItem.id, name: fontItem.label, fontFamily: fontItem.fontFamily }));
    if (fontList.findIndex((v) => v.id === font) < 0) {
        options.push({
            id: fontList.length,
            value: font,
            name: font,
            fontFamily: `${font}, Consolas, monospace`,
        });
    }
    const selected = options.find((v) => v.value === font) || options[0];
    const defaultkey = selected.id;
    const fontFamily = selected.fontFamily;
    const fontName = selected.name;

    const saveFont = (value: string) => {
        let val = value.trim();
        // a"b:c    ;d;<e>f'g&h
        val = val.
            replace(/\t/g, "").
            replace(/"/g, "").
            replace(/:/g, "").
            replace(/'/g, "").
            replace(/;/g, "").
            replace(/</g, "").
            replace(/>/g, "").
            replace(/\\/g, "").
            replace(/\//g, "").
            replace(/&/g, "").
            replace(/\n/g, " ").
            replace(/\s\s+/g, " ");
        if (!val) { // includes empty string (falsy)
            val = undefined;
        }
        set({ font: val });
    };

    const defaultinputvalue = "";
    const [inputval, setInputval] = React.useState(defaultinputvalue);

    return (
        <div className={stylesSettings.section}>
            <ComboBox label={__("reader.settings.font")} defaultItems={options} selectedKey={defaultkey}
                onSelectionChange={
                    (key: React.Key) => {
                        console.log(key);
                        if (key === null) {
                            console.log("fontList new custom value= ",inputval);
                            saveFont(inputval);
                        } else {
                            const value = options.find((v) => v.id === key).value;
                            console.log("fontList save ",value);
                            saveFont(value);
                        }
                    }}
                svg={TextAreaIcon}
                allowsCustomValue
                onInputChange={(v) => setInputval(v)}
                defaultInputValue={defaultinputvalue}>
                {item => <ComboBoxItem>{item.name}</ComboBoxItem>}
            </ComboBox>
            <span
                aria-hidden
                style={{
                    fontSize: "1.4em",
                    lineHeight: "1.2em",
                    display: "block",
                    marginTop: "0.84em",
                    marginBottom: "0.5em",
                    fontFamily,
                }}>{fontName}
            </span>
        </div>
    );
};

interface ITable {
    title: string,
    ariaLabel: string,
    min: number,
    max: number,
    step: number,
    ariaValuemin: number,
    defaultValue: string,
    parameter: "pageMargins" | "wordSpacing" | "letterSpacing" | "paraSpacing" | "lineHeight",
    altParameter: string,
    rem: boolean,
}

const Slider = ({ option, set }: { option: ITable, set: (a: Pick<ReaderConfig, "pageMargins" | "wordSpacing" | "letterSpacing" | "paraSpacing" | "lineHeight">) => void }) => {
    const [currentSliderValue, setCurrentSliderValue] = React.useState(option.defaultValue);

    const click = (direction: string) => {
        const step = option.step;
        let newStepValue: number;

        if (direction === "out") {
            newStepValue = Number(currentSliderValue.replace(/rem/g, "")) - step;
        } else {
            newStepValue = Number(currentSliderValue.replace(/rem/g, "")) + step;
        }
        const clampedValue = Math.min(Math.max(newStepValue, option.min), option.max);
        const valueToString = clampedValue.toFixed(2);
        setCurrentSliderValue(valueToString);
        set({ [option.parameter]: valueToString + (option.rem ? "rem" : "") } as Pick<ReaderConfig, "pageMargins" | "wordSpacing" | "letterSpacing" | "paraSpacing" | "lineHeight">);
    };

    return (
        <section className={stylesSettings.section} key={option.title}>
            <div className={stylesSettings.spacing_heading}>
                <h4>{option.title}</h4>
                <p>{currentSliderValue + (option.rem ? "rem" : "")}</p>
            </div>
            <div className={stylesSettings.size_range}>
                <button onClick={() => click("out")} className={stylesSettings.scale_button}>-</button>
                <input
                    id={option.title}
                    type="range"
                    aria-labelledby={option.ariaLabel}
                    min={option.min}
                    max={option.max}
                    step={option.step}
                    aria-valuemin={option.ariaValuemin}
                    value={currentSliderValue}
                    onChange={(e) => {
                        const newValue = e.target.value;
                        setCurrentSliderValue(newValue);
                        set({ [option.parameter]: newValue + (option.rem ? "rem" : "") } as Pick<ReaderConfig, "pageMargins" | "wordSpacing" | "letterSpacing" | "paraSpacing" | "lineHeight">);
                    }}
                />
                <button onClick={() => click("in")} className={stylesSettings.scale_button}>+</button>
            </div>
        </section>
    );
};


const ReadingSpacing = ({config: {pageMargins, wordSpacing, letterSpacing, paraSpacing, lineHeight}, set }: {config: ReaderConfig, set: (a: Pick<ReaderConfig, "pageMargins" | "wordSpacing" | "letterSpacing" | "paraSpacing" | "lineHeight">) => void }) => {

    const [__] = useTranslator();

    const spacingOptions: ITable[] = [
        {
            title: `${__("reader.settings.margin")}`,
            ariaLabel: "label_pageMargins",
            min: 0.5,
            max: 2,
            step: 0.25,
            ariaValuemin: 0,
            defaultValue: pageMargins,
            parameter: "pageMargins",
            altParameter: `${readerConfigInitialState.pageMargins}`,
            rem: false,
        },
        {
            title: `${__("reader.settings.wordSpacing")}`,
            ariaLabel: "label_wordSpacing",
            min: 0.05,
            max: 1,
            step: 0.05,
            ariaValuemin: 0,
            defaultValue: wordSpacing,
            parameter: "wordSpacing",
            altParameter: `${readerConfigInitialState.wordSpacing}`,
            rem: true,
        },
        {
            title: `${__("reader.settings.letterSpacing")}`,
            ariaLabel: "label_letterSpacing",
            min: 0.05,
            max: 0.5,
            step: 0.05,
            ariaValuemin: 0,
            defaultValue: letterSpacing,
            parameter: "letterSpacing",
            altParameter: `${readerConfigInitialState.letterSpacing}`,
            rem: true,
        },
        {
            title: `${__("reader.settings.paraSpacing")}`,
            ariaLabel: "label_paraSpacing",
            min: 0.5,
            max: 3,
            step: 0.5,
            ariaValuemin: 0,
            defaultValue: paraSpacing,
            parameter: "paraSpacing",
            altParameter: `${readerConfigInitialState.paraSpacing}`,
            rem: true,
        },
        {
            title: `${__("reader.settings.lineSpacing")}`,
            ariaLabel: "label_lineHeight",
            min: 0.5,
            max: 3,
            step: 0.5,
            ariaValuemin: 0,
            defaultValue: lineHeight,
            parameter: "lineHeight",
            altParameter: `${readerConfigInitialState.lineHeight}`,
            rem: true,
        },
    ];

    return (
        <div className={stylesSettings.settings_tab_container_reading_spacing}>
            {spacingOptions.map((option: ITable) => (
                <Slider option={option} key={option.title} set={set}/>
            ))}
        </div>
    );

};

interface IRadioGroupItemProps {
    value: string;
    svg: ISVGProps;
    description: string;
    disabled: boolean;
};

const RadioGroupItem = (props: IRadioGroupItemProps) => {
    return (
        <RadioGroup.Item value={props.value} id={props.value} className={stylesSettings.display_options_item} disabled={props.disabled}>
            <SVG ariaHidden svg={props.svg} />
            {props.description}
        </RadioGroup.Item>
    );
};

const ReadingDisplayLayout = ({config: {paged: layout}, set}: {config: Pick<ReaderConfig, "paged">, set: (a: Pick<ReaderConfig, "paged">) => void}) => {
    const [__] = useTranslator();
    return (
        <div className={stylesSettings.section}>
            <h4>{__("reader.settings.disposition.title")}</h4>
            <div className={stylesSettings.display_options}>
                <RadioGroup.Root orientation="horizontal" style={{ display: "flex" }} value={layout ? "page_option" : "scroll_option"}
                    onValueChange={(v) => set({ paged: v === "page_option" })}
                >
                    <RadioGroupItem value="scroll_option" description={`${__("reader.settings.scrolled")}`} svg={ScrollableIcon} disabled={false}/>
                    <RadioGroupItem value="page_option" description={`${__("reader.settings.paginated")}`} svg={PaginatedIcon} disabled={false}/>
                </RadioGroup.Root>
            </div>
        </div>
    );
};

const ReadingDisplayCol = ({ config: { paged, colCount }, set }: { config: Pick<ReaderConfig, "paged" | "colCount">, set: (a: Pick<ReaderConfig, "colCount">) => void }) => {
    const [__] = useTranslator();
    const scrollable = !paged;

    const [state, setState] = React.useState(scrollable ? "auto" : colCount);
    React.useEffect(() => {
        scrollable ? setState("auto") : setState(colCount);
    }, [scrollable, colCount]);

    return (
        <section className={stylesSettings.section}>
            <div>
                <h4>{__("reader.settings.column.title")}</h4>
            </div>
            <div className={stylesSettings.display_options}>
                <RadioGroup.Root orientation="horizontal" style={{ display: "flex" }} value={state}
                        onValueChange={(v) => set({colCount: v})}
                    >
                        <RadioGroupItem value="auto" description={`${__("reader.settings.column.auto")}`} svg={AlignJustifyIcon} disabled={false} />
                        <RadioGroupItem value="1" description={`${__("reader.settings.column.one")}`} svg={AlignJustifyIcon} disabled={scrollable} />
                        <RadioGroupItem value="2" description={`${__("reader.settings.column.two")}`} svg={TwoColsIcon} disabled={scrollable} />
                </RadioGroup.Root>
            </div>
        </section>
    );
};

const ReadingDisplayAlign = ({ config: { align }, set }: { config: Pick<ReaderConfig, "align">, set: (a: Pick<ReaderConfig, "align">) => void }) => {
    const [__] = useTranslator();

    return (
        <section className={stylesSettings.section}>
            <div>
                <h4>{__("reader.settings.justification")}</h4>
            </div>
            <div className={stylesSettings.display_options}>
            <RadioGroup.Root orientation="horizontal" style={{ display: "flex" }} value={align}
                    onValueChange={(v) => set({align: v})}
                >
                    <RadioGroupItem value="auto" description={`${__("reader.settings.column.auto")}`} svg={AlignAutoIcon} disabled={false} />
                    <RadioGroupItem value="justify" description={`${__("reader.settings.justify")}`} svg={AlignJustifyIcon} disabled={false} />
                    <RadioGroupItem value="start" description={`${__("reader.svg.right")}`} svg={AlignRightIcon} disabled={false} />
            </RadioGroup.Root>
            </div>
        </section>
    );
};

const ReadingAudio = ({ config: { mediaOverlaysEnableCaptionsMode: captions, mediaOverlaysEnableSkippability: skippability, ttsEnableSentenceDetection: splitTTStext }, set }:
    { config: Pick<ReaderConfig, "mediaOverlaysEnableCaptionsMode" | "mediaOverlaysEnableSkippability" | "ttsEnableSentenceDetection">,
    set: (a: Partial<Pick<ReaderConfig, "mediaOverlaysEnableCaptionsMode" | "mediaOverlaysEnableSkippability" | "ttsEnableSentenceDetection">>) => void }) => {
    const [__] = useTranslator();

    const options = [
        {
            id: "captions",
            name: "Captions",
            label: `${__("reader.media-overlays.captions")}`,
            description: "Mauris aliquet ligula ac augue aliquet sollicitudin. Nunc eget hendrerit lectus.",
            checked: captions,
            onChange: () => {
                set({ mediaOverlaysEnableCaptionsMode: !captions });
            },
        },
        {
            id: "skippability",
            name: "Skippability",
            label: `${__("reader.media-overlays.skip")}`,
            description: "Ut ex justo, rhoncus vitae magna eget, fringilla ullamcorper ligula.",
            checked: skippability,
            onChange: () => {
                set({ mediaOverlaysEnableSkippability: !skippability });
            },
        },
        {
            id: "splitTTStext",
            name: "splitTTStext",
            label: `${__("reader.tts.sentenceDetect")}`,
            description: "Nunc at purus ut mauris tincidunt egestas non at velit. In dolor massa, commodo at diam a, dictum faucibus sem.",
            checked: splitTTStext,
            onChange: () => {
                set({ ttsEnableSentenceDetection: !splitTTStext });
            },
        },
    ];

    return (
        <div>
            {options.map((option) => (
                <section className={stylesSettings.section} key={option.id}>
                    <div>
                        <input
                            id={option.id}
                            type="checkbox"
                            name={option.name}
                            onChange={option.onChange}
                            defaultChecked={option.checked}
                        />
                        <label htmlFor={option.id}>{option.label}</label>
                        <p className={stylesSettings.session_text}>{option.description}</p>
                    </div>
                </section>

            ))}
        </div>
    );
};

const ReadingDisplayMathJax = ({ config: { enableMathJax, reduceMotion, noFootnotes }, set }:
    { config: Pick<ReaderConfig, "enableMathJax" | "reduceMotion" | "noFootnotes">,
    set: (a: Partial<Pick<ReaderConfig, "enableMathJax" | "reduceMotion" | "noFootnotes" | "paged">>) => void }) => {
    const [__] = useTranslator();

    const options = [
        {
            id: "mathjax",
            name: "mathjax",
            label: "MathJax",
            description:  "MathJax",
            checked: enableMathJax,
            onChange: () => {
                if (enableMathJax === false) {
                    set({ paged: false, enableMathJax: true });
                }
                set({ enableMathJax: false });
            },
        },
        {
            id: "reduceMotionCheckBox",
            name: "reduceMotionCheckBox",
            label: __("reader.settings.reduceMotion"),
            checked: reduceMotion,
            onChange: () => {
                set({ reduceMotion: !reduceMotion });
            },
        },
        {
            id: "noFootnotesCheckBox",
            name: "noFootnotesCheckBox",
            label: __("reader.settings.noFootnotes"),
            checked: noFootnotes,
            onChange: () => {
                set({ noFootnotes: !noFootnotes });
            },
        },
    ];

    return (
        <div>
            {options.map((option) => (
                <section className={stylesSettings.section} key={option.id}>
                    <div>
                        <input
                            id={option.id}
                            type="checkbox"
                            name={option.name}
                            onChange={option.onChange}
                            defaultChecked={option.checked}
                        />
                        <label htmlFor={option.id}>{option.label}</label>
                    </div>
                </section>

            ))}
        </div>
    );
};

const DivinaSetReadingMode = ({ handleDivinaReadingMode, divinaReadingMode, divinaReadingModeSupported}: Partial<IBaseProps>) => {
    const [__] = useTranslator();

    return (
        <div id={stylesReader.themes_list} aria-label={__("reader.settings.disposition.title")} role="radiogroup">
            <div>
                <input
                    disabled={!divinaReadingModeSupported.includes("double")}
                    id={"radio-" + "double"}
                    type="radio"
                    name="divinaReadingMode"
                    onChange={() => {
                        handleDivinaReadingMode("double");
                    }}
                    checked={divinaReadingMode === "double"}
                />
                <label
                    aria-disabled={!divinaReadingModeSupported.includes("double")}
                    htmlFor={"radio-" + "double"}
                >
                    {divinaReadingMode === "double" && <SVG svg={DoneIcon} ariaHidden />}
                    {"double"}
                </label>
            </div>
            <div>
                <input
                    disabled={!divinaReadingModeSupported.includes("guided")}
                    id={"radio-" + "guided"}
                    type="radio"
                    name="divinaReadingMode"
                    onChange={() => {
                        handleDivinaReadingMode("guided");
                    }}
                    checked={divinaReadingMode === "guided"}
                />
                <label
                    aria-disabled={!divinaReadingModeSupported.includes("guided")}
                    htmlFor={"radio-" + "guided"}
                >
                    {divinaReadingMode === "guided" && <SVG svg={DoneIcon} ariaHidden />}
                    {"guided"}
                </label>
            </div>
            <div>
                <input
                    disabled={!divinaReadingModeSupported.includes("scroll")}
                    id={"radio-" + "scroll"}
                    type="radio"
                    name="divinaReadingMode"
                    onChange={() => {
                        handleDivinaReadingMode("scroll");
                    }}
                    checked={divinaReadingMode === "scroll"}
                />
                <label
                    aria-disabled={!divinaReadingModeSupported.includes("scroll")}
                    htmlFor={"radio-" + "scroll"}
                >
                    {divinaReadingMode === "scroll" && <SVG svg={DoneIcon} ariaHidden />}
                    {"scroll"}
                </label>
            </div>
            <div>
                <input
                    disabled={!divinaReadingModeSupported.includes("single")}
                    id={"radio-" + "single"}
                    type="radio"
                    name="divinaReadingMode"
                    onChange={() => {
                        handleDivinaReadingMode("single");
                    }}
                    checked={divinaReadingMode === "single"}
                />
                <label
                    aria-disabled={!divinaReadingModeSupported.includes("single")}
                    htmlFor={"radio-" + "single"}
                >
                    {divinaReadingMode === "single" && <SVG svg={DoneIcon} ariaHidden />}
                    {"single"}
                </label>
            </div>
        </div>
    );
};

const PdfZoom = ({pdfEventBus}: Partial<IBaseProps>) => {
    const [__] = useTranslator();

    const [pdfState, setPdfState] = React.useState<IState>({
        pdfScale: undefined,
        pdfCol: undefined,
        pdfView: undefined,
    });
    const {pdfScale, pdfView} = pdfState;

    const setScale = (scale: IPdfPlayerScale) => {

        console.log("scale", scale);

        setPdfState({
            pdfScale: scale,
        });
    };

    const setView = (view: IPdfPlayerView) => {

        console.log("view", view);

        setPdfState({
            pdfView: view,
        });
    };

    const setCol = (col: IPdfPlayerColumn) => {

        console.log("col", col);

        setPdfState({
            pdfCol: col,
        });
    };

    React.useEffect(() => {
        if (pdfEventBus) {
            pdfEventBus.subscribe("scale", setScale);
            pdfEventBus.subscribe("view", setView);
            pdfEventBus.subscribe("column", setCol);
        }

        return () => {

            if (pdfEventBus) {
                pdfEventBus.remove(setScale, "scale");
                pdfEventBus.remove(setView, "view");
                pdfEventBus.remove(setCol, "column");
            }
        };

    }, [pdfEventBus]);

    const inputComponent = (scale: IPdfPlayerScale, disabled = false) => {
        return <div>
            <input
                id={"radio-" + `${scale}`}
                type="radio"
                name="pdfZoomRadios"
                onChange={() => pdfEventBus.dispatch("scale", scale)}
                checked={pdfScale === scale}
                disabled={disabled}
            />
            <label
                aria-disabled={disabled}
                htmlFor={"radio-" + `${scale}`}
            >
                {pdfScale === scale && <SVG svg={DoneIcon} ariaHidden />}
                {
                    scale === 50 ? __("reader.settings.pdfZoom.name.50pct") :
                        (scale === 100 ? __("reader.settings.pdfZoom.name.100pct") :
                            (scale === 150 ? __("reader.settings.pdfZoom.name.150pct") :
                                (scale === 200 ? __("reader.settings.pdfZoom.name.200pct") :
                                    (scale === 300 ? __("reader.settings.pdfZoom.name.300pct") :
                                        (scale === 500 ? __("reader.settings.pdfZoom.name.500pct") :
                                            (scale === "page-fit" ? __("reader.settings.pdfZoom.name.fit") :
                                                (scale === "page-width" ? __("reader.settings.pdfZoom.name.width") : "Zoom ??!")))))))
                    // --("reader.settings.pdfZoom.name." + scale as any)
                }
            </label>
        </div>;
    };

    return (
        <div id={stylesReader.themes_list} role="radiogroup" aria-label={__("reader.settings.pdfZoom.title")}>
            {inputComponent("page-fit")}
            {inputComponent("page-width", pdfView === "paginated")}
            {inputComponent(50, pdfView === "paginated")}
            {inputComponent(100, pdfView === "paginated")}
            {inputComponent(150, pdfView === "paginated")}
            {inputComponent(200, pdfView === "paginated")}
            {inputComponent(300, pdfView === "paginated")}
            {inputComponent(500, pdfView === "paginated")}
        </div>
    );
};


export const ReaderOptions: React.FC<IBaseProps> = (props) => {
    const { setSettings, readerConfig, open, toggleMenu } = props;
    const [__] = useTranslator();



    const setPartialSettingsDebounced = React.useMemo(() => {
        const saveConfig = (config: Partial<ReaderConfig>) => {
            setSettings({...readerConfig, ...config});
        };
        return debounce(saveConfig, 400);
    }, []);

    React.useEffect(() => {
        setPartialSettingsDebounced.clear();
        return () => setPartialSettingsDebounced.flush();
    }, []);


    if (!readerConfig) {
        return <></>;
    }

    if (!open) {
        return <></>;
    }

    // const { overridePublisherDefault } = readerConfig;
    const overridePublisherDefault = true;

    // const setOverridePublisherDefault = () => {};

    const { isDivina, isPdf } = props;
    const isEpub = !isDivina && !isPdf;

    const sections: Array<React.JSX.Element> = [];

    const TextTrigger =
        <Tabs.Trigger value="tab-text" disabled={overridePublisherDefault ? false : true} key={"tab-text"}>
            <SVG ariaHidden svg={TextAreaIcon} />
            <h3>{__("reader.settings.text")}</h3>
            {overridePublisherDefault ? <></> : <i>{__("reader.settings.disabled")}</i>}
        </Tabs.Trigger>;

    const DivinaTrigger =
        <Tabs.Trigger value="tab-divina" disabled={overridePublisherDefault ? false : true} key={"tab-divina"}>
            <SVG ariaHidden svg={TextAreaIcon} />
            <h3>{__("reader.settings.disposition.title")}</h3>
        </Tabs.Trigger>;

    const SpacingTrigger =
        <Tabs.Trigger value="tab-spacing" disabled={overridePublisherDefault ? false : true} key={"tab-spacing"}>
            <SVG ariaHidden svg={AlignLeftIcon} />
            <h3>{__("reader.settings.spacing")}</h3>
            {overridePublisherDefault ? <></> : <i>{__("reader.settings.disabled")}</i>}
        </Tabs.Trigger>;

    const DisplayTrigger =
        <Tabs.Trigger value="tab-display" key={"tab-display"}>
            <SVG ariaHidden svg={LayoutIcon} />
            <h3>{__("reader.settings.display")}</h3>
        </Tabs.Trigger>;

    const AudioTrigger =
        <Tabs.Trigger value="tab-audio" key={"tab-audio"}>
            <SVG ariaHidden svg={VolumeUpIcon} />
            <h3>{__("reader.media-overlays.title")}</h3>
        </Tabs.Trigger>;

    const PdfZoomTrigger =
        <Tabs.Trigger value="tab-pdfzoom" key={"tab-pdfzoom"}>
            <SVG ariaHidden svg={VolumeUpIcon} />
            <h3>{__("reader.settings.pdfZoom.title")}</h3>
        </Tabs.Trigger>;

    let defaultTabValue = "tab-display";
    if (isDivina) {
        sections.push(DivinaTrigger);
        defaultTabValue = "tab-divina";
    }
    if (isPdf) {
        sections.push(PdfZoomTrigger);
        defaultTabValue = "tab-pdfzoom";
    }
    if (isPdf || isEpub) {
        sections.push(DisplayTrigger);
    }
    if (isEpub) {
        sections.push(AudioTrigger);
        sections.push(TextTrigger);
        sections.push(SpacingTrigger);
    }

    const nightTheme = readerConfig.night;
    const sepiaTheme = readerConfig.sepia; // mutually exclusive

    return (
        <Dialog.Root
            open={open}
            onOpenChange={
                (open) => {
                    console.log("Settings modal state open=", open);
                    toggleMenu();
                }}
        >
            <Dialog.Portal>
                <div className={stylesModals.modal_dialog_overlay}></div>
                <Dialog.Content className={classNames(stylesModals.modal_dialog, nightTheme ? stylesReader.nightMode : sepiaTheme ? stylesReader.sepiaMode : "")}>
                    <Tabs.Root defaultValue={defaultTabValue} data-orientation="vertical" orientation="vertical" className={stylesSettings.settings_container}>
                        <Tabs.List className={stylesSettings.settings_tabslist} aria-orientation="vertical" data-orientation="vertical">
                            {sections}
                        </Tabs.List>
                        <div className={stylesSettings.settings_content}>
                            <Tabs.Content value="tab-divina" tabIndex={-1}>
                                <TabTitle title={__("reader.settings.disposition.title")} />
                                <div className={stylesSettings.settings_tab}>
                                    <DivinaSetReadingMode {...props}/>
                                </div>
                            </Tabs.Content>
                            <Tabs.Content value="tab-pdfzoom" tabIndex={-1}>
                                <TabTitle title={__("reader.settings.disposition.title")} />
                                <div className={stylesSettings.settings_tab}>
                                    <PdfZoom {...props}/>
                                </div>
                            </Tabs.Content>
                            <Tabs.Content value="tab-text" tabIndex={-1}>
                                <TabTitle title={__("reader.settings.text")} />
                                <div className={stylesSettings.settings_tab}>
                                    <FontSize config={readerConfig} set={setPartialSettingsDebounced}/>
                                    <FontFamily config={readerConfig} set={setPartialSettingsDebounced}/>
                                </div>
                            </Tabs.Content>
                            <Tabs.Content value="tab-spacing" tabIndex={-1}>
                                <TabTitle title={__("reader.settings.spacing")} />
                                <div className={stylesSettings.settings_tab}>
                                    <ReadingSpacing config={readerConfig} set={setPartialSettingsDebounced} />
                                </div>
                            </Tabs.Content>
                            <Tabs.Content value="tab-display" tabIndex={-1}>
                                <TabTitle title={__("reader.settings.display")} />
                                <section className={stylesSettings.settings_tab}>
                                    <Theme theme={readerConfig} set={setPartialSettingsDebounced}/>
                                    <ReadingDisplayLayout config={readerConfig} set={setPartialSettingsDebounced}/>
                                    <ReadingDisplayAlign config={readerConfig} set={setPartialSettingsDebounced} />
                                    <ReadingDisplayCol config={readerConfig} set={setPartialSettingsDebounced} />
                                    <ReadingDisplayMathJax config={readerConfig} set={setPartialSettingsDebounced} />
                                </section>
                            </Tabs.Content>
                            <Tabs.Content value="tab-audio" tabIndex={-1}>
                                <TabTitle title={__("reader.media-overlays.title")} />
                                <section className={stylesSettings.settings_tab}>
                                    <ReadingAudio config={readerConfig} set={setPartialSettingsDebounced}/>
                                </section>
                            </Tabs.Content>
                        </div>
                    </Tabs.Root>
                    <div className={stylesSettings.close_button_div}>
                        <Dialog.Close asChild>
                            <button className={stylesButtons.button_transparency_icon} aria-label="Close">
                                <SVG ariaHidden={true} svg={QuitIcon} />
                            </button>
                        </Dialog.Close>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

/*
export class ReaderOptions_ extends React.Component<IProps, IState> {

    public handleSettingChangeDebounced: ThandleSettingChange;

    constructor(props: IProps) {
        super(props);

        .handleSettingChangeDebounced = debounce(this.props.handleSettingChge, 500);

        this.state = {
            pdfScale: undefined,
            pdfCol: undefined,
            pdfView: undefined,
        };

        this.handleChooseTheme = this.handleChooseTheme.bind(this);
    }

    public componentDidUpdate(oldProps: IProps) {

        if (oldProps.pdfEventBus !== this.props.pdfEventBus) {

            this.props.pdfEventBus.subscribe("scale", this.setScale);
            this.props.pdfEventBus.subscribe("view", this.setView);
            this.props.pdfEventBus.subscribe("column", this.setCol);
        }
    }

    public componentWillUnmount() {

        if (this.props.pdfEventBus) {
            this.props.pdfEventBus.remove(this.setScale, "scale");
            this.props.pdfEventBus.remove(this.setView, "view");
            this.props.pdfEventBus.remove(this.setCol, "column");
        }
    }

    public render() {
        const { __, readerConfig, toggleMenu, isDivina, isPdf } = this.props;

        if (!readerConfig) {
            return <></>;
        }

        const isEpub = !isDivina && !isPdf;

        const sections: SectionData[] = [];

        if (isDivina) {

            sections.push({
                    title: __("reader.settings.disposition.title"),
                    content: this.divinaSetReadingMode(),
                });
        }

        if (isEpub) {

            sections.push(
                {
                    title: __("reader.settings.theme.title"),
                    content: this.themeContent(),
                },
                {
                    title: __("reader.settings.text"),
                    content: this.textContent(),
                },
            );
        }

        if (isPdf || isEpub) {
            sections.push(
                {
                    title: __("reader.settings.display"),
                    content: this.displayContent(),
                },
            );

        }

        if (isPdf) {
            sections.push(
                {
                    title: __("reader.settings.pdfZoom.title"),
                    content: this.pdfZoom(),
                },
            );
        }

        if (isEpub) {

            sections.push(
                {
                    title: __("reader.settings.spacing"),
                    content: this.spacingContent(),
                },
                {
                    title: __("reader.media-overlays.title"),
                    content: this.mediaOverlays(),
                },
                {
                    title: __("reader.settings.save.title"),
                    content: this.saveConfig(),
                },
            );
        }

        return (
            <DialogWithRadix>
            <DialogWithRadixTrigger asChild>
                <button
                    className={stylesButtons.button_transparency_icon}
                >
                    <SVG ariaHidden={true} svg={SettingsIcon} />
                </button>
            </DialogWithRadixTrigger>
            <DialogWithRadixContentSettings>
                <ReadingOptions />
            </DialogWithRadixContentSettings>
        </DialogWithRadix>

        )

        // return (
        //     <SideMenu
        //         openedSection={this.props.openedSection}
        //         className={stylesReader.read_settings}
        //         listClassName={stylesReader.read_settings_list}
        //         open={this.props.open}
        //         sections={sections}
        //         toggleMenu={toggleMenu}
        //         doBackFocusMenuButton={this.props.focusSettingMenuButton}
        //     />
        // );
    }

    private setScale = (scale: IPdfPlayerScale) => {

        console.log("scale", scale);

        this.setState({
            pdfScale: scale,
        });
    };

    private setView = (view: IPdfPlayerView) => {

        console.log("view", view);

        this.setState({
            pdfView: view,
        });
    };

    private setCol = (col: IPdfPlayerColumn) => {

        console.log("col", col);

        this.setState({
            pdfCol: col,
        });
    };

    private saveConfig() {

        const { readerConfig, __ } = this.props;

        return (

            <div className={classNames(stylesReader.line_tab_content, stylesReader.config_save)}>

                <button
                    onClick={() => this.props.setDefaultConfig(readerConfig)}
                    aria-hidden={false}
                    // className={className}
                >
                    {
                        __("reader.settings.save.apply")
                    }
                </button>
                <button
                    onClick={() => this.props.setDefaultConfig()}
                    aria-hidden={false}
                    // className={className}
                >
                    {
                        __("reader.settings.save.reset")
                    }
                </button>
            </div>
        );
    }

    private mediaOverlays() {

        const { readerConfig } = this.props;
        return (<>
            <div className={stylesReader.mathml_section}>
                <input
                    id="mediaOverlaysEnableCaptionsModeCheckBox"
                    type="checkbox"
                    checked={readerConfig.mediaOverlaysEnableCaptionsMode}
                    onChange={() => this.toggleMediaOverlaysEnableCaptionsMode()}
                />
                <label htmlFor="mediaOverlaysEnableCaptionsModeCheckBox">{
                    this.props.__("reader.media-overlays.captions")
                }</label>
            </div>
            <div className={stylesReader.mathml_section}>
                <input
                    id="mediaOverlaysEnableSkippabilityCheckBox"
                    type="checkbox"
                    checked={readerConfig.mediaOverlaysEnableSkippability}
                    onChange={() => this.toggleMediaOverlaysEnableSkippability()}
                />
                <label htmlFor="mediaOverlaysEnableSkippabilityCheckBox">{
                    this.props.__("reader.media-overlays.skip")
                }</label>
            </div>
            <div className={stylesReader.mathml_section}>
                <input
                    id="ttsEnableSentenceDetectionCheckBox"
                    type="checkbox"
                    checked={readerConfig.ttsEnableSentenceDetection}
                    onChange={() => this.toggleTTSEnableSentenceDetection()}
                />
                <label htmlFor="ttsEnableSentenceDetectionCheckBox">{
                    this.props.__("reader.tts.sentenceDetect")
                }</label>
            </div>
        </>);
    }

    private divinaSetReadingMode() {

        return (
            <div id={stylesReader.themes_list} aria-label={this.props.__("reader.settings.disposition.title")} role="radiogroup">
                <div>
                    <input
                        disabled={!this.props.divinaReadingModeSupported.includes("double")}
                        id={"radio-" + "double"}
                        type="radio"
                        name="divinaReadingMode"
                        onChange={() => {
                            this.props.handleDivinaReadingMode("double");
                        }}
                        checked={this.props.divinaReadingMode === "double"}
                    />
                    <label
                        aria-disabled={!this.props.divinaReadingModeSupported.includes("double")}
                        htmlFor={"radio-" + "double"}
                    >
                        {this.props.divinaReadingMode === "double" && <SVG svg={DoneIcon} ariaHidden />}
                        { "double" }
                    </label>
                </div>
                <div>
                    <input
                        disabled={!this.props.divinaReadingModeSupported.includes("guided")}
                        id={"radio-" + "guided"}
                        type="radio"
                        name="divinaReadingMode"
                        onChange={() => {
                            this.props.handleDivinaReadingMode("guided");
                        }}
                        checked={this.props.divinaReadingMode === "guided"}
                    />
                    <label
                        aria-disabled={!this.props.divinaReadingModeSupported.includes("guided")}
                        htmlFor={"radio-" + "guided"}
                    >
                        {this.props.divinaReadingMode === "guided" && <SVG svg={DoneIcon} ariaHidden/>}
                        {"guided"}
                    </label>
                </div>
                <div>
                    <input
                        disabled={!this.props.divinaReadingModeSupported.includes("scroll")}
                        id={"radio-" + "scroll"}
                        type="radio"
                        name="divinaReadingMode"
                        onChange={() => {
                            this.props.handleDivinaReadingMode("scroll");
                        }}
                        checked={this.props.divinaReadingMode === "scroll"}
                    />
                    <label
                        aria-disabled={!this.props.divinaReadingModeSupported.includes("scroll")}
                        htmlFor={"radio-" + "scroll"}
                    >
                        {this.props.divinaReadingMode === "scroll" && <SVG svg={DoneIcon} ariaHidden/>}
                        {"scroll"}
                    </label>
                </div>
                <div>
                    <input
                        disabled={!this.props.divinaReadingModeSupported.includes("single")}
                        id={"radio-" + "single"}
                        type="radio"
                        name="divinaReadingMode"
                        onChange={() => {
                            this.props.handleDivinaReadingMode("single");
                        }}
                        checked={this.props.divinaReadingMode === "single"}
                    />
                    <label
                        aria-disabled={!this.props.divinaReadingModeSupported.includes("single")}
                        htmlFor={"radio-" + "single"}
                    >
                        {this.props.divinaReadingMode === "single" && <SVG svg={DoneIcon} ariaHidden />}
                        { "single" }
                    </label>
                </div>
            </div>
        );
    }

    private pdfZoom() {

        const { __ } = this.props;

        const inputComponent = (scale: IPdfPlayerScale, disabled = false) => {
            return <div>
                    <input
                        id={"radio-" + `${scale}`}
                        type="radio"
                        name="pdfZoomRadios"
                        onChange={() => this.props.pdfEventBus.dispatch("scale", scale)}
                        checked={this.state.pdfScale === scale}
                        disabled={disabled}
                    />
                    <label
                        aria-disabled={disabled}
                        htmlFor={"radio-" + `${scale}`}
                    >
                        {this.state.pdfScale === scale && <SVG svg={DoneIcon} ariaHidden />}
                        {
                        scale === 50 ? __("reader.settings.pdfZoom.name.50pct") :
                        (scale === 100 ? __("reader.settings.pdfZoom.name.100pct") :
                        (scale === 150 ? __("reader.settings.pdfZoom.name.150pct") :
                        (scale === 200 ? __("reader.settings.pdfZoom.name.200pct") :
                        (scale === 300 ? __("reader.settings.pdfZoom.name.300pct") :
                        (scale === 500 ? __("reader.settings.pdfZoom.name.500pct") :
                        (scale === "page-fit" ? __("reader.settings.pdfZoom.name.fit") :
                        (scale === "page-width" ? __("reader.settings.pdfZoom.name.width") : "Zoom ??!")))))))
                        // --("reader.settings.pdfZoom.name." + scale as any)
                        }
                    </label>
                </div>;
                // TODO string inference typescript 4.1
        };

        return (
            <div id={stylesReader.themes_list} role="radiogroup" aria-label={__("reader.settings.pdfZoom.title")}>
                {inputComponent("page-fit")}
                {inputComponent("page-width", this.state.pdfView === "paginated")}
                {inputComponent(50, this.state.pdfView === "paginated")}
                {inputComponent(100, this.state.pdfView === "paginated")}
                {inputComponent(150, this.state.pdfView === "paginated")}
                {inputComponent(200, this.state.pdfView === "paginated")}
                {inputComponent(300, this.state.pdfView === "paginated")}
                {inputComponent(500, this.state.pdfView === "paginated")}
            </div>
        );
    }

    private themeContent() {
        const { __, readerConfig } = this.props;
        const withoutTheme = !readerConfig.sepia && !readerConfig.night;
        return (
            <div id={stylesReader.themes_list} role="radiogroup" aria-label={__("reader.settings.theme.title")}>
                <div>
                    <input
                        id={"radio-" + themeType.Without}
                        type="radio"
                        name="theme"
                        onChange={() => this.handleChooseTheme(themeType.Without)}
                        checked={withoutTheme}
                    />
                    <label htmlFor={"radio-" + themeType.Without}>
                        {withoutTheme && <SVG svg={DoneIcon} ariaHidden />}
                        {__("reader.settings.theme.name.Neutral")}
                    </label>
                </div>
                <div>
                    <input
                        id={"radio-" + themeType.Sepia}
                        type="radio"
                        name="theme"
                        onChange={() => this.handleChooseTheme(themeType.Sepia)}
                        checked={readerConfig.sepia}
                    />
                    <label htmlFor={"radio-" + themeType.Sepia}>
                        {readerConfig.sepia && <SVG svg={DoneIcon} ariaHidden />}
                        {__("reader.settings.theme.name.Sepia")}
                    </label>
                </div>
                <div>
                    <input
                        id={"radio-" + themeType.Night}
                        type="radio"
                        name="theme"
                        onChange={() => this.handleChooseTheme(themeType.Night)}
                        checked={readerConfig.night}
                    />
                    <label htmlFor={"radio-" + themeType.Night}>
                        {readerConfig.night && <SVG svg={DoneIcon} ariaHidden />}
                        {__("reader.settings.theme.name.Night")}
                    </label>
                </div>
            </div>
        );
    }

    private textContent() {
        const {__, readerConfig} = this.props;

        // TODO: https://github.com/rBurgett/system-font-families
        const readiumCSSFontID = readerConfig.font;
        const fontListItem = fontList.find((f) => {
            return f.id === readiumCSSFontID && f.id !== FONT_ID_VOID;
        });
        const readiumCSSFontIDToSelect = fontListItem ?
            fontListItem.id : // readiumCSSFontID
            FONT_ID_VOID;
        const readiumCSSFontName = fontListItem ? fontListItem.label : readiumCSSFontID;
        const readiumCSSFontPreview = (readiumCSSFontName === FONT_ID_VOID || fontListItem?.id === FONT_ID_DEFAULT) ?
            " " : readiumCSSFontName;
        const fontFamily = fontListItem?.fontFamily ? fontListItem.fontFamily : `'${readiumCSSFontName}', serif`;

        // <output id={stylesReader.valeur_taille} className={stylesReader.out_of_screen}>14</output>
        return <>
            <div className={stylesReader.line_tab_content}>
                <div id="label_fontSize" className={stylesReader.subheading}>{__("reader.settings.fontSize")}</div>
                <div className={stylesReader.center_in_tab}>
                    <span className={stylesReader.slider_marker} style={{fontSize: "150%"}}>a</span>
                    <input
                        type="range"
                        aria-labelledby="label_fontSize"
                        onChange={(e) => this.props.handleIndexChange(e, "fontSize")}
                        min={0}
                        max={optionsValues.fontSize.length - 1}
                        value={this.props.indexes.fontSize}
                        step={1}
                        aria-valuemin={0}
                        aria-valuemax={optionsValues.fontSize.length - 1}
                        aria-valuenow={this.props.indexes.fontSize}
                    />
                    <span className={stylesReader.slider_marker} style={{fontSize: "250%"}}>a</span>

                    <span className={stylesReader.reader_settings_value}>
                        {readerConfig.fontSize}
                    </span>
                </div>
            </div>
            <div className={stylesReader.line_tab_content}>
                <div id="fontLabel" className={stylesReader.subheading}>{__("reader.settings.font")}</div>
                <div className={stylesReader.center_in_tab} style={{flexDirection: "column"}}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        position: "relative",
                        textAlign: "center",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                    <select
                        title={__("reader.settings.font")}
                        style={{
                            width: fontListItem ? "fit-content" : "4em",
                        }}
                        onChange={(e) => {
                            this.props.handleSettingChange(e, "font");
                        }}
                        value={readiumCSSFontIDToSelect}
                    >
                        {fontList.map((font: Font, id: number) => {
                            return (
                                <option
                                    key={id}
                                    value={font.id}
                                >
                                    {font.label}
                                </option>
                            );
                        })}
                    </select>
                    {
                        !fontListItem &&
                        <input
                            style={{width: "10em", marginLeft: "1em"}}
                            id="fontInput"
                            aria-labelledby="fontLabel"
                            type="text"
                            onChange={(e) => {
                                let val = e.target?.value ? e.target.value.trim() : null;
                                if (!val) { // includes empty string (falsy)
                                    val = undefined;
                                } else {
                                    // a"b:c    ;d;<e>f'g&h
                                    val = val.
                                        replace(/\t/g, "").
                                        replace(/"/g, "").
                                        replace(/:/g, "").
                                        replace(/'/g, "").
                                        replace(/;/g, "").
                                        replace(/</g, "").
                                        replace(/>/g, "").
                                        replace(/\\/g, "").
                                        replace(/\//g, "").
                                        replace(/&/g, "").
                                        replace(/\n/g, " ").
                                        replace(/\s\s+/g, " ");
                                    if (!val) { // includes empty string (falsy)
                                        val = undefined;
                                    }
                                }
                                this.handleSettingChangeDebounced(
                                    undefined, // e
                                    "font",
                                    val);
                            }}
                            placeholder={readiumCSSFontPreview ?? __("reader.settings.font")}
                            alt={readiumCSSFontPreview ?? __("reader.settings.font")}
                        />
                    }
                    </div>
                    <span
                        aria-hidden
                        style={{
                            fontSize: "1.4em",
                            lineHeight: "1.2em",
                            display: "block",
                            marginTop: "0.84em",
                            marginBottom: "0.5em",
                            fontFamily,
                        }}>{readiumCSSFontPreview}</span>
                </div>
            </div>
        </>;
    }

    private displayContent() {
        const {__, readerConfig, isPdf} = this.props;

        return <>
            {
                isPdf
                    ? <></>
                    :
                    <div className={stylesReader.line_tab_content}>
                        <div id="label_disposition" className={stylesReader.subheading}>{__("reader.settings.disposition.title")}</div>
                        <div className={stylesReader.center_in_tab} role="radiogroup" aria-labelledby="label_disposition">
                            <div className={stylesReader.focus_element}>
                                <input
                                    id={stylesReader.scroll_option}
                                    type="radio"
                                    name="disposition"
                                    onChange={(e) => isPdf
                                        ? this.props.pdfEventBus.dispatch("view", "scrolled")
                                        : this.props.handleSettingChange(e, "paged", false)}
                                    checked={isPdf
                                        ? this.state.pdfView === "scrolled"
                                        : !readerConfig.paged}
                                />
                                <label
                                    htmlFor={stylesReader.scroll_option}
                                    className={isPdf
                                        ? this.getButtonClassNamePdf(this.state.pdfView === "scrolled")
                                        : this.getButtonClassName("paged", false)}
                                >
                                    <SVG ariaHidden={true} svg={DefileIcon} />
                                    {__("reader.settings.scrolled")}
                                </label>
                            </div>
                            <div className={stylesReader.focus_element}>
                                <input
                                    id={stylesReader.page_option}
                                    type="radio"
                                    name="disposition"
                                    onChange={(e) => isPdf
                                        ? this.props.pdfEventBus.dispatch("view", "paginated")
                                        : this.props.handleSettingChange(e, "paged", true)}
                                    checked={isPdf
                                        ? this.state.pdfView === "paginated"
                                        : readerConfig.paged}
                                />
                                <label
                                    htmlFor={stylesReader.page_option}
                                    className={isPdf
                                        ? this.getButtonClassNamePdf(this.state.pdfView === "paginated")
                                        : this.getButtonClassName("paged", true)}
                                >
                                    <SVG ariaHidden={true} svg={PagineIcon} />
                                    {__("reader.settings.paginated")}
                                </label>
                            </div>
                        </div>
                    </div>
            }
            <div className={stylesReader.line_tab_content} hidden={this.props.isPdf}>
                <div id="label_justification" className={stylesReader.subheading}>{__("reader.settings.justification")}</div>
                <div className={stylesReader.center_in_tab} role="radiogroup" aria-labelledby="label_justification">
                    <div className={stylesReader.focus_element}>
                        <input
                            id={"radio-" + stylesReader.option_auto}
                            name="alignment"
                            type="radio"
                            onChange={(e) => this.props.handleSettingChange(e, "align", "auto")}
                            checked={readerConfig.align === "auto"}
                        />
                        <label
                            htmlFor={"radio-" + stylesReader.option_auto}
                            className={this.getButtonClassName("align", "auto")}
                        >
                            <SVG ariaHidden={true} svg={PageIcon} />
                            {__("reader.settings.column.auto")}
                        </label>
                    </div>
                    <div className={stylesReader.focus_element}>
                        <input
                            id={"radio-" + stylesReader.option_justif}
                            name="alignment"
                            type="radio"
                            onChange={(e) => this.props.handleSettingChange(e, "align", textAlignEnum.justify)}
                            checked={readerConfig.align === textAlignEnum.justify}
                        />
                        <label
                            htmlFor={"radio-" + stylesReader.option_justif}
                            className={this.getButtonClassName("align", "justify")}
                        >
                            <SVG ariaHidden={true} svg={JustifyIcon} />
                            {__("reader.settings.justify")}
                        </label>
                    </div>
                    <div className={stylesReader.focus_element}>
                        <input
                            id={"radio-" + stylesReader.option_start}
                            name="alignment"
                            type="radio"
                            onChange={(e) => this.props.handleSettingChange(e, "align", textAlignEnum.start)}
                            checked={readerConfig.align === textAlignEnum.start}
                        />
                        <label
                            htmlFor={"radio-" + stylesReader.option_start}
                            className={this.getButtonClassName("align", "start")}
                        >
                            <SVG ariaHidden={true} svg={StartIcon} />
                            {`< ${__("reader.svg.left")} ${__("reader.svg.right")} >`}
                        </label>
                    </div>
                </div>
            </div>
            <div className={stylesReader.line_tab_content}>
                <div id="label_column" className={stylesReader.subheading}>{__("reader.settings.column.title")}</div>
                <div className={stylesReader.center_in_tab} role="radiogroup" aria-labelledby="label_column">
                    {
                        isPdf
                            ? <></>
                            : <div className={stylesReader.focus_element}>
                                <input
                                    id={"radio-" + stylesReader.option_colonne}
                                    type="radio"
                                    name="column"
                                    {...(!readerConfig.paged && { disabled: true })}
                                    onChange={(e) => isPdf
                                        ? this.props.pdfEventBus.dispatch("column", "auto")
                                        : this.props.handleSettingChange(e, "colCount", colCountEnum.auto)}
                                    checked={isPdf
                                        ? this.state.pdfCol === "auto"
                                        : readerConfig.colCount === colCountEnum.auto}
                                />
                                <label
                                    htmlFor={"radio-" + stylesReader.option_colonne}
                                    className={isPdf
                                        ? this.getButtonClassNamePdf(this.state.pdfCol === "auto")
                                        : this.getButtonClassName("colCount",
                                            !readerConfig.paged ? null : colCountEnum.auto,
                                            !readerConfig.paged && stylesReader.disable)}
                                >
                                    <SVG ariaHidden={true} svg={AutoIcon} />
                                    {__("reader.settings.column.auto")}
                                </label>
                            </div>
                    }
                    <div className={stylesReader.focus_element}>
                        <input
                            disabled={!isPdf && !readerConfig.paged ? true : false}
                            id={"radio-" + stylesReader.option_colonne1}
                            type="radio"
                            name="column"
                            onChange={(e) => isPdf
                                ? this.props.pdfEventBus.dispatch("column", "1")
                                : this.props.handleSettingChange(e, "colCount", colCountEnum.one)}
                            checked={isPdf
                                ? this.state.pdfCol === "1"
                                : readerConfig.colCount === colCountEnum.one}
                        />
                        <label
                            htmlFor={"radio-" + stylesReader.option_colonne1}
                            className={isPdf
                                ? this.getButtonClassNamePdf(this.state.pdfCol === "1")
                                : this.getButtonClassName("colCount",
                                    !readerConfig.paged ? null : colCountEnum.one,
                                    !readerConfig.paged && stylesReader.disable)}
                        >
                            <SVG svg={ColumnIcon} title={__("reader.settings.column.oneTitle")} />
                            {__("reader.settings.column.one")}
                        </label>
                    </div>
                    <div className={stylesReader.focus_element}>
                        <input
                            id={"radio-" + stylesReader.option_colonne2}
                            type="radio"
                            name="column"
                            disabled={!isPdf && !readerConfig.paged ? true : false}
                            onChange={(e) => isPdf
                                ? this.props.pdfEventBus.dispatch("column", "2")
                                : this.props.handleSettingChange(e, "colCount", colCountEnum.two)}
                            checked={isPdf
                                ? this.state.pdfCol === "2"
                                : readerConfig.colCount === colCountEnum.two}
                        />
                        <label
                            htmlFor={"radio-" + stylesReader.option_colonne2}
                            className={isPdf
                                ? this.getButtonClassNamePdf(this.state.pdfCol === "2")
                                : this.getButtonClassName("colCount",
                                    !readerConfig.paged ? null : colCountEnum.two,
                                    !readerConfig.paged && stylesReader.disable)
                            }
                        >
                            <SVG svg={Column2Icon} title={__("reader.settings.column.twoTitle")} />
                            {__("reader.settings.column.two")}
                        </label>
                    </div>
                </div>
            </div>
            <div className={stylesReader.line_tab_content} hidden={this.props.isPdf}>
                <div className={stylesReader.mathml_section}>
                    <input
                        id="mathJaxCheckBox"
                        type="checkbox"
                        checked={readerConfig.enableMathJax}
                        onChange={() => this.toggleMathJax()}
                    />
                    <label htmlFor="mathJaxCheckBox">MathJax</label>
                </div>
                <div className={stylesReader.mathml_section}>
                    <input
                        id="reduceMotionCheckBox"
                        type="checkbox"
                        checked={readerConfig.reduceMotion}
                        onChange={() => this.toggleReduceMotion()}
                    />
                    <label htmlFor="reduceMotionCheckBox">{__("reader.settings.reduceMotion")}</label>
                </div>

                <div className={stylesReader.mathml_section}>
                    <input
                        id="noFootnotesCheckBox"
                        type="checkbox"
                        checked={readerConfig.noFootnotes}
                        onChange={() => this.toggleNoFootnotes()}
                    />
                    <label htmlFor="noFootnotesCheckBox">{__("reader.settings.noFootnotes")}</label>
                </div>
            </div>
        </>;
    }

    private spacingContent() {
        const { __, readerConfig } = this.props;
        return <>
            <div className={stylesReader.line_tab_content}>
                <div id="label_pageMargins" className={stylesReader.subheading}>
                    {__("reader.settings.margin")}
                </div>
                <input
                    type="range"
                    aria-labelledby="label_pageMargins"
                    onChange={(e) => this.props.handleIndexChange(e, "pageMargins")}
                    min={0}
                    max={optionsValues.pageMargins.length - 1}
                    value={this.props.indexes.pageMargins}
                    step={1}
                    aria-valuemin={0}
                    aria-valuemax={optionsValues.pageMargins.length - 1}
                    aria-valuenow={this.props.indexes.pageMargins}
                />
                <span className={stylesReader.reader_settings_value}>
                    {this.roundRemValue(readerConfig.pageMargins)}
                </span>
            </div>
            <div className={stylesReader.line_tab_content}>
                <div id="label_wordSpacing" className={stylesReader.subheading}>
                    {__("reader.settings.wordSpacing")}
                </div>
                <input
                    type="range"
                    aria-labelledby="label_wordSpacing"
                    onChange={(e) => this.props.handleIndexChange(e, "wordSpacing")}
                    min={0}
                    max={optionsValues.wordSpacing.length - 1}
                    value={this.props.indexes.wordSpacing}
                    step={1}
                    aria-valuemin={0}
                    aria-valuemax={optionsValues.wordSpacing.length - 1}
                    aria-valuenow={this.props.indexes.wordSpacing}
                />
                <span className={stylesReader.reader_settings_value}>
                    {this.roundRemValue(readerConfig.wordSpacing)}
                </span>
            </div>
            <div className={stylesReader.line_tab_content}>
                <div id="label_letterSpacing" className={stylesReader.subheading}>
                    {__("reader.settings.letterSpacing")}
                </div>
                <input
                    type="range"
                    aria-labelledby="label_letterSpacing"
                    onChange={(e) => this.props.handleIndexChange(e, "letterSpacing")}
                    min={0}
                    max={optionsValues.letterSpacing.length - 1}
                    value={this.props.indexes.letterSpacing}
                    step={1}
                    aria-valuemin={0}
                    aria-valuemax={optionsValues.letterSpacing.length - 1}
                    aria-valuenow={this.props.indexes.letterSpacing}
                />
                <span className={stylesReader.reader_settings_value}>
                    {this.roundRemValue(readerConfig.letterSpacing)}
                </span>
            </div>
            <div className={stylesReader.line_tab_content}>
                <div id="label_paraSpacing" className={stylesReader.subheading}>
                    {__("reader.settings.paraSpacing")}
                </div>
                <input
                    type="range"
                    aria-labelledby="label_paraSpacing"
                    onChange={(e) => this.props.handleIndexChange(e, "paraSpacing")}
                    min={0}
                    max={optionsValues.paraSpacing.length - 1}
                    value={this.props.indexes.paraSpacing}
                    step={1}
                    aria-valuemin={0}
                    aria-valuemax={optionsValues.paraSpacing.length - 1}
                    aria-valuenow={this.props.indexes.paraSpacing}
                />
                <span className={stylesReader.reader_settings_value}>
                    {this.roundRemValue(readerConfig.paraSpacing)}
                </span>
            </div>
            <div className={stylesReader.line_tab_content}>
                <div id="label_lineHeight" className={stylesReader.subheading}>
                    {__("reader.settings.lineSpacing")}
                </div>
                <input
                    type="range"
                    aria-labelledby="label_lineHeight"
                    onChange={(e) => this.props.handleIndexChange(e, "lineHeight")}
                    min={0}
                    max={optionsValues.lineHeight.length - 1}
                    value={this.props.indexes.lineHeight}
                    step={1}
                    aria-valuemin={0}
                    aria-valuemax={optionsValues.lineHeight.length - 1}
                    aria-valuenow={this.props.indexes.lineHeight}
                />
                <span className={stylesReader.reader_settings_value}>
                    {this.roundRemValue(readerConfig.lineHeight)}
                </span>
            </div>
        </>;
    }

    private toggleMediaOverlaysEnableSkippability() {
        // TODO: smarter clone?
        const readerConfig = JSON.parse(JSON.stringify(this.props.readerConfig));

        readerConfig.mediaOverlaysEnableSkippability = !readerConfig.mediaOverlaysEnableSkippability;
        this.props.setSettings(readerConfig);
    }
    private toggleTTSEnableSentenceDetection() {
        // TODO: smarter clone?
        const readerConfig = JSON.parse(JSON.stringify(this.props.readerConfig));

        readerConfig.ttsEnableSentenceDetection = !readerConfig.ttsEnableSentenceDetection;
        this.props.setSettings(readerConfig);
    }
    private toggleMediaOverlaysEnableCaptionsMode() {
        // TODO: smarter clone?
        const readerConfig = JSON.parse(JSON.stringify(this.props.readerConfig));

        readerConfig.mediaOverlaysEnableCaptionsMode = !readerConfig.mediaOverlaysEnableCaptionsMode;

        // TTS and MO both use the same checkbox, for "Captions / clean view"
        readerConfig.ttsEnableOverlayMode = !readerConfig.ttsEnableOverlayMode;

        this.props.setSettings(readerConfig);
    }
    // private toggleTTSEnableOverlayMode() {
    //     // TODO: smarter clone?
    //     const readerConfig = JSON.parse(JSON.stringify(this.props.readerConfig));

    //     readerConfig.ttsEnableOverlayMode = !readerConfig.ttsEnableOverlayMode;
    //     this.props.setSettings(readerConfig);
    // }

    private toggleReduceMotion() {
        // TODO: smarter clone?
        const readerConfig = JSON.parse(JSON.stringify(this.props.readerConfig));

        readerConfig.reduceMotion = !readerConfig.reduceMotion;
        this.props.setSettings(readerConfig);
    }

    private toggleNoFootnotes() {
        // TODO: smarter clone?
        const readerConfig = JSON.parse(JSON.stringify(this.props.readerConfig));

        readerConfig.noFootnotes = !readerConfig.noFootnotes;
        this.props.setSettings(readerConfig);
    }

    private toggleMathJax() {
        // TODO: smarter clone?
        const readerConfig = JSON.parse(JSON.stringify(this.props.readerConfig));

        readerConfig.enableMathJax = !readerConfig.enableMathJax;
        if (readerConfig.enableMathJax) {
            readerConfig.paged = false;
        }
        this.props.setSettings(readerConfig);
    }

    private handleChooseTheme(theme: themeType) {
        // TODO: smarter clone?
        const readerConfig = JSON.parse(JSON.stringify(this.props.readerConfig));

        let sepia = false;
        let night = false;

        switch (theme) {
            case themeType.Night:
                night = true;
                break;
            case themeType.Sepia:
                sepia = true;
                break;
        }
        readerConfig.sepia = sepia;
        readerConfig.night = night;

        this.props.setSettings(readerConfig);
    }

    // round the value to the hundredth
    private roundRemValue(value: string | undefined) {
        if (!value) {
            return "-";
        }

        // TODO: other potential CSS units?
        const nbr = parseFloat(value.replace("%", "").replace("rem", "").replace("em", "").replace("px", ""));
        const roundNumber = (Math.round(nbr * 100) / 100);
        return roundNumber ? roundNumber : " ";
    }

    private getButtonClassName(
        propertyName: keyof ReaderConfig,
        value: string | boolean,
        additionalClassName?: string): string {

        const property = this.props.readerConfig[propertyName];
        let classname = "";
        if (property === value) {
            classname = stylesReader.active;
        } else {
            classname = stylesReader.notUsed;
        }
        return classNames(classname, additionalClassName);
    }

    private getButtonClassNamePdf(
        test: boolean,
        additionalClassName?: string): string {

        let classname = "";
        if (test) {
            classname = stylesReader.active;
        } else {
            classname = stylesReader.notUsed;
        }
        return classNames(classname, additionalClassName);
    }
}

const mapDispatchToProps = (dispatch: TDispatch, props: IBaseProps) => {
    return {
        setDefaultConfig: (...config: Parameters<typeof readerActions.configSetDefault.build>) => {

            if (config.length === 0) {
                dispatch(readerActions.configSetDefault.build(readerConfigInitialState));
                dispatch(readerLocalActionSetConfig.build(readerConfigInitialState));
                props.setSettings(readerConfigInitialState);
            } else {
                dispatch(readerActions.configSetDefault.build(...config));
            }

            dispatch(toastActions.openRequest.build(ToastType.Success, "👍"));
        },
    };
};

const mapStateToProps = (_state: IReaderRootState) => {

    // TODO: extension or @type ?
    // const isDivina = this.props.r2Publication?.Metadata?.RDFType &&
    //    (/http[s]?:\/\/schema\.org\/ComicStrip$/.test(this.props.r2Publication.Metadata.RDFType) ||
    //    /http[s]?:\/\/schema\.org\/VisualNarrative$/.test(this.props.r2Publication.Metadata.RDFType));
    // const isDivina = path.extname(state?.reader?.info?.filesystemPath) === acceptedExtensionObject.divina;
    return {
        // isDivina,
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslator(ReaderOptions));
 */
