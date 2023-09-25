// ==LICENSE-BEGIN==
// Copyright 2017 European Digital Reading Lab. All rights reserved.
// Licensed to the Readium Foundation under one or more contributor license agreements.
// Use of this source code is governed by a BSD-style license
// that can be found in the LICENSE file exposed on Github (readium) in the project repository.
// ==LICENSE-END==

import * as moment from "moment";
import * as React from "react";
import { TPublication } from "readium-desktop/common/type/publication.type";
import * as stylesBookDetailsDialog from "readium-desktop/renderer/assets/styles/bookDetailsDialog.css";
import { useTranslator } from "readium-desktop/renderer/common/hooks/useTranslator";

export interface IProps {
    publicationViewMaybeOpds: TPublication;
}

export const FormatPublisherDate: React.FC<IProps> = (props) => {

    const { publicationViewMaybeOpds } = props;
    const [__] = useTranslator();

    let formatedPublishedDateComponent = (<></>);

    if (publicationViewMaybeOpds.publishedAt) {
        const date = moment(publicationViewMaybeOpds.publishedAt).format("L");
        if (date) {
            formatedPublishedDateComponent = (
                <div>
                    <strong>{__("catalog.released")}</strong> <i className={stylesBookDetailsDialog.allowUserSelect}>{date}</i>
                </div>
            );
        }
    }

    return formatedPublishedDateComponent;
};
