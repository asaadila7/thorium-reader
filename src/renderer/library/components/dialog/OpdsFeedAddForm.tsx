// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as React from "react";
import { DialogClose, DialogCloseButton, DialogFooter, DialogHeader, DialogTitle, DialogWithRadix, DialogWithRadixContent, DialogWithRadixTrigger } from "readium-desktop/renderer/common/components/dialog/DialogWithRadix";
import * as stylesButtons from "readium-desktop/renderer/assets/styles/components/buttons.css";
import SVG from "readium-desktop/renderer/common/components/SVG";
import * as AddIcon from "readium-desktop/renderer/assets/icons/add-alone.svg";
import { useApi } from "readium-desktop/renderer/common/hooks/useApi";
import { useTranslator } from "readium-desktop/renderer/common/hooks/useTranslator";
import * as stylesInputs from "readium-desktop/renderer/assets/styles/components/inputs.css";
import * as stylesModals from "readium-desktop/renderer/assets/styles/components/modals.css";
import "readium-desktop/renderer/assets/styles/components/catalog.scss";
import classNames from "classnames";
import * as InfoIcon from "readium-desktop/renderer/assets/icons/outline-info-24px.svg";
import * as ChevronDown from "readium-desktop/renderer/assets/icons/chevron-down.svg";
import * as ChevronUp from "readium-desktop/renderer/assets/icons/chevron-up.svg";
import * as FollowLinkIcon from "readium-desktop/renderer/assets/icons/followLink-icon.svg";
import * as penIcon from "readium-desktop/renderer/assets/icons/pen-icon.svg";
import * as linkIcon from "readium-desktop/renderer/assets/icons/link-icon.svg";

export const OpdsFeedAddForm = () => {
    const [__] = useTranslator();
    const [, apiAddFeedAction] = useApi(undefined, "opds/addFeed");

    const [title, setTitle] = React.useState("");
    const [url, setUrl] = React.useState("");
    const [infoOpen, setInfoOpen] = React.useState(false);
    const addAction = () => {
        if (!title || !url) {
            return;
        }
        apiAddFeedAction({ title, url });
    };

    const openInfo = (e: any) => {
        e.preventDefault();
        setInfoOpen(!infoOpen);
    };

    return <DialogWithRadix>
        <DialogWithRadixTrigger asChild>
            <button
                className={stylesButtons.button_primary}
            >
                <SVG ariaHidden={true} svg={AddIcon} />
                <span>{__("opds.addMenu")}</span>
            </button>
        </DialogWithRadixTrigger>
        <DialogWithRadixContent>
            <DialogHeader>
                <DialogTitle>
                    {__("opds.addMenu")}
                </DialogTitle>
                <div>
                    <DialogCloseButton />
                </div>
            </DialogHeader>
            <form className={stylesModals.modal_dialog_body}>
                <div className={classNames(stylesInputs.form_group, stylesInputs.form_group_catalog)}>
                    <label htmlFor="title">{__("opds.addForm.name")}</label>
                    <i><SVG ariaHidden svg={penIcon} /></i>
                    <input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e?.target?.value)}
                        type="text"
                        aria-label={__("opds.addForm.name")}
                        // placeholder={__("opds.addForm.namePlaceholder")}
                        required
                    />
                </div>
                <div className={classNames(stylesInputs.form_group, stylesInputs.form_group_catalog)}>
                    <label htmlFor="url">{__("opds.addForm.url")}</label>
                    {/* <Form.Control asChild> */}
                    <i><SVG ariaHidden svg={linkIcon} /></i>
                    <input
                        id="url"
                        value={url}
                        onChange={(e) => setUrl(e?.target?.value)}
                        type="text"
                        aria-label={__("opds.addForm.url")}
                        // placeholder={__("opds.addForm.urlPlaceholder")}
                        required
                    />
                </div>
                <div>
                    <button className="button_catalog_infos" onClick={(e) => openInfo(e)}>
                        <SVG ariaHidden svg={InfoIcon} />
                        What is OPDS?
                        <SVG ariaHidden svg={infoOpen ? ChevronUp : ChevronDown} />
                    </button>
                    { infoOpen ?
                    <div className="catalog_infos_text">
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                            Phasellus elit libero, pharetra vitae cursus sed, tincidunt et elit.
                            Morbi laoreet iaculis nibh, non condimentum nulla euismod sed.
                        </p>
                        <a href="#">
                            Vivamus quis pharetra eros.
                            <SVG ariaHidden svg={FollowLinkIcon} />
                        </a>
                    </div>
                    : <></>}
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <button className={stylesButtons.button_secondary_blue}>{__("dialog.cancel")}</button>
                    </DialogClose>
                    <DialogClose asChild>
                        <button type="submit" disabled={!title || !url} className={stylesButtons.button_primary_blue} onClick={() => addAction()}>
                            <SVG ariaHidden svg={AddIcon} />
                            {__("opds.addForm.addButton")}
                        </button>
                    </DialogClose>
                </DialogFooter>
            </form>
        </DialogWithRadixContent>
    </DialogWithRadix>;
};

export default OpdsFeedAddForm;