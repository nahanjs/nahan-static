'use strict';

const fse = require('fs-extra');
const path = require('path');

module.exports = Static;

function Static(root) {
    root = path.normalize(root);

    return async (ctx, next) => {
        if (ctx.path === undefined)
            ctx.path = ctx.req.url.split('?')[0];

        if (ctx.req.method !== 'GET') {
            await next();
        } else {
            const target = path.join(root, ctx.path);
            if (! await fse.pathExists(target)) {
                await next();
            } else {
                const data = await fse.readFile(target);
                ctx.res.write(data);
            }
        }
    };
}
