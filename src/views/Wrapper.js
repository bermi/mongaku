// @flow

const qs = require("querystring");

const moment = require("moment");
const React = require("react");

const urls = require("../lib/urls");
const searchURL = require("../logic/shared/search-url");

import type {User, Options} from "./types.js";

class Wrapper extends React.Component {
    getChildContext() {
        const {originalUrl, user, options, lang, gettext, format} = this.props;

        return {
            lang,
            gettext,
            format,
            user,
            options,

            getOtherURL(locale: string): string {
                return urls.gen(locale, originalUrl);
            },

            URL(path: string, query?: Object): string {
                let url = urls.gen(lang, path);

                if (query) {
                    url = url + (url.indexOf("?") >= 0 ? "&" : "?") +
                        qs.stringify(query);
                }

                return url;
            },

            // Format a number using commas
            stringNum(num: number): string {
                // TODO(jeresig): Have a better way to handle this.
                const separator = lang === "en" ? "," : ".";
                const result = (typeof num === "number" ? num : "");
                return result.toString().replace(/\B(?=(\d{3})+(?!\d))/g,
                    separator);
            },

            relativeDate(date: Date): string {
                return moment(date).locale(lang).fromNow();
            },

            fixedDate(date: Date): string {
                return moment(date).locale(lang).format("LLL");
            },

            searchURL(params: Object): string {
                return searchURL({lang}, params);
            },
        };
    }

    props: {
        originalUrl: string,
        lang: string,
        user: User,
        options: Options,
        gettext: (text: string) => string,
        format: (text: string, options: {}) => string,
        children?: React.Element<*>,
    }

    render() {
        return this.props.children;
    }
}

Wrapper.childContextTypes = {
    lang: React.PropTypes.string,
    gettext: React.PropTypes.func,
    format: React.PropTypes.func,
    user: React.PropTypes.any,
    options: React.PropTypes.any,
    getOtherURL: React.PropTypes.func,
    URL: React.PropTypes.func,
    stringNum: React.PropTypes.func,
    relativeDate: React.PropTypes.func,
    fixedDate: React.PropTypes.func,
    searchURL: React.PropTypes.func,
};

module.exports = Wrapper;
