// @flow

const qs = require("querystring");

import type {Source, Options} from "./types.js";

declare var Intl;

module.exports = (
    lang: string,
    options: Options,
    translations: {
        [message: string]: ?Array<string>,
    },
) => {
    const urls = require("../lib/urls")(options);
    const numberFormat = new Intl.NumberFormat(lang);
    const dateFormat = new Intl.DateTimeFormat(lang);

    return {
        getOtherURL(originalUrl: string, locale: string): string {
            return urls.gen(locale, originalUrl);
        },

        URL(path: string, query?: Object): string {
            let url = urls.gen(lang, path);

            if (query) {
                url =
                    url +
                    (url.indexOf("?") >= 0 ? "&" : "?") +
                    qs.stringify(query);
            }

            return url;
        },

        STATIC(path: string): string {
            return urls.genStatic(path);
        },

        // Format a number using commas
        stringNum(num: number): string {
            try {
                return numberFormat.format(num);
            } catch (e) {
                return num.toString();
            }
        },

        fixedDate(date: Date): string {
            try {
                return dateFormat.format(date);
            } catch (e) {
                return date.toString();
            }
        },

        format(fmt: string = "", props: {[key: string]: any}): string {
            return fmt.replace(/%\(\s*([^)]+)\s*\)s/g, (m, v) =>
                String(props[v.trim()]),
            );
        },

        gettext(message: string): string {
            const translation = translations[message];

            return translation && translation[1] ? translation[1] : message;
        },

        getSource(sourceId: string, sources: Array<Source>): ?Source {
            for (const source of sources) {
                if (source._id === sourceId) {
                    return source;
                }
            }
        },
    };
};
