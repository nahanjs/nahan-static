'use strict';

const fse = require('fs-extra');
const path = require('path');

module.exports = Static;

const extensions = ['', '.html'];

function Static(root) {
    root = path.normalize(root);

    return async (ctx, next) => {
        if (ctx.path === undefined)
            ctx.path = ctx.req.url.split('?')[0];

        if (ctx.req.method !== 'GET') {
            await next();
        } else {
            let target;
            if (ctx.path === '/')
                target = path.join(root, 'index.html');
            else
                target = path.join(root, ctx.path);

            let found = false;
            for (let ext of extensions) {
                if (await fse.pathExists(target + ext)) {
                    target += ext;
                    found = true;
                    break;
                }
            }

            if (found) {
                const data = await fse.readFile(target);
                ctx.res.end(data);
            } else {
                await next();
            }
        }
    };
}
