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
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const node_fetch_1 = __importStar(require("node-fetch"));
var INPUT_PARAMS;
(function (INPUT_PARAMS) {
    INPUT_PARAMS["SKIP_ON_COMMIT_MSG"] = "skipOnCommitMsg";
    INPUT_PARAMS["GH_TOKEN"] = "githubToken";
})(INPUT_PARAMS || (INPUT_PARAMS = {}));
var OUTPUT_PARAMS;
(function (OUTPUT_PARAMS) {
    OUTPUT_PARAMS["SHOULD_EXECUTE"] = "shouldExecute";
})(OUTPUT_PARAMS || (OUTPUT_PARAMS = {}));
async function run() {
    try {
        const skipOnCommitMsg = core.getInput(INPUT_PARAMS.SKIP_ON_COMMIT_MSG);
        const ghToken = core.getInput(INPUT_PARAMS.GH_TOKEN);
        core.debug(`reading git commit message to resolve the output variable, output variable will be true if commit message contains message "${skipOnCommitMsg}"`);
        const octokit = github.getOctokit(ghToken);
        octokit.rest;
        const { eventName } = github.context;
        core.info(`event name: ${eventName}`);
        let sha = '';
        switch (eventName) {
            case 'pull_request':
                core.info(JSON.stringify(github.context.payload.pull_request));
                sha = github.context.payload.pull_request?.head.sha ?? `unknown`;
                break;
            case 'push':
                sha = github.context.sha;
                break;
            default:
                core.setFailed(`no implementation for event name ${eventName}`);
                return;
        }
        core.info(`sha: ${sha}`);
        if (sha) {
            const q = `hash:${sha}`;
            console.info(`q: ${q}`);
            const response = await (0, node_fetch_1.default)(`https://api.github.com/repos/shiftcode/sc-commons/git/commits/${sha}`, { headers: new node_fetch_1.Headers({ Authorization: `token ${ghToken}` }) });
            if (response.status >= 200 && response.status < 300) {
                // ok
                const commit = await response.json();
                const commitMessage = commit.message;
                core.info(`commit message to check against ${commitMessage}`);
                if (commitMessage.includes(skipOnCommitMsg)) {
                    core.setOutput(OUTPUT_PARAMS.SHOULD_EXECUTE, false);
                    return;
                }
            }
            else {
                core.setFailed(`could not find commit for sha ${sha} -> got status code ${response.status}: ${response.statusText}`);
            }
        }
        core.setOutput(OUTPUT_PARAMS.SHOULD_EXECUTE, true);
    }
    catch (error) {
        core.error('there was an error');
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
        try {
            core.setFailed(JSON.stringify(error));
        }
        catch (err) {
            core.setFailed(`there was an error, can't print JSON.stringify failed`);
        }
    }
}
run();
