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
const https = __importStar(require("https"));
const token = process.env.GH_TOKEN;
const sha = process.env.GH_SHA;
console.log(`try resolving commit for sha ${sha} using gh token ${token}`);
runWithOctokit()
    .then(() => runOther());
async function runWithOctokit() {
    console.log(`### execution with octokit client`);
    const o = new rest_1.Octokit({ auth: token });
    const { data } = await o.request('/user');
    console.log(`current user: ${data.login}`);
    // query try out
    /*
    const q = `repo:shiftcode/sc-commons next`
    const q = `hash:${sha} repo:shiftcode/sc-commons rev:@*refs/heads/* type:diff`
    const q = `repo:shiftcode/sc-commons@${sha} type:diff`
    const q = `hash:${sha} rev:@*refs/heads/*`
    */
    const q = `hash:${sha} repo:shiftcode/sc-commons rev:@refs/heads/#102-fix-peer-deps-version`;
    console.info(`execute with search query: ${q}`);
    const response = await o.rest.search.commits({ q });
    // seems like octokit will only return commits from default branch
    console.log(`found ${response.data.total_count} commits for sha ${sha}`);
    for (const { commit } of response.data.items) {
        console.log(`----------------- ${commit.url} -----------------`);
        console.log(commit.message);
        console.log('-------------------------------------------------');
    }
}
async function runOther() {
    console.log(`### execution with plain http request`);
    const url = `https://api.github.com/repos/shiftcode/sc-commons/git/commits/${sha}`;
    console.log(url);
    const commit = (await fetch(url)); /* and others */
    console.log(`----------------- ${commit.url} -----------------`);
    console.log(commit.message);
    console.log('-------------------------------------------------');
}
async function fetch(url) {
    return new Promise((resolve) => {
        https.get(url, {
            headers: {
                Authorization: `token ${token}`,
                'User-Agent': 'Github Skip Action',
            },
        }, res => {
            let data = '';
            res.on('data', chunk => {
                data += chunk;
            });
            res.on('end', () => {
                resolve(JSON.parse(data));
            });
        });
    });
}
