// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as React from "react";
import * as AddIcon from "readium-desktop/renderer/assets/icons/add-alone.svg";
import * as stylesButtons from "readium-desktop/renderer/assets/styles/components/buttons.css";
import SVG from "readium-desktop/renderer/common/components/SVG";
import { DialogWithRadixContainer, DialogWithRadixTrigger, DialogWithRadix, DialogTitle, DialogHeader, DialogContent, DialogCloseButton } from "readium-desktop/renderer/common/components/dialog/DialogWithRadix";
// import * as stylesModals from "readium-desktop/renderer/assets/styles/components/modals.css";
import { ApiappAddFormContainer } from "readium-desktop/renderer/library/components/dialog/ApiappAddForm";
import OpdsFeedAddForm from "../dialog/OpdsFeedAddForm";
import { useTranslator } from "readium-desktop/renderer/common/hooks/useTranslator"; 


const OpdsAddForm: React.FC = () => {
    const [__] = useTranslator();
    return (
        <section>
            <DialogWithRadix>
                <DialogWithRadixTrigger asChild>
                    <button
                        className={stylesButtons.button_primary}
                    >
                        <SVG ariaHidden={true} svg={AddIcon}/> 
                        <span>{ __("opds.addForm.title")}</span>
                    </button> 
                </DialogWithRadixTrigger>
                <DialogWithRadixContainer>
                    <DialogHeader >
                        <DialogTitle>
                            {__("opds.addForm.title")}
                        </DialogTitle>
                        <div>
                            <DialogCloseButton />
                        </div>
                    </DialogHeader>
                    <DialogContent>
                        <OpdsFeedAddForm />
                    </DialogContent>
                    {/* <DialogFooter /> */}
                </DialogWithRadixContainer>
            </DialogWithRadix>


            <DialogWithRadix>
                <DialogWithRadixTrigger asChild>
                    <button
                        className={stylesButtons.button_primary}
                    >
                        <SVG ariaHidden={true} svg={AddIcon} />
                        <span>{__("opds.addFormApiapp.title")}</span>
                    </button>
                </DialogWithRadixTrigger>
                    <DialogWithRadixContainer>
                        <ApiappAddFormContainer/>
                    </DialogWithRadixContainer>
            </DialogWithRadix>
        </section>
    );

}

export default OpdsAddForm;
