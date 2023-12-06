// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as React from "react";

import * as stylesDropDown from "readium-desktop/renderer/assets/styles/components/dropdown.css";
import * as Popover from "@radix-ui/react-popover";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IBaseProps {
    button: React.ReactElement;
}

const Menu = (props: React.PropsWithChildren<IBaseProps>) => {
    const appOverlayElement = React.useMemo(() => document.getElementById("app-overlay"), []);
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button>
                    {props.button}
                </button>
            </Popover.Trigger>
            <Popover.Portal container={appOverlayElement}>
                <Popover.Content className="PopoverContent" sideOffset={5} style={{zIndex: "10000"}}>
                    <div className={stylesDropDown.dropdown_menu}>
                        {props.children}
                    </div>
                    <Popover.Arrow className="PopoverArrow" aria-hidden />
                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    );
};

export default (Menu);
