"use strict";

const async = require("async");

const record = require("../lib/record");
const models = require("../lib/models");
const options = require("../lib/options");

module.exports = function(app) {
    const Source = models("Source");

    const cache = require("../server/middlewares/cache");
    const search = require("./shared/search");

    return {
        search,

        bySource(req, res) {
            try {
                search(req, res, {
                    url: Source.getSource(req.params.source).url,
                });

            } catch (e) {
                return res.status(404).render("Error", {
                    title: req.gettext("Source not found."),
                });
            }
        },

        show(req, res, next) {
            const Record = record(req.params.type);
            const compare = ("compare" in req.query);
            const id = `${req.params.source}/${req.params.recordName}`;

            Record.findById(id, (err, record) => {
                if (err || !record) {
                    // We don't return a 404 here to allow this to pass
                    // through to other handlers
                    return next();
                }

                record.loadImages(true, () => {
                    // TODO: Handle error loading images?
                    const title = record.getTitle(req);

                    // Sort the similar records by score
                    record.similarRecords = record.similarRecords
                        .sort((a, b) => b.score - a.score);

                    if (!compare) {
                        return res.render("Record", {
                            title,
                            compare: false,
                            records: [record],
                            similar: record.similarRecords,
                            sources: Source.getSources(),
                        });
                    }

                    async.eachLimit(record.similarRecords, 4,
                        (similar, callback) => {
                            similar.recordModel.loadImages(false, callback);
                        }, () => {
                            res.render("Record", {
                                title,
                                compare: true,
                                noIndex: true,
                                similar: [],
                                records: [record]
                                    .concat(record.similarRecords
                                        .map((similar) => similar.recordModel)),
                                sources: Source.getSources(),
                            });
                        });
                });
            });
        },

        edit(req, res, next) {
            const Record = record(req.params.type);
            const id = `${req.params.source}/${req.params.recordName}`;

            Record.findById(id, (err, record) => {
                if (err || !record) {
                    // We don't return a 404 here to allow this to pass
                    // through to other handlers
                    return next();
                }

                record.loadImages(true, () => {
                    res.render("EditRecord", {
                        record,
                    });
                });
            });
        },

        routes() {
            app.get("/search", cache(1), this.search);
            app.get("/:type/search", cache(1), this.search);
            app.get("/source/:source", cache(1), this.bySource);
            app.get("/:type/source/:source", cache(1), this.bySource);

            for (const typeName in options.types) {
                const searchURLs = options.types[typeName].searchURLs;
                for (const path in searchURLs) {
                    app.get(`/:type${path}`, cache(1), (req, res) =>
                        searchURLs[path](req, res, search));
                }
            }

            // Handle these last as they'll catch almost anything
            app.get("/:type/:source/:recordName/edit", this.edit);
            app.get("/:type/:source/:recordName", this.show);
        },
    };
};
