"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@octokit/rest");
const node_fetch_1 = __importStar(require("node-fetch"));
run();
async function run() {
    const o = new rest_1.Octokit({ auth: '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' });
    // const { data } = await o.request("/user");
    // console.log(data)
    const sha = 'fd3d6b191cf773f68ca6dfc57bc52e28513fd8d1';
    // const q = `repo:shiftcode/sc-commons next`
    // const q = `hash:${sha} repo:shiftcode/sc-commons rev:@*refs/heads/* type:diff`
    // const q = `repo:shiftcode/sc-commons@${sha} type:diff`
    // const q = `hash:${sha} rev:@*refs/heads/*`
    const q = `hash:${sha} repo:shiftcode/sc-commons rev:@refs/heads/#102-fix-peer-deps-version type:diff`;
    console.info(`q: ${q}`);
    const response = await o.rest.search.commits({ q });
    console.log(response);
    for (const { commit } of response.data.items) {
        console.log(`----------------- ${commit.url} -----------------`);
        console.log(commit.message);
        console.log('-------------------------------------------------');
    }
    const headers = new node_fetch_1.Headers();
    headers.set('Authorization', 'token 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');
    const response2 = await (0, node_fetch_1.default)(`https://api.github.com/repos/shiftcode/sc-commons/git/commits/${sha}`, {
        headers
    });
    console.log(response2.status);
    console.log(await response2.json());
}
