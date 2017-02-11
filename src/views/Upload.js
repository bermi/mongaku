// @flow

const React = require("react");

const Page = require("./Page.js");

import type {Context} from "./types.js";
const {childContextTypes} = require("./Wrapper.js");

type ImageType = {
    _id: string,
    getOriginalURL: () => string,
    getScaledURL: () => string,
    getThumbURL: () => string,
};

type RecordType = {
    _id: string,
    type: string,
    url: string,
    images: Array<ImageType>,
    getOriginalURL: () => string,
    getThumbURL: () => string,
    getTitle: () => string,
    getSource: () => Source,
    getURL: (lang: string) => string,
};

type Source = {
    _id: string,
    name: string,
    getURL: (lang: string) => string,
    getFullName: (lang: string) => string,
    getShortName: (lang: string) => string,
};

type MatchType = {
    _id: string,
    recordModel: RecordType,
    score: number,
};

type Props = {
    image: ImageType,
    similar: Array<MatchType>,
    title: string,
};

const UploadedImage = ({image}: Props, {gettext}: Context) => {
    const title = gettext("Uploaded Image");

    return <div className="panel panel-default">
        <div className="panel-heading">
            <strong>{gettext("Uploaded Image")}</strong>
        </div>
        <div className="panel-body">
            <a href={image.getOriginalURL()}>
                <img src={image.getScaledURL()}
                    alt={title}
                    title={title}
                    className="img-responsive center-block"
                />
            </a>
        </div>
    </div>;
};

UploadedImage.contextTypes = childContextTypes;

const Match = ({
    match: {recordModel, score},
}: Props & {match: MatchType}, {
    format,
    gettext,
    lang,
}: Context) => {
    const source = recordModel.getSource();

    return <div className="img col-md-6 col-sm-4 col-xs-6">
        <div className="img-wrap">
            <a href={recordModel.getURL(lang)}>
                <img src={recordModel.getThumbURL()}
                    alt={recordModel.getTitle(lang)}
                    title={recordModel.getTitle(lang)}
                    className="img-responsive center-block"
                />
            </a>
        </div>
        <div className="details">
            <div className="wrap">
                <span>{format(gettext("Score: %(score)s"),
                    {score: score})}</span>

                <a className="pull-right"
                    href={source.getURL(lang)}
                    title={source.getFullName(lang)}
                >
                    {source.getShortName(lang)}
                </a>
            </div>
        </div>
    </div>;
};

Match.contextTypes = childContextTypes;

const Results = (props: Props, {gettext}: Context) => {
    const {similar} = props;

    let similarResults;

    if (similar.length === 0) {
        similarResults = <div className="col-xs-12">
            <p>{gettext("No similar images were found.")}</p>
        </div>;
    } else {
        similarResults = similar.map((match) =>
            <Match {...props} match={match} key={match.recordModel._id} />);
    }

    return <div className="panel panel-default">
        <div className="panel-heading">
            <strong>{gettext("Similar Images")}</strong>
        </div>
        <div className="panel-body row">
            {similarResults}
        </div>
    </div>;
};

Results.contextTypes = childContextTypes;

const Upload = (props: Props) => {
    const {title} = props;

    return <Page title={title}>
        <div className="row">
            <div className="col-md-6">
                <UploadedImage {...props} />
            </div>
            <div className="col-md-6">
                <Results {...props} />
            </div>
        </div>
    </Page>;
};

module.exports = Upload;
