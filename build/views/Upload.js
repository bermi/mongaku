"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const React = require("react");

const Page = require("./Page.js");

var babelPluginFlowReactPropTypes_proptype_Context = require("./types.js").babelPluginFlowReactPropTypes_proptype_Context || require("react").PropTypes.any;

const { childContextTypes } = require("./Wrapper.js");

const UploadedImage = ({ image }, { gettext }) => {
    const title = gettext("Uploaded Image");

    return React.createElement(
        "div",
        { className: "panel panel-default" },
        React.createElement(
            "div",
            { className: "panel-heading" },
            React.createElement(
                "strong",
                null,
                gettext("Uploaded Image")
            )
        ),
        React.createElement(
            "div",
            { className: "panel-body" },
            React.createElement(
                "a",
                { href: image.getOriginalURL() },
                React.createElement("img", { src: image.getScaledURL(),
                    alt: title,
                    title: title,
                    className: "img-responsive center-block"
                })
            )
        )
    );
};

UploadedImage.propTypes = {
    image: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getScaledURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired
    }).isRequired,
    similar: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        recordModel: require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            type: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired,
            images: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
                _id: require("react").PropTypes.string.isRequired,
                getOriginalURL: require("react").PropTypes.func.isRequired,
                getScaledURL: require("react").PropTypes.func.isRequired,
                getThumbURL: require("react").PropTypes.func.isRequired
            })).isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired,
            getTitle: require("react").PropTypes.func.isRequired,
            getSource: require("react").PropTypes.func.isRequired,
            getURL: require("react").PropTypes.func.isRequired
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    title: require("react").PropTypes.string.isRequired
};
UploadedImage.contextTypes = childContextTypes;

const Match = ({
    match: { recordModel, score }
}, {
    getTitle,
    URL,
    format,
    gettext,
    fullName,
    shortName
}) => {
    const source = recordModel.getSource();

    return React.createElement(
        "div",
        { className: "img col-md-6 col-sm-4 col-xs-6" },
        React.createElement(
            "div",
            { className: "img-wrap" },
            React.createElement(
                "a",
                { href: URL(recordModel) },
                React.createElement("img", { src: recordModel.getThumbURL(),
                    alt: getTitle(recordModel),
                    title: getTitle(recordModel),
                    className: "img-responsive center-block"
                })
            )
        ),
        React.createElement(
            "div",
            { className: "details" },
            React.createElement(
                "div",
                { className: "wrap" },
                React.createElement(
                    "span",
                    null,
                    format(gettext("Score: %(score)s"), { score: score })
                ),
                React.createElement(
                    "a",
                    { className: "pull-right",
                        href: URL(source),
                        title: fullName(source)
                    },
                    shortName(source)
                )
            )
        )
    );
};

Match.contextTypes = childContextTypes;

const Results = (props, { gettext }) => {
    const { similar } = props;

    let similarResults;

    if (similar.length === 0) {
        similarResults = React.createElement(
            "div",
            { className: "col-xs-12" },
            React.createElement(
                "p",
                null,
                gettext("No similar images were found.")
            )
        );
    } else {
        similarResults = similar.map(match => React.createElement(Match, _extends({}, props, { match: match, key: match.recordModel._id })));
    }

    return React.createElement(
        "div",
        { className: "panel panel-default" },
        React.createElement(
            "div",
            { className: "panel-heading" },
            React.createElement(
                "strong",
                null,
                gettext("Similar Images")
            )
        ),
        React.createElement(
            "div",
            { className: "panel-body row" },
            similarResults
        )
    );
};

Results.propTypes = {
    image: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getScaledURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired
    }).isRequired,
    similar: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        recordModel: require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            type: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired,
            images: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
                _id: require("react").PropTypes.string.isRequired,
                getOriginalURL: require("react").PropTypes.func.isRequired,
                getScaledURL: require("react").PropTypes.func.isRequired,
                getThumbURL: require("react").PropTypes.func.isRequired
            })).isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired,
            getTitle: require("react").PropTypes.func.isRequired,
            getSource: require("react").PropTypes.func.isRequired,
            getURL: require("react").PropTypes.func.isRequired
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    title: require("react").PropTypes.string.isRequired
};
Results.contextTypes = childContextTypes;

const Upload = props => {
    const { title } = props;

    return React.createElement(
        Page,
        { title: title },
        React.createElement(
            "div",
            { className: "row" },
            React.createElement(
                "div",
                { className: "col-md-6" },
                React.createElement(UploadedImage, props)
            ),
            React.createElement(
                "div",
                { className: "col-md-6" },
                React.createElement(Results, props)
            )
        )
    );
};

Upload.propTypes = {
    image: require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        getOriginalURL: require("react").PropTypes.func.isRequired,
        getScaledURL: require("react").PropTypes.func.isRequired,
        getThumbURL: require("react").PropTypes.func.isRequired
    }).isRequired,
    similar: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
        _id: require("react").PropTypes.string.isRequired,
        recordModel: require("react").PropTypes.shape({
            _id: require("react").PropTypes.string.isRequired,
            type: require("react").PropTypes.string.isRequired,
            url: require("react").PropTypes.string.isRequired,
            images: require("react").PropTypes.arrayOf(require("react").PropTypes.shape({
                _id: require("react").PropTypes.string.isRequired,
                getOriginalURL: require("react").PropTypes.func.isRequired,
                getScaledURL: require("react").PropTypes.func.isRequired,
                getThumbURL: require("react").PropTypes.func.isRequired
            })).isRequired,
            getOriginalURL: require("react").PropTypes.func.isRequired,
            getThumbURL: require("react").PropTypes.func.isRequired,
            getTitle: require("react").PropTypes.func.isRequired,
            getSource: require("react").PropTypes.func.isRequired,
            getURL: require("react").PropTypes.func.isRequired
        }).isRequired,
        score: require("react").PropTypes.number.isRequired
    })).isRequired,
    title: require("react").PropTypes.string.isRequired
};
module.exports = Upload;