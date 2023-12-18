// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as React from "react"
import LibraryLayout from "../layout/LibraryLayout"
import Header from "../opds/Header";
import { useTranslator } from "readium-desktop/renderer/common/hooks/useTranslator";
import * as stylesInput from "readium-desktop/renderer/assets/styles/components/inputs.css"
import SVG from "readium-desktop/renderer/common/components/SVG";
import * as SearchIcon from "readium-desktop/renderer/assets/icons/search-icon.svg";
import { useAsyncDebounce } from "react-table";

const SearchPub = (props: any) => {

    const onInputChange = useAsyncDebounce((v) => {

        // if (v) {}
        props.setShowColumnFilters(false);

        props.setGlobalFilter(v);
    }, 500);

    return (
        <div className={stylesInput.form_group} style={{backgroundColor: "white", width: "370px", height: "30px"}}>
        <label
            id="globalSearchLabel"
            htmlFor="globalSearchInput"
            style={{
                backgroundColor: "var(--color-figma-grey)",
                top: "-19px"
            }}>
            {`${props.__("header.searchPlaceholder")}`}
        </label>
        <i style={{position: "relative", width: "25px", height: "25px", margin: "auto"}}><SVG ariaHidden svg={SearchIcon} /></i>
        {/*
        value={value || ""}
        */}
        <input
            id="globalSearchInput"
            aria-labelledby="globalSearchLabel"
            ref={props.focusInputRef}
            type="search"

            onChange={(e) => {
                // setValue(e.target.value);
                if (!props.accessibilitySupportEnabled) {
                    onInputChange((e.target.value || "").trim() || undefined);
                }
            }}
            onKeyUp={(e) => {
                if (props.accessibilitySupportEnabled && e.key === "Enter") {
                    props.setShowColumnFilters(false);
                    props.setGlobalFilter( // value
                        (props.focusInputRef?.current?.value || "").trim() || undefined);
                }
            }}
            placeholder={`${props.__("header.searchTitle")}`}
            style={{
                margin: "0",
                marginLeft: "0.4em",
                width: "100%",
                padding: "0.2em",
                height: "30px"
            }}
            />
            <div
                aria-live="assertive"
                style={{
                    // border: "1px solid red",
                    marginLeft: "0.4em",
                    display: "inline-block",
                    // width: "4em",
                    overflow: "visible",
                    whiteSpace: "nowrap",
                }}>
            {props.globalFilteredRows.length !== props.preGlobalFilteredRows.length ? ` (${props.globalFilteredRows.length} / ${props.preGlobalFilteredRows.length})` : ` (${props.preGlobalFilteredRows.length})`}
        </div>
        {props.accessibilitySupportEnabled ? <button
            style={{
                margin: "0",
                marginLeft: "0.4em",
                padding: "0.6em",
            }}
            onClick={() => {
                props.setShowColumnFilters(false);
                props.setGlobalFilter( // value
                    (props.focusInputRef?.current?.value || "").trim() || undefined);
            }}
        >{`${props.__("header.searchPlaceholder")}`}</button> : <></>}
    </div>
    )
}

const AllPublicationGrid = () => {
    const[ __ ] = useTranslator(); 
    const title = __("catalog.allBooks");
    const secondaryHeader = <Header />;

    return (
        <LibraryLayout
        title={`${__("catalog.myBooks")} / ${title}`}
        secondaryHeader={secondaryHeader}
        >
            <SearchPub />
        </LibraryLayout>
    )
}

export default AllPublicationGrid;